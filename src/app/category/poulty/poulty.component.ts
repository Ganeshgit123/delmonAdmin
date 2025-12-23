import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/shared/auth.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-poulty',
  templateUrl: './poulty.component.html',
  styleUrls: ['./poulty.component.scss'],
})
export class PoultyComponent implements OnInit, AfterViewInit {
  displayedColumns: string[];
  dataSource: MatTableDataSource<any>;
  getvalue = [];
  isEdit = false;
  categoryForm: FormGroup;
  catImg = null;
  submitted = false;
  categoryId: any;
  iconImg = null;
  fileImgUpload: any;
  iconImgUrl: any;
  color: any;
  showAccept = true;
  superAdminRole = false;

  @ViewChild(MatPaginator) matPaginator: MatPaginator;
  @ViewChild(MatSort) matSort: MatSort;

  constructor(
    private modalService: NgbModal,
    public fb: FormBuilder,
    public authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.callRolePermission();
    if (sessionStorage.getItem('roleName') == 'superAdmin') {
      this.superAdminRole = true;
    } else {
      this.superAdminRole = false;
    }

    localStorage.setItem('flow', 'POULTRY');

    if (this.showAccept == true) {
      this.displayedColumns = [
        'index',
        'enName',
        'arName',
        'image',
        'colorCode',
        'vat',
        'rowActionToggle',
        'actionUser',
        'actionEmployee',
        'rowActionIcon',
      ];
    } else if (this.showAccept == false) {
      this.displayedColumns = ['index', 'enName', 'arName', 'image', 'colorCode', 'vat'];
    }

    this.authService.getCategory('POULTRY').subscribe((res: any) => {
      this.getvalue = res.data;
      this.dataSource = new MatTableDataSource(this.getvalue);
      this.dataSource.paginator = this.matPaginator;
      this.dataSource.sort = this.matSort;
    });

    this.categoryForm = this.fb.group({
      enName: ['', [Validators.required]],
      arName: ['', [Validators.required]],
      image: ['', [Validators.required]],
      colorCode: ['', [Validators.required]],
      vat: ['', [Validators.required]],
      type: [''],
      parentId: [''],
      userType: [''],
      employeeType: [''],
    });
  }

  get f() {
    return this.categoryForm.controls;
  }

  callRolePermission() {
    if (sessionStorage.getItem('roleName') !== 'superAdmin') {
      const settingPermssion = JSON.parse(sessionStorage.getItem('permission'));
      const orderPermission = settingPermssion?.find((ele) => ele.area == 'category')?.write == 1;
      // console.log("fef",orderPermission)
      this.showAccept = orderPermission;
    }
  }

  ngAfterViewInit(): void {
    this.matPaginator._intl.itemsPerPageLabel = this.translate.instant('itemsPerPage');
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
    this.categoryForm.reset();
    this.isEdit = false;
    this.iconImg = '';
    this.catImg = null;
    this.modalService.open(content, { centered: true });
  }

  checkFileFormat(checkFile) {
    if (
      checkFile.type == 'image/webp' ||
      checkFile.type == 'image/png' ||
      checkFile.type == 'image/jpeg' ||
      checkFile.type == 'image/TIF' ||
      checkFile.type == 'image/tif' ||
      checkFile.type == 'image/tiff'
    ) {
      return false;
    } else {
      return true;
    }
  }

  removeImg() {
    this.iconImg = '';
    this.fileImgUpload = '';
  }

  uploadImageFile(event) {
    const file = event.target.files && event.target.files[0];
    const valid = this.checkFileFormat(event.target.files[0]);
    if (!valid) {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        this.iconImg = event.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
      this.fileImgUpload = file;
    }
  }

  colorClicked(colorvalue) {
    const cvalue = colorvalue;
    this.color = cvalue;
    this.categoryForm.patchValue({ colorCode: cvalue });
  }

  editCategory(data, content) {
    this.modalService.open(content, { centered: true });
    this.isEdit = true;
    this.fileImgUpload = null;
    this.categoryId = data['id'];
    this.iconImg = data['image'];

    this.categoryForm = this.fb.group({
      type: [data['type']],
      enName: [data['enName']],
      arName: [data['arName']],
      image: [''],
      colorCode: [data['colorCode']],
      parentId: [data['parentId']],
      vat: [data['vat']],
      userType: [data['userType']],
      employeeType: [data['employeeType']],
    });
  }

