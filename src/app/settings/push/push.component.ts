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
  userGroups = [
    { id: 'USER', name: 'Customers' },
    { id: 'EMPLOYEE', name: 'Employees' }
  ];

  // added submitted flags
  submittedFcm = false;
  submittedSms = false;

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
      userId: [[]],
      recipientType: ['', Validators.required], // <- added required validator
      groupId: ['']
    });

    this.smsForm = this.fb.group({
      title: ['', Validators.required],
      message: ['', [Validators.required]],
      userId: [[]],
      recipientType: ['', Validators.required], // <- added required validator
      groupId: ['']
    });

    // add subscription to toggle validators based on recipientType for fcmForm
    this.fcmForm.get('recipientType')?.valueChanges.subscribe((val) => {
      if (val === 'group') {
        this.fcmForm.get('groupId')?.setValidators([Validators.required]);
        this.fcmForm.get('groupId')?.updateValueAndValidity();
        // clear selected users when switching to group (optional)
        this.selectuser = [];
      } else if (val === 'single') {
        this.fcmForm.get('groupId')?.clearValidators();
        this.fcmForm.get('groupId')?.updateValueAndValidity();
      }
    });

    // add subscription to toggle validators based on recipientType for smsForm
    this.smsForm.get('recipientType')?.valueChanges.subscribe((val) => {
      if (val === 'group') {
        this.smsForm.get('groupId')?.setValidators([Validators.required]);
        this.smsForm.get('groupId')?.updateValueAndValidity();
        // clear selected users when switching to group (optional)
        this.selectuser = [];
      } else if (val === 'single') {
        this.smsForm.get('groupId')?.clearValidators();
        this.smsForm.get('groupId')?.updateValueAndValidity();
      }
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

  // convenience getters for template
  get fF() { return this.fcmForm.controls; }
  get fS() { return this.smsForm.controls; }

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

  onDeSelectAll(items: any) {
    this.selectuser = items;
  }

  sendFCMNotification() {
    this.submittedFcm = true;
    if (this.fcmForm.invalid) {
      return;
    }

    const recipientType = this.fcmForm.get('recipientType')?.value;

    // validate based on recipientType
    if (recipientType === 'single' && this.selectuser.length === 0) {
      this.toastr.error('Please select at least one user', '', { timeOut: 2000 });
      return;
    }

    if (recipientType === 'group' && !this.fcmForm.get('groupId')?.value) {
      this.toastr.error('Please select a group', '', { timeOut: 2000 });
      return;
    }

    // build payload with only the relevant key
    const payload: any = {
      title: this.fcmForm.get('title')?.value,
      message: this.fcmForm.get('message')?.value,
      recipientType: recipientType
    };

    if (recipientType === 'single') {
      payload.userId = this.selectuser;
    } else if (recipientType === 'group') {
      payload.groupId = this.fcmForm.get('groupId')?.value;
    }

    this.authService.pushnotification(payload)
      .subscribe((res: any) => {
        if (res.success == true) {
          this.toastr.success("Notification Sent Successfully", '', { timeOut: 2000 });
          // reset form and submitted flag
          this.fcmForm.reset({ userId: [], recipientType: '', groupId: '' });
          this.selectuser = [];
          this.submittedFcm = false;
          // reinitialize validators/state if needed
          this.fcmForm.get('groupId')?.clearValidators();
          this.fcmForm.get('groupId')?.updateValueAndValidity();
        } else {
          this.toastr.error(res.massage || 'Failed to send notification', '', { timeOut: 2000 });
        }
      }, (err) => {
        this.toastr.error('Failed to send notification', '', { timeOut: 2000 });
      });
  }

  sendSMS() {
    this.submittedSms = true;
    if (this.smsForm.invalid) {
      return;
    }

    const recipientType = this.smsForm.get('recipientType')?.value;

    // validate based on recipientType
    if (recipientType === 'single' && this.selectuser.length === 0) {
      this.toastr.error('Please select at least one user', '', { timeOut: 2000 });
      return;
    }

    if (recipientType === 'group' && !this.smsForm.get('groupId')?.value) {
      this.toastr.error('Please select a group', '', { timeOut: 2000 });
      return;
    }

    // build payload with only the relevant key
    const payload: any = {
      title: this.smsForm.get('title')?.value,
      message: this.smsForm.get('message')?.value,
      recipientType: recipientType
    };

    if (recipientType === 'single') {
      payload.userId = this.selectuser;
    } else if (recipientType === 'group') {
      payload.groupId = this.smsForm.get('groupId')?.value;
    }

    this.authService.pushSms(payload)
      .subscribe((res: any) => {
        if (res.success == true) {
          this.toastr.success("SMS Sent Successfully", '', { timeOut: 2000 });
          this.smsForm.reset({ userId: [], recipientType: '', groupId: '' });
          this.selectuser = [];
          this.submittedSms = false;
          this.smsForm.get('groupId')?.clearValidators();
          this.smsForm.get('groupId')?.updateValueAndValidity();
        } else {
          this.toastr.error(res.massage || 'Failed to send SMS', '', { timeOut: 2000 });
        }
      }, (err) => {
        this.toastr.error('Failed to send SMS', '', { timeOut: 2000 });
      });
  }

}
