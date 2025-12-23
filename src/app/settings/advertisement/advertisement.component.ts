import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-advertisement',
  templateUrl: './advertisement.component.html',
  styleUrls: ['./advertisement.component.scss'],
})
export class AdvertisementComponent implements OnInit {
  getValue = [];
  iconImg = null;
  fileImgUpload: any;
  iconImgUrl: any;
  ariconImg = null;
  arfileImgUpload: any;
  ariconImgUrl: any;
  prodId: any;
  showAccept = true;
  superAdminRole = false;

  constructor(
    public authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
    private spinner: NgxSpinnerService,
  ) {}

  ngOnInit(): void {
    this.callRolePermission();
    if (sessionStorage.getItem('roleName') == 'superAdmin') {
      this.superAdminRole = true;
    } else {
      this.superAdminRole = false;
    }

    this.authService.getSettings().subscribe((res: any) => {
      this.getValue = res.data.filter((element) => {
        return element.key === 'popupAdvertisement';
      });
      this.iconImg = this.getValue[0].enValue;
      this.ariconImg = this.getValue[0].arValue;
      this.prodId = this.getValue[0].id;
    });
  }

  callRolePermission() {
    if (sessionStorage.getItem('roleName') !== 'superAdmin') {
      const settingPermssion = JSON.parse(sessionStorage.getItem('permission'));
      const orderPermission = settingPermssion?.find((ele) => ele.area == 'master')?.write == 1;
      // console.log("fef",orderPermission)
      this.showAccept = orderPermission;
    }
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

  removearImg() {
    this.ariconImg = '';
    this.arfileImgUpload = '';
  }

  uploadarImageFile(event) {
    const file = event.target.files && event.target.files[0];
    const valid = this.checkFileFormat(event.target.files[0]);
    if (!valid) {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        this.ariconImg = event.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
      this.arfileImgUpload = file;
    }
  }

  onSubmitData() {
    // console.log("id",this.prodId)
    if (this.fileImgUpload && this.arfileImgUpload) {
      this.spinner.show();
      const postData = new FormData();
      postData.append('image', this.fileImgUpload);
      this.authService.s3upload(postData).subscribe((res: any) => {
        if (res.error == false) {
          this.iconImgUrl = res.files;
          const postData = new FormData();
          postData.append('image', this.arfileImgUpload);
          this.authService.s3upload(postData).subscribe((res: any) => {
            if (res.error == false) {
              this.ariconImgUrl = res.files;
              const object = {};
              object['enValue'] = this.iconImgUrl;
              object['arValue'] = this.ariconImgUrl;
              // console.log("editBothImage", data)
              this.authService.updateSetting(object, this.prodId).subscribe((res: any) => {
                if (res.success == true) {
                  this.toastr.success('Success ', res.message);
                  this.iconImg = null;
                  this.ariconImg = null;
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
      const postData = new FormData();
      postData.append('image', this.fileImgUpload);
      this.authService.s3upload(postData).subscribe((res: any) => {
        if (res.error == false) {
          this.iconImgUrl = res.files;
          const object = {};
          object['enValue'] = this.iconImgUrl;
          object['arValue'] = this.ariconImg;
          // console.log("1stImageUpload", data)
          this.authService.updateSetting(object, this.prodId).subscribe((res: any) => {
            if (res.success == true) {
              this.toastr.success('Success ', res.message);
              this.iconImg = null;
              this.ariconImg = null;
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
      const postData = new FormData();
      postData.append('image', this.arfileImgUpload);
      this.authService.s3upload(postData).subscribe((res: any) => {
        if (res.error == false) {
          this.ariconImgUrl = res.files;
          const object = {};
          object['enValue'] = this.iconImg;
          object['arValue'] = this.ariconImgUrl;
          // console.log("2ndImageUpload", data)
          this.authService.updateSetting(object, this.prodId).subscribe((res: any) => {
            if (res.success == true) {
              this.toastr.success('Success ', res.message);
              this.iconImg = null;
              this.ariconImg = null;
              this.ngOnInit();
              this.spinner.hide();
            } else {
              this.toastr.error('Enter valid ', res.message);
            }
          });
        }
      });
    } else {
      const object = {};
      object['enValue'] = this.iconImg;
      object['arValue'] = this.ariconImg;
      // console.log("withoutupload", data)
      this.authService.updateSetting(object, this.prodId).subscribe((res: any) => {
        if (res.success == true) {
          this.toastr.error('Error', res.message);
        } else {
          this.toastr.success('Success ', res.message);
          this.iconImg = null;
          this.ariconImg = null;
          this.ngOnInit();
          this.spinner.hide();
        }
      });
    }
  }
}
