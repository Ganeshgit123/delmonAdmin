import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExportType, MatTableExporterDirective } from '@csmart/mat-table-exporter';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements OnInit {
  displayedColumns: string[];
  historyDisplayedColumns: string[];
  dataSource: MatTableDataSource<any>;
  historyDataSource: MatTableDataSource<any>;
  getUsers = [];
  userId: any;
  showAccept = true;
  superAdminRole = false;
  formattedDateTime: string;
  getHistory = [];

  @ViewChild('paginator1') paginator1!: MatPaginator;
  @ViewChild('sort1') sort1!: MatSort;
  @ViewChild('paginator2') paginator2!: MatPaginator;
  @ViewChild('sort2') sort2!: MatSort;
  @ViewChild(MatTableExporterDirective, { static: false }) exporter: MatTableExporterDirective;

  constructor(public authService: AuthService, private toastr: ToastrService, private router: Router,
    private translate: TranslateService, private modalService: NgbModal,) { }

  ngOnInit(): void {

    this.callRolePermission();
    if (sessionStorage.getItem('roleName') == 'superAdmin') {
      this.superAdminRole = true;
    } else {
      this.superAdminRole = false;
    }

    if (this.showAccept == true) {
      this.displayedColumns = ['index', 'mobileNumber', 'employeeNumber', 'userName', 'email', 'walletAmount', 'cartonDiscount', 'dailyLimit', 'created_date', 'status', 'active', 'action', 'walletHistory'];
      this.historyDisplayedColumns = ['index', 'paymentType', 'orderId', 'amount', 'type'];
    } else if (this.showAccept == false) {
      this.displayedColumns = ['index', 'mobileNumber', 'employeeNumber', 'userName', 'email', 'walletAmount', 'cartonDiscount', 'dailyLimit', 'created_date', 'walletHistory'];
      this.historyDisplayedColumns = ['index', 'paymentType', 'orderId', 'amount', 'type'];
    }

    this.authService.getEmployeeUsers().subscribe(
      (res: any) => {
        this.getUsers = res.data;
        this.dataSource = new MatTableDataSource(this.getUsers);
        this.dataSource.paginator = this.paginator1;
        this.dataSource.sort = this.sort1;
      }
    );
  }

  callRolePermission() {
    if (sessionStorage.getItem('roleName') !== 'superAdmin') {
      let settingPermssion = JSON.parse(sessionStorage.getItem('permission'))
      const orderPermission = settingPermssion?.find(ele => ele.area == 'users')?.write == 1
      // console.log("fef",orderPermission)
      this.showAccept = orderPermission
    }
  }

  ngAfterViewInit(): void {
    this.paginator1._intl.itemsPerPageLabel = this.translate.instant("itemsPerPage");
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  approve(value) {
    var userId = value;

    const object = { isApprove: 1 }

    this.authService.approveEmployee(object, userId)
      .subscribe((res: any) => {
        if (res.error == false) {
          this.toastr.success('Success ', res.massage);
          this.ngOnInit();
        } else {
          this.toastr.error('Enter valid ', res.massage);
        }
      });
  }

  reject(id) {
    const object = { isApprove: 2 }

    this.authService.approveEmployee(object, id)
      .subscribe((res: any) => {
        if (res.error == false) {
          this.toastr.success('Success ', res.massage);
          this.ngOnInit();
        } else {
          this.toastr.error('Enter valid ', res.massage);
        }
      });
  }

  editUserType(id, editModal) {
    this.userId = id;
    this.modalService.open(editModal, { centered: true, size: 'sm' });
  }

  onSubmitEmployeeData() {
    const object = {
      employeeNumber: '',
      userType: 'USER'
    }
    this.authService.updateUserType(object, this.userId)
      .subscribe((res: any) => {
        if (res.error == false) {
          this.toastr.success('Success ', res.message);
          this.modalService.dismissAll();
          this.router.navigate(['/normal_users']);
        } else {
          this.toastr.error('Enter valid ', res.message);
        }
      });
  }

  changeActiveStatus(value) {
    if (value.active === 1) {
      var visible = 0
    } else {
      var visible = 1
    }
    const object = { active: visible }
    this.authService.updateUserType(object, value.id)
      .subscribe((res: any) => {
        if (res.error == false) {
          this.toastr.success('Success ', res.message);
          this.ngOnInit();
        } else {
          this.toastr.error('Enter valid ', res.message);
        }
      });
  }

  historyClick(id, content) {
    this.modalService.open(content, { centered: true, size: 'md' });
    this.authService.getUserHistory(id).subscribe({
      next: (res: any) => {
        this.getHistory = res.data;
        this.historyDataSource = new MatTableDataSource(this.getHistory);
        this.historyDataSource.paginator = this.paginator2;
        this.historyDataSource.sort = this.sort2;
      },
      error: (error) => {
        console.error("API Error:", error);
      },
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
      fileName: `Employees ${this.formattedDateTime}`,
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
