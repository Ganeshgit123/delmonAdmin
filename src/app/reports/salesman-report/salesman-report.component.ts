import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/shared/auth.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { ExportType, MatTableExporterDirective } from '@csmart/mat-table-exporter';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgMaterialModule } from '../../ng-material.module';

@Component({
  selector: 'app-salesman-report',
  templateUrl: './salesman-report.component.html',
  styleUrls: ['./salesman-report.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslateModule, NgMaterialModule],
})
export class SalesmanReportComponent implements OnInit, AfterViewInit {
  displayedColumns: string[];
  dataSource: MatTableDataSource<SalesmanRow>;
  getOrders: SalesmanRow[] = [];
  formattedDateTime: string;
  startDate: any = '';
  endDate: any = '';
  showAccept = true;
  superAdminRole = false;
  dir: any;
  adminUserName: any;
  flowType: any;
  userType: any;

  @ViewChild(MatPaginator) matPaginator: MatPaginator;
  @ViewChild(MatSort) matSort: MatSort;
  @ViewChild(MatTableExporterDirective, { static: true }) exporter: MatTableExporterDirective;

  constructor(
    public authService: AuthService,
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.dir = localStorage.getItem('dir') || 'ltr';
    this.adminUserName = sessionStorage.getItem('roleName');

    this.callRolePermission();
    if (sessionStorage.getItem('roleName') == 'superAdmin') {
      this.superAdminRole = true;
    } else {
      this.superAdminRole = false;
    }

    this.userType = sessionStorage.getItem('userType');

    this.displayedColumns = [
      'index',
      'orderId',
      'customerName',
      'userType',
      'driverName',
      'deliveryCost',
      'discountPercentage',
      'total',
      'paymentType',
      'salesInvoiceNo',
      'orderStatus',
      'orderDetails',
      'adminUserName',
      'deliveryDate',
    ];

    if (this.userType == 1 || this.userType == 0) {
      this.flowType = 'POULTRY';
    } else if (this.userType == 2) {
      this.flowType = 'FEEDING';
    }

    const object = { type: this.flowType, startDate: '', endDate: '' };
    this.authService.getFinanceReport(object).subscribe((res: any) => {
      this.getOrders = (res.deliveryBoyOrderList as SalesmanRow[]).reverse();
      // console.log("Fef",this.getOrders)
      this.dataSource = new MatTableDataSource<SalesmanRow>(this.getOrders);
      this.dataSource.paginator = this.matPaginator;
      this.dataSource.sort = this.matSort;
    });
  }

  callRolePermission() {
    if (sessionStorage.getItem('roleName') !== 'superAdmin') {
      const raw = sessionStorage.getItem('permission');
      const settingPermssion: Array<{ area: string; write: number }> = raw ? JSON.parse(raw) : [];
      const orderPermission = settingPermssion.find((ele) => ele.area === 'salesman-reports')?.write === 1;
      // console.log("fef",orderPermission)
      this.showAccept = orderPermission;
    }
  }

  ngAfterViewInit(): void {
    this.matPaginator._intl.itemsPerPageLabel = this.translate.instant('itemsPerPage');
  }

  getDateQuery(object: { type: string; startDate: string; endDate: string }) {
    this.authService.getFinanceReport(object).subscribe((res: any) => {
      this.getOrders = res.deliveryBoyOrderList as SalesmanRow[];
      this.dataSource = new MatTableDataSource<SalesmanRow>(this.getOrders);
      this.dataSource.paginator = this.matPaginator;
      this.dataSource.sort = this.matSort;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  startEvent(event: { value: string | Date }) {
    const stDate = event.value;
    const date = new Date(stDate);

    const year: number = date.getFullYear();
    const month: number = date.getMonth() + 1; // Note: Months are zero-indexed, so add 1
    const day: number = date.getDate();

    const startFomatDate = `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;

    this.startDate = startFomatDate;

    // const object = {type: this.flowType, startDate: this.startDate, endDate: this.endDate }
    // this.getDateQuery(object)
  }

  endEvent(event: { value: string | Date }) {
    const stDate = event.value;
    const date = new Date(stDate);

    const year: number = date.getFullYear();
    const month: number = date.getMonth() + 1; // Note: Months are zero-indexed, so add 1
    const day: number = date.getDate();

    const endFomatDate = `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;

    this.endDate = endFomatDate;

    const object = { type: this.flowType, startDate: this.startDate, endDate: this.endDate };
    this.getDateQuery(object);
  }

  onChangeFlowTypeFilter(value: string) {
    this.flowType = value;
    const object = { type: this.flowType, startDate: this.startDate, endDate: this.endDate };
    this.getDateQuery(object);
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
      fileName: `Salesman Sales Report ${this.formattedDateTime}`,
    });
  }
}

interface SalesmanRow {
  orderId?: string | number;
  customerName?: string;
  userType?: string | number;
  driverName?: string;
  deliveryCost?: number | string;
  discountPercentage?: number | string;
  total?: number | string;
  paymentType?: string;
  salesInvoiceNo?: string;
  orderStatus?: string;
  orderDetails?: string;
  adminUserName?: string;
  deliveryDate?: string;
}
