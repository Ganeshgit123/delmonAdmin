import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/shared/auth.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-drivers',
  templateUrl: './drivers.component.html',
  styleUrls: ['./drivers.component.scss']
})
export class DriversComponent implements OnInit {
  displayedColumns: string[];
  dataSource: MatTableDataSource<any>;
  getvalue = [];
  isEdit = false;
  driverForm: FormGroup;
  driverImg = null;
  submitted = false;
  driverId: any;
  iconImg = null;
  fileImgUpload: any;
  iconImgUrl: any;
  showAccept = true;
  superAdminRole = false;

  @ViewChild(MatPaginator) matPaginator: MatPaginator;
  @ViewChild(MatSort) matSort: MatSort;

  constructor(private modalService: NgbModal, public fb: FormBuilder, public authService: AuthService,
    private toastr: ToastrService, private router: Router, private spinner: NgxSpinnerService,
    private translate: TranslateService,) { }

  ngOnInit(): void {
    this.callRolePermission();
    if (sessionStorage.getItem('roleName') == 'superAdmin') {
      this.superAdminRole = true;
    } else {
      this.superAdminRole = false;
    }

    if (this.showAccept == true) {
      this.displayedColumns = ['index', 'userName', 'employeeId', 'employeeCode', 'email', 'mobileNumber', 'image', 'rowActionToggle', 'rowActionIcon'];
    } else if (this.showAccept == false) {
      this.displayedColumns = ['index', 'userName', 'employeeId', 'employeeCode', 'email', 'mobileNumber', 'image'];
    }

    this.authService.getDrivers().subscribe(
      (res: any) => {
        this.getvalue = res.data.reverse();
        this.dataSource = new MatTableDataSource(this.getvalue);
        this.dataSource.paginator = this.matPaginator;
        this.dataSource.sort = this.matSort;
      }
    );

    this.driverForm = this.fb.group({
      userName: ['', [Validators.required]],
      employeeId: ['', [Validators.required]],
      employeeCode: ['', [Validators.required]],
      email: ['', [Validators.required]],
      mobileNumber: [''],
      password: ['', [Validators.required]],
      image: [''],
      type: 'POULTRY',
    });
  }

  get f() { return this.driverForm.controls; }

  callRolePermission() {
    if (sessionStorage.getItem('roleName') !== 'superAdmin') {
      let settingPermssion = JSON.parse(sessionStorage.getItem('permission'))
      const orderPermission = settingPermssion?.find(ele => ele.area == 'drivers')?.write == 1
      // console.log("fef",orderPermission)
      this.showAccept = orderPermission
    }
  }

