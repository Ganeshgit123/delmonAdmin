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
  selector: 'app-banners',
  templateUrl: './banners.component.html',
  styleUrls: ['./banners.component.scss']
})
export class BannersComponent implements OnInit {
  displayedColumns: string[];
  dataSource: MatTableDataSource<any>;
  getvalue = [];
  bannerForm: FormGroup;
  isEdit = false;
  bannerId: any;
  iconImg = null;
  fileImgUpload: any;
  iconImgUrl: any;
  ariconImg = null;
  arfileImgUpload: any;
  ariconImgUrl: any;
  filtVAlue: any;
  submitted = false;
  showAccept = true;
  superAdminRole = false;
  userType: any;

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
      this.displayedColumns = ['index', 'type', 'name', 'enImage', 'arImage', 'rowActionToggle', 'rowActionIcon'];
    } else if (this.showAccept == false) {
      this.displayedColumns = ['index', 'type', 'name', 'enImage', 'arImage'];
    }

    this.userType = sessionStorage.getItem('userType');

    if (this.userType == 1) {
      this.authService.getBanner().subscribe(
        (res: any) => {
          this.getvalue = res.data.filter(
            (data) => data.type == "POULTRY"
          )
          this.dataSource = new MatTableDataSource(this.getvalue);
          this.dataSource.paginator = this.matPaginator;
          this.dataSource.sort = this.matSort;
        });
    } else {
      this.authService.getBanner().subscribe(
        (res: any) => {
          this.getvalue = res.data.filter(
            (data) => data.type == "FEEDING"
          )
          this.dataSource = new MatTableDataSource(this.getvalue);
          this.dataSource.paginator = this.matPaginator;
          this.dataSource.sort = this.matSort;
        });
    }

    if (this.superAdminRole == true) {
      this.authService.getBanner().subscribe(
        (res: any) => {
          this.getvalue = res.data;
          this.dataSource = new MatTableDataSource(this.getvalue);
          this.dataSource.paginator = this.matPaginator;
          this.dataSource.sort = this.matSort;
        });
    }

    this.bannerForm = this.fb.group({
      type: ['', [Validators.required]],
      name: ['', [Validators.required]],
      enImage: ['', [Validators.required]],
      arImage: ['', [Validators.required]],
    });
  }

  get f() { return this.bannerForm.controls; }

  callRolePermission() {
    if (sessionStorage.getItem('roleName') !== 'superAdmin') {
      let settingPermssion = JSON.parse(sessionStorage.getItem('permission'))
      const orderPermission = settingPermssion?.find(ele => ele.area == 'master')?.write == 1
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
    this.bannerForm.reset();
    this.isEdit = false;
    this.iconImg = null;
    this.ariconImg = null;
    this.modalService.open(content, { centered: true });
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

  removearImg() {
    this.ariconImg = "";
    this.arfileImgUpload = "";
  }

  uploadarImageFile(event) {
    const file = event.target.files && event.target.files[0];
    var valid = this.checkFileFormat(event.target.files[0]);
    if (!valid) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.ariconImg = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);
      this.arfileImgUpload = file;
    }
  }

  editBanner(data, content) {
    this.modalService.open(content, { centered: true });
    this.isEdit = true;
    this.fileImgUpload = null;
    this.bannerId = data['id'];
    this.iconImg = data['enImage'];
    this.ariconImg = data['arImage'];

    this.bannerForm = this.fb.group({
      type: [data['type']],
      name: [data['name']],
      enImage: [''],
      arImage: [''],
    });
  }

  onSubmitData() {
    this.submitted = true;
    if (!this.bannerForm.valid) {
      return false;
    }

    if (this.isEdit) {
      this.bannerEditService(this.bannerForm.value)
      return;
    }
    this.submitted = false;
    this.spinner.show();
    var postData = new FormData();
    postData.append('image', this.fileImgUpload);
    this.authService.s3upload(postData).subscribe((res: any) => {
      if (res.error == false) {
        this.iconImgUrl = res.files;
        var postData = new FormData();
        postData.append('image', this.arfileImgUpload);
        this.authService.s3upload(postData).subscribe((res: any) => {
          if (res.error == false) {
            this.ariconImgUrl = res.files;
            const data = this.bannerForm.value;
            data['enImage'] = this.iconImgUrl;
            data['arImage'] = this.ariconImgUrl;
            // console.log("add", data)
            this.authService.addBanner(data)
              .subscribe((res: any) => {
                if (res.error == false) {
                  this.toastr.success('Success ', res.message);
                  this.spinner.hide();
                  this.iconImg = null;
                  this.ariconImg = null;
                  this.bannerForm.reset();
                  this.modalService.dismissAll();
                  this.ngOnInit();
                } else {
                  this.toastr.error('Enter valid ', res.message);
                }
              });
          }
        });
      }
    });
  }

  bannerEditService(data) {
    if (this.fileImgUpload && this.arfileImgUpload) {
      this.spinner.show();
      var postData = new FormData();
      postData.append('image', this.fileImgUpload);
      this.authService.s3upload(postData).subscribe((res: any) => {
        if (res.error == false) {
          this.iconImgUrl = res.files;
          var postData = new FormData();
          postData.append('image', this.arfileImgUpload);
          this.authService.s3upload(postData).subscribe((res: any) => {
            if (res.error == false) {
              this.ariconImgUrl = res.files;
              const data = this.bannerForm.value;
              data['enImage'] = this.iconImgUrl;
              data['arImage'] = this.ariconImgUrl;
              // console.log("editBothImage", data)
              this.authService.editBanner(data, this.bannerId)
                .subscribe((res: any) => {
                  if (res.error == false) {
                    this.toastr.success('Success ', res.message);
                    this.iconImg = null;
                    this.ariconImg = null;
                    this.bannerForm.reset();
                    this.modalService.dismissAll();
                    this.ngOnInit();
                    this.spinner.hide();
                  } else {
                    this.toastr.error('Enter valid ', res.message);
                  }
                });
            }
          });
        }
      });
    } else if (this.fileImgUpload) {
      this.spinner.show();
      var postData = new FormData();
      postData.append('image', this.fileImgUpload);
      this.authService.s3upload(postData).subscribe((res: any) => {
        if (res.error == false) {
          this.iconImgUrl = res.files;
          const data = this.bannerForm.value;
          data['enImage'] = this.iconImgUrl;
          data['arImage'] = this.ariconImg;
          // console.log("1stImageUpload", data)
          this.authService.editBanner(data, this.bannerId)
            .subscribe((res: any) => {
              if (res.error == false) {
                this.toastr.success('Success ', res.message);
                this.iconImg = null;
                this.ariconImg = null;
                this.bannerForm.reset();
                this.modalService.dismissAll();
                this.ngOnInit();
                this.spinner.hide();
              } else {
                this.toastr.error('Enter valid ', res.message);
              }
            });
        }
      });
    } else if (this.arfileImgUpload) {
      this.spinner.show();
      var postData = new FormData();
      postData.append('image', this.arfileImgUpload);
      this.authService.s3upload(postData).subscribe((res: any) => {
        if (res.error == false) {
          this.ariconImgUrl = res.files;
          const data = this.bannerForm.value;
          data['enImage'] = this.iconImg;
          data['arImage'] = this.ariconImgUrl;
          // console.log("2ndImageUpload", data)
          this.authService.editBanner(data, this.bannerId)
            .subscribe((res: any) => {
              if (res.error == false) {
                this.toastr.success('Success ', res.message);
                this.iconImg = null;
                this.ariconImg = null;
                this.bannerForm.reset();
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
      const data = this.bannerForm.value;
      data['enImage'] = this.iconImg;
      data['arImage'] = this.ariconImg;
      // console.log("withoutupload", data)
      this.authService.editBanner(data, this.bannerId)
        .subscribe((res: any) => {
          if (res.error == true) {
            this.toastr.error('Error', res.message);
          } else {
            this.toastr.success('Success ', res.message);
            this.iconImg = null;
            this.ariconImg = null;
            this.bannerForm.reset();
            this.modalService.dismissAll();
            this.ngOnInit();
            this.spinner.hide();
          }
        })
    }
  }

  deleteBanner(value) {
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
          this.authService.deleteBanner(value).subscribe((res: any) => {
            if (res.error == false) {
              this.toastr.success('Success ', res.message);
              this.ngOnInit()
            } else {
              this.toastr.error('Error', res.message);
            }
          });
      }
    })
  }

  changeStatus(value) {
    if (value.active === 1) {
      var visible = 0
    } else {
      var visible = 1
    }
    const object = { active: visible }

    this.authService.editBanner(object, value.id)
      .subscribe((res: any) => {
        if (res.error == false) {
          this.toastr.success('Success ', res.message);
          this.ngOnInit();
        } else {
          this.toastr.error('Enter valid ', res.message);
        }
      });
  }

  onChangeFilter(value) {
    if (value == "all") {
      this.filtVAlue = this.getvalue
      this.dataSource = new MatTableDataSource(this.filtVAlue);
      this.dataSource.paginator = this.matPaginator;
      this.dataSource.sort = this.matSort;
    } else {
      this.filtVAlue = this.getvalue.filter(
        (data) => data.type == value
      )
      this.dataSource = new MatTableDataSource(this.filtVAlue);
      this.dataSource.paginator = this.matPaginator;
      this.dataSource.sort = this.matSort;
    }
  }
}