  onSubmitData() {
    this.submitted = true;
    if (!this.categoryForm.valid) {
      return false;
    }

    if (this.isEdit) {
      this.categoryEditService(this.categoryForm.value);
      return;
    }

    this.spinner.show();
    const postData = new FormData();
    postData.append('image', this.fileImgUpload);
    this.authService.s3upload(postData).subscribe((res: any) => {
      if (res.error == false) {
        this.iconImgUrl = res.files;
        const data = this.categoryForm.value;
        if (this.iconImgUrl) {
          data['image'] = this.iconImgUrl;
        } else {
          data['image'] = '';
        }
        data['type'] = 'POULTRY';
        data['parentId'] = 0;
        data['userType'] = 1;
        data['employeeType'] = 1;
        // console.log("add", data)
        this.authService.addPoultryCategory(data).subscribe((res: any) => {
          if (res.error == false) {
            this.toastr.success('Success ', res.message);
            this.spinner.hide();
            this.iconImg = null;
            this.categoryForm.reset();
            this.modalService.dismissAll();
            this.ngOnInit();
          } else {
            this.toastr.error('Enter valid ', res.message);
          }
        });
      }
    });
  }

  categoryEditService(data) {
    if (this.fileImgUpload) {
      this.spinner.show();
      const postData = new FormData();
      postData.append('image', this.fileImgUpload);
      this.authService.s3upload(postData).subscribe((res: any) => {
        if (res.error == false) {
          this.iconImgUrl = res.files;
          const data = this.categoryForm.value;
          if (this.iconImgUrl) {
            data['image'] = this.iconImgUrl;
          } else {
            data['image'] = '';
          }
          // console.log("1stImageUpload", data)
          this.authService.editCategory(data, this.categoryId).subscribe((res: any) => {
            if (res.error == false) {
              this.toastr.success('Success ', res.message);
              this.iconImg = null;
              this.categoryForm.reset();
              this.modalService.dismissAll();
              this.ngOnInit();
              this.spinner.hide();
            } else {
              this.toastr.error('Enter valid ', res.message);
            }
          });
        }
      });
    } else {
      const data = this.categoryForm.value;
      data['image'] = this.iconImg;
      // console.log("withoutupload", data)
      this.authService.editCategory(data, this.categoryId).subscribe((res: any) => {
        if (res.error == false) {
          this.toastr.success(res.message);
          this.iconImg = null;
          this.categoryForm.reset();
          this.modalService.dismissAll();
          this.ngOnInit();
          this.spinner.hide();
        } else {
          this.toastr.error(res.message);
        }
      });
    }
  }

  changeStatus(value) {
    const visible = value.active === 1 ? 0 : 1;
    const object = { active: visible };

    this.authService.editCategory(object, value.id).subscribe((res: any) => {
      if (res.error == false) {
        this.toastr.success('Success ', res.message);
        this.ngOnInit();
      } else {
        this.toastr.error('Enter valid ', res.message);
      }
    });
  }

  deleteCategory(value) {
    Swal.fire({
      title: this.translate.instant('AreYouSure'),
      text: this.translate.instant('YouWontBeRevertThis'),
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: this.translate.instant('Cancel'),
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: this.translate.instant('YesDeleteIt'),
    }).then((result) => {
      if (result.isConfirmed) {
        (Swal.fire({
          title: this.translate.instant('Deleted'),
          text: this.translate.instant('YourFileHasBeenDeleted'),
          icon: 'success',
          confirmButtonText: this.translate.instant('Ok'),
        }),
          this.authService.deleteCategory(value).subscribe((res: any) => {
            if (res.error == false) {
              this.toastr.success('Success ', res.message);
              this.ngOnInit();
            } else {
              this.toastr.error('Error', res.message);
            }
          }));
      }
    });
  }

  changeUserStatus(value) {
    let stat: number;
    if (value.userType == 0) {
      stat = 1;
    } else if (value.userType == 1) {
      stat = 0;
    }
    const object = { userType: stat };

    this.authService.editCategory(object, value.id).subscribe((res: any) => {
      if (res.error == false) {
        this.toastr.success('Success ', res.message);
        this.ngOnInit();
      } else {
        this.toastr.error('Enter valid ', res.message);
      }
    });
  }

  changeEmployeeStatus(value) {
    let stat: number;
    if (value.employeeType == 0) {
      stat = 1;
    } else if (value.employeeType == 1) {
      stat = 0;
    }

    const object = { employeeType: stat };

    this.authService.editCategory(object, value.id).subscribe((res: any) => {
      if (res.error == false) {
        this.toastr.success('Success ', res.message);
        this.ngOnInit();
      } else {
        this.toastr.error('Enter valid ', res.message);
      }
    });
  }
}
