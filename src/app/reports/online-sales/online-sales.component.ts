import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/shared/auth.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { ExportType, MatTableExporterDirective } from '@csmart/mat-table-exporter';
import { NgxSpinnerService, NgxSpinnerModule } from 'ngx-spinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgMaterialModule } from '../../ng-material.module';

@Component({
  selector: 'app-online-sales',
  templateUrl: './online-sales.component.html',
  styleUrls: ['./online-sales.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslateModule, NgMaterialModule, NgxSpinnerModule],
})
export class OnlineSalesComponent implements OnInit, AfterViewInit {
  displayedColumns: string[];
  dataSource: MatTableDataSource<OnlineSaleRow>;
  getOrders: OnlineSaleRow[] = [];
  formattedDateTime: string;
  startDate: any = '';
  endDate: any = '';
  showAccept = true;
  superAdminRole = false;
  dir: any;
  flowType: any;
  userType: any;

  @ViewChild(MatPaginator) matPaginator: MatPaginator;
  @ViewChild(MatSort) matSort: MatSort;
  @ViewChild(MatTableExporterDirective, { static: true }) exporter: MatTableExporterDirective;

  constructor(
    public authService: AuthService,
    private translate: TranslateService,
    private spinner: NgxSpinnerService,
  ) {}

  ngOnInit(): void {
    this.dir = localStorage.getItem('dir') || 'ltr';

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
      'zoneName',
      'item',
      'qty',
      'weight',
      'total',
      'paymentType',
      'phoneNo',
      'area',
      'blockNo',
      'roadNo',
      'houseNo',
      'flat',
      'pin',
      'notes',
    ];

    if (this.userType == 1 || this.userType == 0) {
      this.flowType = 'POULTRY';
    } else if (this.userType == 2) {
      this.flowType = 'FEEDING';
    }

    const object = {
      type: this.flowType,
      startDate: '',
      endDate: '',
      deliveryType: 1,
      orderStatus: 'PLACED,USERACCEPTED,DRIVERASSIGNED,OUTFORDELIVERY,COMPLETED',
    };

    this.spinner.show();
    this.authService.getInternalSalesReport(object).subscribe((res: any) => {
      this.getOrders = res.data as OnlineSaleRow[];
      this.spinner.hide();
      // console.log("Fef",this.getOrders)
      this.dataSource = new MatTableDataSource<OnlineSaleRow>(this.getOrders);
      this.dataSource.paginator = this.matPaginator;
      this.dataSource.sort = this.matSort;
    });
  }

  callRolePermission() {
    if (sessionStorage.getItem('roleName') !== 'superAdmin') {
      const raw = sessionStorage.getItem('permission');
      const settingPermssion: Array<{ area: string; write: number }> = raw ? JSON.parse(raw) : [];
      const orderPermission = settingPermssion.find((ele) => ele.area === 'online-sales-reports')?.write === 1;
      // console.log("fef",orderPermission)
      this.showAccept = orderPermission;
    }
  }

  getDateQuery(object: {
    type: string;
    startDate: string;
    endDate: string;
    deliveryType: number;
    orderStatus: string | number;
  }) {
    this.spinner.show();
    this.authService.getInternalSalesReport(object).subscribe((res: any) => {
      this.getOrders = res.data as OnlineSaleRow[];
      this.spinner.hide();
      this.dataSource = new MatTableDataSource<OnlineSaleRow>(this.getOrders);
      this.dataSource.paginator = this.matPaginator;
      this.dataSource.sort = this.matSort;
    });
  }

  ngAfterViewInit(): void {
    this.matPaginator._intl.itemsPerPageLabel = this.translate.instant('itemsPerPage');
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

    // const object = { type: this.flowType, startDate: this.startDate, endDate: this.endDate, deliveryType: 1 }
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

    const object = {
      type: this.flowType,
      startDate: this.startDate,
      endDate: this.endDate,
      deliveryType: 1,
      orderStatus: 'PLACED,USERACCEPTED,DRIVERASSIGNED,OUTFORDELIVERY,COMPLETED',
    };
    this.getDateQuery(object);
  }

  onChangeFlowTypeFilter(value: string) {
    this.flowType = value;
    const object = {
      type: this.flowType,
      startDate: this.startDate,
      endDate: this.endDate,
      deliveryType: 1,
      orderStatus: 'PLACED,USERACCEPTED,DRIVERASSIGNED,OUTFORDELIVERY,COMPLETED',
    };
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
      fileName: `Online Order Report ${this.formattedDateTime}`,
    });
  }
}

interface OnlineSaleRow {
  orderId: string | number;
  customerName: string;
  userType: string | number;
  driverName: string;
  zoneName: string;
  item: string;
  qty: number;
  weight: number | string;
  total: number | string;
  paymentType: string;
  phoneNo: string;
  area: string;
  blockNo: string;
  roadNo: string;
  houseNo: string;
  flat: string;
  pin: string;
  notes: string;
}
