import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/auth.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-push',
  templateUrl: './push.component.html',
  styleUrls: ['./push.component.scss']
})
export class PushComponent implements OnInit {
  fcmForm: FormGroup;
  smsForm: FormGroup;
  dropdownSettingsuser: IDropdownSettings = {};
  getuser;
  dropdownList;
  selectuser = [];
  showAccept = true;
  superAdminRole = false;

  constructor(public fb: FormBuilder, public authService: AuthService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.callRolePermission();
    if (sessionStorage.getItem('roleName') == 'superAdmin') {
      this.superAdminRole = true;
    } else {
      this.superAdminRole = false;
    }
    this.fcmForm = this.fb.group({
      title: ['', Validators.required],
      message: ['', [Validators.required]],
      userId: ['', [Validators.required]],
    });

    this.smsForm = this.fb.group({
      title: ['', Validators.required],
      message: ['', [Validators.required]],
      userId: ['', [Validators.required]],
    });

    this.dropdownSettingsuser = {
      singleSelection: false,
      idField: 'id',
      textField: 'mobileNumber',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
      // enableCheckAll: true,
    };
    this.authService.getNormalUsers().subscribe(
      (res: any) => {
        this.getuser = res.data;
      }
    );
    this.dropdownList = this.getuser;
  }

  callRolePermission() {
    if (sessionStorage.getItem('roleName') !== 'superAdmin') {
      let settingPermssion = JSON.parse(sessionStorage.getItem('permission'))
      const orderPermission = settingPermssion?.find(ele => ele.area == 'master')?.write == 1
      // console.log("fef",orderPermission)
      this.showAccept = orderPermission
    }
  }

  onItemSelectuser(item: any) {

    this.selectuser.push(item.id);
    // console.log('dropdownafterseledct5', this.selectuser);

  }

  onItemDeSelect(items: any) {
    this.selectuser = this.selectuser.filter(function (letter) {
      return letter !== items.id;
    });
    // console.log("deselec",this.selectuser);
  }

  onSelectAlluser(items: any) {
    // console.log(items);
    items.forEach(element => {
      this.selectuser.push(element.id);
      // console.log('dropdownafterseledct5', this.selectuser);
    });
  }

  onDeSelectAll(items: any){
    this.selectuser = items;
  }

  sendFCMNotification() {
    this.fcmForm.value.userId = this.selectuser;
    // console.log("values", this.fcmForm.value)

    this.authService.pushnotification(this.fcmForm.value)
      .subscribe((res: any) => {
        if (res.success == true) {
          this.toastr.success("Notification Sent Successfully");
          this.fcmForm.reset();
          this.selectuser = [];
          this.ngOnInit();
        } else {
          this.toastr.error(res.massage);
        }
      });
  }

  sendSMS() {
    this.smsForm.value.userId = this.selectuser;
    // console.log("values", this.fcmForm.value)

    this.authService.pushSms(this.smsForm.value)
      .subscribe((res: any) => {
        if (res.success == true) {
          this.toastr.success("SMS Sent Successfully");
          this.smsForm.reset();
          this.selectuser = [];
          this.ngOnInit();
        } else {
          this.toastr.error(res.massage);
        }
      });
  }

}
