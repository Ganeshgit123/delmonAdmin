import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-advertisement',
  templateUrl: './advertisement.component.html',
  styleUrls: ['./advertisement.component.scss'],
})
export class AdvertisementComponent implements OnInit {
  getValue: Setting[] = [];
  iconImg: string | null = null;
  fileImgUpload: File | null = null;
  iconImgUrl: string | null = null;
  ariconImg: string | null = null;
  arfileImgUpload: File | null = null;
  ariconImgUrl: string | null = null;
  prodId: string | number | null = null;
  showAccept = true;
  superAdminRole = false;

  constructor(
    public authService: AuthService,
    private toastr: ToastrService,
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
      this.getValue = (res.data as Setting[]).filter((element: Setting) => {
        return element.key === 'popupAdvertisement';
      });
      this.iconImg = this.getValue[0]?.enValue ?? null;
      this.ariconImg = this.getValue[0]?.arValue ?? null;
      this.prodId = this.getValue[0]?.id ?? null;
    });
  }

  callRolePermission() {
    if (sessionStorage.getItem('roleName') !== 'superAdmin') {
      const raw = sessionStorage.getItem('permission');
      const settingPermssion: Permission[] = raw ? (JSON.parse(raw) as Permission[]) : [];
      const orderPermission = settingPermssion?.find((ele: Permission) => ele.area == 'master')?.write == 1;
      // console.log("fef",orderPermission)
      this.showAccept = orderPermission;
    }
  }

  checkFileFormat(checkFile: File): boolean {
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
    this.iconImg = null;
    this.fileImgUpload = null;
  }

  uploadImageFile(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files && input.files[0];
    const valid = file ? this.checkFileFormat(file) : true;
    if (!valid) {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        this.iconImg = event.target.result;
      };
      reader.readAsDataURL(file as File);
      this.fileImgUpload = file;
    }
  }

  removearImg() {
    this.ariconImg = null;
    this.arfileImgUpload = null;
  }

  uploadarImageFile(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files && input.files[0];
    const valid = file ? this.checkFileFormat(file) : true;
    if (!valid) {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        this.ariconImg = event.target.result;
      };
      reader.readAsDataURL(file as File);
      this.arfileImgUpload = file;
    }
  }

  onSubmitData() {
    // console.log("id",this.prodId)
    if (this.fileImgUpload && this.arfileImgUpload) {
      this.spinner.show();
      const postData = new FormData();
      postData.append('image', this.fileImgUpload as File);
      this.authService.s3upload(postData).subscribe((res: any) => {
        if (res.error == false) {
          this.iconImgUrl = res.files;
          const postData = new FormData();
          postData.append('image', this.arfileImgUpload as File);
          this.authService.s3upload(postData).subscribe((res: any) => {
            if (res.error == false) {
              this.ariconImgUrl = res.files;
              const object: UpdateSettingPayload = { enValue: this.iconImgUrl, arValue: this.ariconImgUrl };
              // console.log("editBothImage", data)
              this.authService.updateSetting(object, this.prodId as string | number).subscribe((res: any) => {
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
      postData.append('image', this.fileImgUpload as File);
      this.authService.s3upload(postData).subscribe((res: any) => {
        if (res.error == false) {
          this.iconImgUrl = res.files;
          const object: UpdateSettingPayload = { enValue: this.iconImgUrl, arValue: this.ariconImg };
          // console.log("1stImageUpload", data)
          this.authService.updateSetting(object, this.prodId as string | number).subscribe((res: any) => {
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
      postData.append('image', this.arfileImgUpload as File);
      this.authService.s3upload(postData).subscribe((res: any) => {
        if (res.error == false) {
          this.ariconImgUrl = res.files;
          const object: UpdateSettingPayload = { enValue: this.iconImg, arValue: this.ariconImgUrl };
          // console.log("2ndImageUpload", data)
          this.authService.updateSetting(object, this.prodId as string | number).subscribe((res: any) => {
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
      const object: UpdateSettingPayload = { enValue: this.iconImg, arValue: this.ariconImg };
      // console.log("withoutupload", data)
      this.authService.updateSetting(object, this.prodId as string | number).subscribe((res: any) => {
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

interface Setting {
  id: string | number;
  key: string;
  enValue: string | null;
  arValue: string | null;
}

interface UpdateSettingPayload {
  enValue: string | null;
  arValue: string | null;
}

interface Permission {
  area: string;
  write: number;
}
