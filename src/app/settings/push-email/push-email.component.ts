import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/auth.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-push-email',
  templateUrl: './push-email.component.html',
  styleUrls: ['./push-email.component.scss']
})
export class PushEmailComponent implements OnInit {
  emailForm: FormGroup;
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
  submittedEmail = false;

  constructor(public fb: FormBuilder, public authService: AuthService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.callRolePermission();
    if (sessionStorage.getItem('roleName') == 'superAdmin') {
      this.superAdminRole = true;
    } else {
      this.superAdminRole = false;
    }
    this.emailForm = this.fb.group({
      subject: ['', Validators.required],
      body: ['', [Validators.required]],
      userId: [[]],
      recipientType: ['', Validators.required], // <- added required validator
      groupId: ['']
    });

    // add subscription to toggle validators based on recipientType
    this.emailForm.get('recipientType')?.valueChanges.subscribe((val) => {
      if (val === 'group') {
        this.emailForm.get('groupId')?.setValidators([Validators.required]);
        this.emailForm.get('groupId')?.updateValueAndValidity();
        // clear selected users when switching to group (optional)
        this.selectuser = [];
      } else if (val === 'single') {
        this.emailForm.get('groupId')?.clearValidators();
        this.emailForm.get('groupId')?.updateValueAndValidity();
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
  get fEmail() { return this.emailForm.controls; }

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

  sendEmailNotification() {
    this.submittedEmail = true;
    if (this.emailForm.invalid) {
      return;
    }

    const recipientType = this.emailForm.get('recipientType')?.value;

    // validate based on recipientType
    if (recipientType === 'single' && this.selectuser.length === 0) {
      this.toastr.error('Please select at least one user', '', { timeOut: 2000 });
      return;
    }

    if (recipientType === 'group' && !this.emailForm.get('groupId')?.value) {
      this.toastr.error('Please select a group', '', { timeOut: 2000 });
      return;
    }

    // build payload with only the relevant key
    const payload: any = {
      subject: this.emailForm.get('subject')?.value,
      body: this.emailForm.get('body')?.value,
      recipientType: recipientType
    };

    if (recipientType === 'single') {
      payload.userId = this.selectuser;
    } else if (recipientType === 'group') {
      payload.groupId = this.emailForm.get('groupId')?.value;
    }

    // console.log("payload", payload);

    this.authService.pushEMails(payload)
      .subscribe((res: any) => {
        if (res.success == true) {
          this.toastr.success("Email Sent Successfully", '', { timeOut: 2000 });
          // reset form and submitted flag
          this.emailForm.reset({ userId: [], recipientType: '', groupId: '' });
          this.selectuser = [];
          this.submittedEmail = false;
          // reinitialize validators/state if needed
          this.emailForm.get('groupId')?.clearValidators();
          this.emailForm.get('groupId')?.updateValueAndValidity();
        } else {
          this.toastr.error(res.massage || 'Failed to send email', '', { timeOut: 2000 });
        }
      }, (err) => {
        this.toastr.error('Failed to send email', '', { timeOut: 2000 });
      });
  }

}
