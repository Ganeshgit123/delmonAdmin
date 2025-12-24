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
  selector: 'app-one-day-orders',
  templateUrl: './one-day-orders.component.html',
  styleUrls: ['./one-day-orders.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslateModule, NgMaterialModule],
})
export class OneDayOrdersComponent implements OnInit, AfterViewInit {
  displayedColumns: string[];
  dataSource: MatTableDataSource<OneDayOrderRow>;
  getOrders: OneDayOrderRow[] = [];
  formattedDateTime: string;
  driverId: any = '';
  getDrivers: Array<{ id?: number; name?: string }> = [];
  startDate: any = '';
  endDate: any = '';
  showAccept = true;
  superAdminRole = false;
  userType: any;
  dir: any;
  flowType: any;

  @ViewChild(MatPaginator) matPaginator: MatPaginator;
  @ViewChild(MatSort) matSort: MatSort;
  @ViewChild(MatTableExporterDirective, { static: true }) exporter: MatTableExporterDirective;

  constructor(
    public authService: AuthService,
    private translate: TranslateService,
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
      'phoneNumber',
      'userType',
      'driverName',
      'customerAddress',
      'prodDetails',
      'orderDetails',
      'deliveryCost',
      'discount',
      'total',
      'paymentType',
      'sonicNo',
      'orderStatus',
      'orderDate',
      'deliveryDate',
    ];

    if (this.userType == 1 || this.userType == 0) {
      this.flowType = 'POULTRY';
    } else if (this.userType == 2) {
      this.flowType = 'FEEDING';
    }

    const object = {
      type: this.flowType,
      deliveryBoyId: '',
      startDate: '',
      endDate: '',
      orderStatus: 'DRIVERASSIGNED,OUTFORDELIVERY',
    };
    this.authService.getSalesReport(object).subscribe((res: any) => {
      this.getOrders = (res.deliveryBoyOrderList as OneDayOrderRow[]).reverse();
      // console.log("Fef",this.getOrders)
      this.dataSource = new MatTableDataSource<OneDayOrderRow>(this.getOrders);
      this.dataSource.paginator = this.matPaginator;
      this.dataSource.sort = this.matSort;
    });

    this.authService.getDriversActive(1).subscribe((res: any) => {
      this.getDrivers = res.data.reverse();
    });
  }

  callRolePermission() {
    if (sessionStorage.getItem('roleName') !== 'superAdmin') {
      const raw = sessionStorage.getItem('permission');
      const settingPermssion: Array<{ area: string; write: number }> = raw ? JSON.parse(raw) : [];
      const orderPermission = settingPermssion.find((ele) => ele.area === 'one-day-orders')?.write === 1;
      // console.log("fef",orderPermission)
      this.showAccept = orderPermission;
    }
  }

  ngAfterViewInit(): void {
    this.matPaginator._intl.itemsPerPageLabel = this.translate.instant('itemsPerPage');
  }

  getDateQuery(object: {
    type: string;
    deliveryBoyId: string | number;
    startDate: string;
    endDate: string;
    orderStatus: string;
  }) {
    this.authService.getSalesReport(object).subscribe((res: any) => {
      this.getOrders = (res.deliveryBoyOrderList as OneDayOrderRow[]).reverse();
      this.dataSource = new MatTableDataSource<OneDayOrderRow>(this.getOrders);
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

    const object = {
      type: this.flowType,
      deliveryBoyId: this.driverId,
      startDate: this.startDate,
      endDate: this.endDate,
      orderStatus: 'DRIVERASSIGNED,OUTFORDELIVERY',
    };
    this.getDateQuery(object);
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
      deliveryBoyId: this.driverId,
      startDate: this.startDate,
      endDate: this.endDate,
      orderStatus: 'DRIVERASSIGNED,OUTFORDELIVERY',
    };
    this.getDateQuery(object);
  }

  onChangeFilter(value: string) {
    // console.log("se", value)
    if (value == 'all') {
      const object = {
        type: this.flowType,
        deliveryBoyId: '',
        startDate: this.startDate,
        endDate: this.endDate,
        orderStatus: 'DRIVERASSIGNED,OUTFORDELIVERY',
      };
      this.getDateQuery(object);
    } else {
      this.driverId = Number(value);
      const object = {
        type: this.flowType,
        deliveryBoyId: this.driverId,
        startDate: this.startDate,
        endDate: this.endDate,
        orderStatus: 'DRIVERASSIGNED,OUTFORDELIVERY',
      };
      this.getDateQuery(object);
    }
  }

  onChangeFlowTypeFilter(value: string) {
    this.flowType = value;
    const object = {
      type: this.flowType,
      deliveryBoyId: this.driverId,
      startDate: this.startDate,
      endDate: this.endDate,
      orderStatus: 'DRIVERASSIGNED,OUTFORDELIVERY',
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
      fileName: `Daily Report ${this.formattedDateTime}`,
    });
  }
}

interface OneDayOrderRow {
  orderId?: string | number;
  customerName?: string;
  phoneNumber?: string;
  userType?: string | number;
  driverName?: string;
  customerAddress?: string;
  prodDetails?: string;
  orderDetails?: string;
  deliveryCost?: number | string;
  discount?: number | string;
  total?: number | string;
  paymentType?: string;
  sonicNo?: string;
  orderStatus?: string;
  orderDate?: string;
  deliveryDate?: string;
}
