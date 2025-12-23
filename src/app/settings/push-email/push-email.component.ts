import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/shared/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-push-email',
  templateUrl: './push-email.component.html',
  styleUrls: ['./push-email.component.scss'],
})
export class PushEmailComponent implements OnInit {
  emailForm: FormGroup;

  userCtrl = new FormControl('');
  filteredUsers = new Observable<any[]>();

  allUsers: any[] = [];
  selectedUsers: any[] = [];

  submittedEmail = false;
  showAccept = true;
  superAdminRole = false;
  userGroups = [
    { id: 'USER', name: 'Customers' },
    { id: 'EMPLOYEE', name: 'Employees' },
  ];

  constructor(
    public fb: FormBuilder,
    public authService: AuthService,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.emailForm = this.fb.group({
      subject: ['', Validators.required],
      body: ['', Validators.required],
      recipientType: ['', Validators.required],
      groupId: [''],
      userId: [[]],
    });

    // Load & map API users
    this.authService.getNormalUsers().subscribe((res: any) => {
      this.allUsers = res.data.map((u) => ({
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

  // Normalize autocomplete input
  private filterUsers(value: any) {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : value?.text?.toLowerCase() || '';

    return this.allUsers.filter((option) => option.text.toLowerCase().includes(filterValue));
  }

  // For autocomplete display
  displayFn(user: any): string {
    return user?.text || '';
  }

  // When selecting autocomplete option
  selectUser(option: any) {
    if (this.selectedUsers.some((u) => u.id === option.id)) {
      this.toastr.warning('User already added');
      this.userCtrl.setValue('');
      return;
    }

    this.selectedUsers.push({
      id: option.id,
      text: option.text,
    });

    this.userCtrl.setValue('');
  }

  // Press ENTER → Select first autocomplete or add manual entry
  handleEnter(event: any) {
    event.preventDefault();

    const value = this.userCtrl.value?.trim();

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
  }

  get fEmail() {
    return this.emailForm.controls;
  }

  sendEmailNotification() {
    this.submittedEmail = true;

    if (this.emailForm.invalid) return;

    const recipientType = this.emailForm.get('recipientType')?.value;

    if (recipientType === 'single' && this.selectedUsers.length === 0) {
      this.toastr.error('Please add at least one user', '', { timeOut: 2000 });
      return;
    }

    if (recipientType === 'group' && !this.emailForm.get('groupId')?.value) {
      this.toastr.error('Please select a group', '', { timeOut: 2000 });
      return;
    }

    const payload: any = {
      subject: this.emailForm.value.subject,
      body: this.emailForm.value.body,
      recipientType,
    };

    if (recipientType === 'single') {
      payload.userId = this.selectedUsers.map((u) => u.id);
    } else {
      payload.groupId = this.emailForm.value.groupId;
    }

    this.authService.pushEMails(payload).subscribe(
      (res: any) => {
        if (res.success) {
          this.toastr.success('Email Sent Successfully');
          this.emailForm.reset();
          this.selectedUsers = [];
          this.submittedEmail = false;
        } else {
          this.toastr.error(res.massage || 'Failed to send SMS', '', { timeOut: 2000 });
        }
      },
      (err) => {
        this.toastr.error('Failed to send SMS', '', { timeOut: 2000 });
      },
    );
  }
}