  ngAfterViewInit(): void {
    this.matPaginator._intl.itemsPerPageLabel = this.translate.instant("itemsPerPage");
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openModal(content) {
    this.submitted = false;
    this.driverForm.reset();
    this.isEdit = false;
    this.driverImg = null;
    this.modalService.open(content, { centered: true, size: 'lg' });
  }

  checkFileFormat(checkFile) {
    if (checkFile.type == 'image/webp' || checkFile.type == 'image/png' || checkFile.type == 'image/jpeg' || checkFile.type == 'image/TIF' || checkFile.type == 'image/tif' || checkFile.type == 'image/tiff') {
      return false;
    } else {
      return true;
    }
  }

  removeImg() {
    this.iconImg = "";
    this.fileImgUpload = "";
  }

  uploadImageFile(event) {
    const file = event.target.files && event.target.files[0];
    var valid = this.checkFileFormat(event.target.files[0]);
    if (!valid) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.iconImg = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);
      this.fileImgUpload = file;
    }
  }

  editDriverData(data, content) {
    this.modalService.open(content, { centered: true, size: 'lg' });
    this.isEdit = true;
    this.fileImgUpload = null;
    this.driverId = data['id'];
    this.iconImg = data['image'];

    this.driverForm = this.fb.group({
      userName: [data['userName']],
      employeeId: [data['employeeId']],
      employeeCode: [data['employeeCode']],
      image: [''],
      email: [data['email']],
      mobileNumber: [data['mobileNumber']],
      password: [data['password']],
      type: [data['type']],
    });
  }

  onSubmitData() {
    this.submitted = true;
    if (!this.driverForm.valid) {
      return false;
    }

    if (this.isEdit) {
      this.driverEditService(this.driverForm.value)
      return;
    }
    if (this.fileImgUpload) {
      this.spinner.show();
      var postData = new FormData();
      postData.append('image', this.fileImgUpload);
      this.authService.s3upload(postData).subscribe((res: any) => {
        if (res.error == false) {
          this.iconImgUrl = res.files;
          const data = this.driverForm.value;
          this.driverForm.value.mobileNumber = String(this.driverForm.value.mobileNumber);
          this.driverForm.value.type = 'POULTRY';
          data['image'] = this.iconImgUrl;
          // console.log("add", data)
          this.authService.createNewDriver(data)
            .subscribe((res: any) => {
              if (res.success == true) {
                this.toastr.success('Success ', res.massage);
                this.spinner.hide();
                this.iconImg = null;
                this.driverForm.reset();
                this.modalService.dismissAll();
                this.ngOnInit();
              } else if (res.error == true) {
                this.toastr.error('Enter valid ', res.massage);
              }
            });
        }
      });
    } else {
      this.driverForm.value.mobileNumber = String(this.driverForm.value.mobileNumber);
      this.driverForm.value.type = 'POULTRY';
      this.authService.createNewDriver(this.driverForm.value)
        .subscribe((res: any) => {
          if (res.success == true) {
            this.toastr.success('Success ', res.massage);
            this.spinner.hide();
            this.iconImg = null;
            this.driverForm.reset();
            this.modalService.dismissAll();
            this.ngOnInit();
          } else {
            this.toastr.error('Enter valid ', res.massage);
          }
        });
    }
  }

  driverEditService(data) {
    if (this.fileImgUpload) {
      this.spinner.show();
      var postData = new FormData();
      postData.append('image', this.fileImgUpload);
      this.authService.s3upload(postData).subscribe((res: any) => {
        if (res.error == false) {
          this.iconImgUrl = res.files;
          const data = this.driverForm.value;
          data['image'] = this.iconImgUrl;
          // console.log("1stImageUpload", data)
          this.authService.editDriver(data, this.driverId)
            .subscribe((res: any) => {
              if (res.success == true) {
                this.toastr.success('Success ', res.massage);
                this.iconImg = null;
                this.driverForm.reset();
                this.modalService.dismissAll();
                this.ngOnInit();
                this.spinner.hide();
              } else {
                this.toastr.error('Enter valid ', res.massage);
              }
            });
        }
      });
    } else {
      const data = this.driverForm.value;
      data['image'] = this.iconImg;
      // console.log("withoutupload", data)
      this.authService.editDriver(data, this.driverId)
        .subscribe((res: any) => {
          if (res.success == true) {
            this.toastr.success(res.massage);
            this.iconImg = null;
            this.driverForm.reset();
            this.modalService.dismissAll();
            this.ngOnInit();
            this.spinner.hide();
          } else {
            this.toastr.error(res.massage);
          }
        })
    }
  }

  changeStatus(value) {
    if (value.active === 1) {
      var visible = 0
    } else {
      var visible = 1
    }
    const object = { active: visible }

    this.authService.editDriver(object, value.id)
      .subscribe((res: any) => {
        if (res.success == true) {
          this.toastr.success('Success ', res.massage);
          this.ngOnInit();
        } else {
          this.toastr.error('Enter valid ', res.massage);
        }
      });
  }

  deleteDriverData(value) {
    Swal.fire({
      title: this.translate.instant("AreYouSure"),
      text: this.translate.instant("YouWontBeRevertThis"),
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: this.translate.instant("Cancel"),
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: this.translate.instant("YesDeleteIt")
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: this.translate.instant("Deleted"),
          text: this.translate.instant("YourFileHasBeenDeleted"),
          icon: 'success',
          confirmButtonText: this.translate.instant("Ok")
        }),
          this.authService.deleteDriver(value).subscribe((res: any) => {
            if (res.success == true) {
              this.toastr.success('Success ', res.massage);
              this.ngOnInit();
            } else {
              this.toastr.error('Enter valid ', res.massage);
            }
          });
      }
    })
  }
}
