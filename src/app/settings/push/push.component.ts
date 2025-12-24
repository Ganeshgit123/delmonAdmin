import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/shared/auth.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ToastrService } from 'ngx-toastr';
import { map, Observable, startWith } from 'rxjs';

interface UserOption {
  id: string | number;
  text: string;
}

@Component({
  selector: 'app-push',
  templateUrl: './push.component.html',
  styleUrls: ['./push.component.scss'],
})
export class PushComponent implements OnInit {
  fcmForm: FormGroup;
  smsForm: FormGroup;
  dropdownSettingsuser: IDropdownSettings = {};
  getuser: any;
  dropdownList: any;
  selectuser: UserOption[] = [];
  showAccept = true;
  superAdminRole = false;
  userGroups = [
    { id: 'USER', name: 'Customers' },
    { id: 'EMPLOYEE', name: 'Employees' },
  ];

  // added submitted flags
  submittedFcm = false;
  submittedSms = false;

  userCtrl = new FormControl('');
  filteredUsers = new Observable<UserOption[]>();

  allUsers: UserOption[] = [];
  selectedUsers: UserOption[] = [];

  constructor(
    public fb: FormBuilder,
    public authService: AuthService,
    private toastr: ToastrService,
  ) {}

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
      groupId: [''],
    });

    this.smsForm = this.fb.group({
      title: ['', Validators.required],
      message: ['', [Validators.required]],
      userId: [[]],
      recipientType: ['', Validators.required], // <- added required validator
      groupId: [''],
    });

    // Load & map API users
    this.authService.getNormalUsers().subscribe((res: any) => {
      this.allUsers = res.data.map((u: any) => ({
        id: u.id,
        text: u.mobileNumber,
      }));
    });

    // Autocomplete filter
    this.filteredUsers = this.userCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this.filterUsers(value)),
    );
  }

  callRolePermission() {
    if (sessionStorage.getItem('roleName') !== 'superAdmin') {
      const raw = sessionStorage.getItem('permission');
      const settingPermssion: Array<{ area: string; write: number }> = raw ? JSON.parse(raw) : [];
      const orderPermission = settingPermssion.find((ele) => ele.area === 'master')?.write === 1;
      // console.log("fef",orderPermission)
      this.showAccept = orderPermission;
    }
  }

  // convenience getters for template
  get fF() {
    return this.fcmForm.controls;
  }
  get fS() {
    return this.smsForm.controls;
  }

  // Normalize autocomplete input
  private filterUsers(value: any) {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : value?.text?.toLowerCase() || '';

    return this.allUsers.filter((option) => option.text.toLowerCase().includes(filterValue));
  }

  // For autocomplete display
  displayFn(user: UserOption): string {
    return user?.text || '';
  }

  // When selecting autocomplete option
  selectUser(option: UserOption) {
    if (this.selectedUsers.some((u) => u.id === option.id)) {
      this.toastr.warning('User already added');
      this.userCtrl.setValue('');
      return;
    }

    this.selectedUsers.push({
      id: option.id,
      text: option.text,
    });

    // keep form controls in sync
    this.updateFormUserIds();
    this.userCtrl.setValue('');
  }

  // Press ENTER → Select first autocomplete or add manual entry
  handleEnter(event: any) {
    event.preventDefault();

    const value = (this.userCtrl.value || '').toString().trim();

    const list = this.filteredUsersSource(value);

    if (list.length > 0) {
      this.selectUser(list[0]);
    } else {
      this.addTypedUserManual(value);
    }
  }

  // Manual chip addition for number input
  addTypedUserManual(value: string) {
    if (!value) return;

    if (!/^[0-9]+$/.test(value)) {
      this.toastr.error('Only numbers allowed');
      return;
    }

    if (this.selectedUsers.some((u) => u.text === value)) {
      this.toastr.warning('User already added');
      return;
    }

    this.selectedUsers.push({
      id: value, // fallback id = number
      text: value,
    });

    // keep form controls in sync
    this.updateFormUserIds();
    this.userCtrl.setValue('');
  }

  // Helper to get filtered list synchronously
  private filteredUsersSource(value: string) {
    return this.allUsers.filter((u) => u.text.toLowerCase().includes((value || '').toLowerCase()));
  }

  // Block non-numeric keys
  allowOnlyNumber(event: KeyboardEvent) {
    if (!/[0-9]/.test(event.key)) event.preventDefault();
  }

  // Remove chip
  removeUser(index: number) {
    this.selectedUsers.splice(index, 1);
    // keep form controls in sync
    this.updateFormUserIds();
  }

  // keep both forms' userId in sync with selectedUsers
  private updateFormUserIds() {
    const ids = this.selectedUsers.map((u) => u.id);
    this.fcmForm.get('userId')?.setValue(ids);
    this.smsForm.get('userId')?.setValue(ids);
  }

  sendFCMNotification() {
    this.submittedFcm = true;
    if (this.fcmForm.invalid) {
      return;
    }
    const recipientType = this.fcmForm.get('recipientType')?.value;

    console.log('selectedUsers', this.selectedUsers, recipientType);

    // validate based on recipientType
    if (recipientType === 'single' && this.selectedUsers.length === 0) {
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
      recipientType: recipientType,
    };

    if (recipientType === 'single') {
      // use synced form control
      payload.userId = this.fcmForm.value.userId;
    } else {
      payload.groupId = this.fcmForm.value.groupId;
    }

    this.authService.pushnotification(payload).subscribe(
      (res: any) => {
        if (res.success == true) {
          this.toastr.success('Notification Sent Successfully', '', { timeOut: 2000 });
          // reset form and submitted flag
          this.fcmForm.reset();
          this.selectedUsers = [];
          this.updateFormUserIds();
          this.submittedFcm = false;
        } else {
          this.toastr.error(res.massage || 'Failed to send notification', '', { timeOut: 2000 });
        }
      },
      (_err) => {
        this.toastr.error('Failed to send notification', '', { timeOut: 2000 });
      },
    );
  }

  sendSMS() {
    this.submittedSms = true;
    if (this.smsForm.invalid) {
      return;
    }

    const recipientType = this.smsForm.get('recipientType')?.value;

    // validate based on recipientType
    if (recipientType === 'single' && this.selectedUsers.length === 0) {
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
      recipientType: recipientType,
    };

    if (recipientType === 'single') {
      // use synced form control
      payload.userId = this.smsForm.value.userId;
    } else {
      payload.groupId = this.smsForm.value.groupId;
    }

    this.authService.pushSms(payload).subscribe(
      (res: any) => {
        if (res.success == true) {
          this.toastr.success('SMS Sent Successfully', '', { timeOut: 2000 });
          this.smsForm.reset();
          this.selectedUsers = [];
          this.updateFormUserIds();
          this.submittedSms = false;
        } else {
          this.toastr.error(res.massage || 'Failed to send SMS', '', { timeOut: 2000 });
        }
      },
      (_err) => {
        this.toastr.error('Failed to send SMS', '', { timeOut: 2000 });
      },
    );
  }
}
