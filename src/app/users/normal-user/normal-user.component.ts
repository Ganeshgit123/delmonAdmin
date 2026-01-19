import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { NgxSpinnerService, NgxSpinnerModule } from 'ngx-spinner';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ExportType, MatTableExporterDirective } from '@csmart/mat-table-exporter';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgMaterialModule } from '../../ng-material.module';

@Component({
  selector: 'app-normal-user',
  templateUrl: './normal-user.component.html',
  styleUrls: ['./normal-user.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslateModule, NgMaterialModule, NgbModalModule, NgxSpinnerModule],
})
export class NormalUserComponent implements OnInit, AfterViewInit {
  displayedColumns: string[];
  historyDisplayedColumns: string[];
  dataSource: MatTableDataSource<UserRow>;
  historyDataSource: MatTableDataSource<UserHistoryRow>;
  getUsers: UserRow[] = [];
  employeeForm: FormGroup;
  submitted = false;
  userId: any;
  showAccept = true;
  superAdminRole = false;
  formattedDateTime: string;
  getHistory: UserHistoryRow[] = [];

  @ViewChild('paginator1') paginator1!: MatPaginator;
  @ViewChild('sort1') sort1!: MatSort;
  @ViewChild('paginator2') paginator2!: MatPaginator;
  @ViewChild('sort2') sort2!: MatSort;
  @ViewChild(MatTableExporterDirective, { static: true }) exporter: MatTableExporterDirective;

  constructor(
    public authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
    private translate: TranslateService,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    public fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.callRolePermission();
    if (sessionStorage.getItem('roleName') == 'superAdmin') {
      this.superAdminRole = true;
    } else {
      this.superAdminRole = false;
    }

    if (this.showAccept == true) {
      this.displayedColumns = [
        'index',
        'mobileNumber',
        'userName',
        'email',
        'walletAmount',
        'loyaltyPoint',
        'dailyLimit',
        'created_date',
        'edit',
        'active',
        'walletHistory',
      ];
      this.historyDisplayedColumns = ['index', 'paymentType', 'orderId', 'amount', 'type'];
    } else if (this.showAccept == false) {
      this.displayedColumns = [
        'index',
        'mobileNumber',
        'userName',
        'email',
        'walletAmount',
        'loyaltyPoint',
        'dailyLimit',
        'created_date',
        'walletHistory',
      ];
      this.historyDisplayedColumns = ['index', 'paymentType', 'orderId', 'amount', 'type'];
    }

    this.spinner.show();
    this.authService.getNormalUsers().subscribe((res: any) => {
      this.getUsers = res.data as UserRow[];
      this.spinner.hide();
      this.dataSource = new MatTableDataSource<UserRow>(this.getUsers);
      this.dataSource.paginator = this.paginator1;
      this.dataSource.sort = this.sort1;
    });

    this.employeeForm = this.fb.group({
      employeeNumber: ['', [Validators.required]],
      userType: [''],
    });
  }

  get empf() {
    return this.employeeForm.controls;
  }

  callRolePermission() {
    if (sessionStorage.getItem('roleName') !== 'superAdmin') {
      const permStr = sessionStorage.getItem('permission');
      const settingPermssion: Array<{ area: string; read: number; write: number }> | null = permStr ? JSON.parse(permStr) : null;
      const orderPermission = settingPermssion?.find((ele: { area: string; read: number; write: number }) => ele.area === 'users')?.write === 1;
      // console.log("fef",orderPermission)
      this.showAccept = !!orderPermission;
    }
  }

  ngAfterViewInit(): void {
    this.paginator1._intl.itemsPerPageLabel = this.translate.instant('itemsPerPage');
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editUserType(id: number, editModal: any) {
    this.userId = id;
    this.modalService.open(editModal, { centered: true, size: 'md' });
  }

  onSubmitEmployeeData() {
    this.submitted = true;
    if (!this.employeeForm.valid) {
      return false;
    }
    this.submitted = false;
    this.employeeForm.value.userType = 'EMPLOYEE';
    // console.log("Fef",this.employeeForm.value)
    this.authService.updateUserType(this.employeeForm.value, this.userId).subscribe((res: any) => {
      if (res.error == false) {
        this.toastr.success('Success ', res.message);
        this.spinner.hide();
        this.employeeForm.reset();
        this.modalService.dismissAll();
        this.router.navigate(['/employees']);
      } else {
        this.toastr.error('Enter valid ', res.message);
      }
    });
  }

  changeActiveStatus(value: { id: number; active: number }) {
    const visible = value.active === 1 ? 0 : 1;
    const object = { active: visible };
    this.authService.updateUserType(object, value.id).subscribe((res: any) => {
      if (res.error == false) {
        this.toastr.success('Success ', res.message);
        this.ngOnInit();
      } else {
        this.toastr.error('Enter valid ', res.message);
      }
    });
  }

  exportIt() {
    const currentDateAndTime: Date = new Date();
    // Extract individual components
    const year: number = currentDateAndTime.getFullYear();
    const month: number = currentDateAndTime.getMonth() + 1; // Note: Months are zero-based
    const day: number = currentDateAndTime.getDate();
    const hours: number = currentDateAndTime.getHours();
    const minutes: number = currentDateAndTime.getMinutes();
    const seconds: number = currentDateAndTime.getSeconds();

    // Format the date and time
    this.formattedDateTime = `${year}-${month}-${day}/${hours}:${minutes}:${seconds}`;

    this.exporter.exportTable(ExportType.XLSX, {
      fileName: `Users ${this.formattedDateTime}`,
    });
  }

  historyClick(id: number, content: any) {
    this.modalService.open(content, { centered: true, size: 'md' });
    this.authService.getUserHistory(id).subscribe({
      next: (res: any) => {
        this.getHistory = res.data as UserHistoryRow[];
        this.historyDataSource = new MatTableDataSource<UserHistoryRow>(this.getHistory);
        this.historyDataSource.paginator = this.paginator2;
        this.historyDataSource.sort = this.sort2;
      },
      error: (error) => {
        console.error('API Error:', error);
      },
    });
  }

  historyExportIt(exporter: MatTableExporterDirective) {
    const currentDateAndTime: Date = new Date();
    // Extract individual components
    const year: number = currentDateAndTime.getFullYear();
    const month: number = currentDateAndTime.getMonth() + 1; // Note: Months are zero-based
    const day: number = currentDateAndTime.getDate();
    const hours: number = currentDateAndTime.getHours();
    const minutes: number = currentDateAndTime.getMinutes();
    const seconds: number = currentDateAndTime.getSeconds();

    // Format the date and time
    this.formattedDateTime = `${year}-${month}-${day}/${hours}:${minutes}:${seconds}`;

    exporter.exportTable(ExportType.XLSX, {
      fileName: `WalletHistory ${this.formattedDateTime}`,
    });
  }
}

interface UserRow {
  id: number;
  mobileNumber: string;
  userName: string;
  email: string;
  walletAmount: number | string;
  loyaltyPoint: number | string;
  dailyLimit: number | string;
  created_date: string;
  active: number;
}

interface UserHistoryRow {
  paymentType: string;
  orderId: number | string;
  amount: number | string;
  type: string;
}
