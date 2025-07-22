import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { ExportType, MatTableExporterDirective } from 'mat-table-exporter';

@Component({
  selector: 'app-total-orders',
  templateUrl: './total-orders.component.html',
  styleUrls: ['./total-orders.component.scss']
})
export class TotalOrdersComponent implements OnInit {
  displayedColumns: string[];
  dataSource: MatTableDataSource<any>;
  getOrders = [];
  formattedDateTime: string;
  driverId: any = '';
  getDrivers = [];
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

  constructor(public authService: AuthService, private router: Router, private translate: TranslateService,) { }

  ngOnInit(): void {
    this.dir = localStorage.getItem('dir') || 'ltr';
    this.callRolePermission();
    if (sessionStorage.getItem('roleName') == 'superAdmin') {
      this.superAdminRole = true;
    } else {
      this.superAdminRole = false;
    }

    this.userType = sessionStorage.getItem('userType');

    this.displayedColumns = ['index', 'driverName', 'productName', 'soldType', 'weight', 'quantity', 'orderDate', 'deliveryDate'];

    if (this.userType == 1 || this.userType == 0) {
      this.flowType = 'POULTRY'
    } else if (this.userType == 2){
      this.flowType = 'FEEDING'
    }

    const object = { type: this.flowType, deliveryBoyId: '', startDate: '', endDate: '', orderStatus: 'DRIVERASSIGNED,OUTFORDELIVERY' }
    this.authService.getSalesReport(object).subscribe(
      (res: any) => {
        res.deliveryBoyOrderList.forEach(element => {
          element.cartDetails.forEach(cartdet => {
            cartdet.driverName = element.driverName
            cartdet.orderPlaceTime = element.orderPlaceTime
            cartdet.deliveryDate = element.deliveryDate
            cartdet.deliveryOrderDate = element.deliveryOrderDate
            cartdet.newDeliveryDate = element.newDeliveryDate
            this.getOrders.push(cartdet);
          });
        });
        const aggregatedOrders = this.aggregateOrders(this.getOrders);
        // console.log(aggregatedOrders);
        var revOrder = aggregatedOrders.reverse();
        this.dataSource = new MatTableDataSource(revOrder);
        this.dataSource.paginator = this.matPaginator;
        this.dataSource.sort = this.matSort;
      });

    this.authService.getDriversActive(1).subscribe(
      (res: any) => {
        this.getDrivers = res.data.reverse();
      });
  }

  aggregateOrders(orders) {
    const aggregated = {};

    orders.forEach(order => {
      const date = order.newDeliveryDate || order.deliveryOrderDate;  // Use newDeliveryDate if it exists, else use deliveryOrderDate
      const key = `${order.productId}-${date}-${order.driverName}`;  // Unique key based on productId, date, and driverName

      if (aggregated[key]) {
        // If the key exists, add the quantity
        aggregated[key].quantity += order.quantity;
      } else {
        // If the key doesn't exist, initialize it with the current order's data
        aggregated[key] = {
          ...order,
          quantity: order.quantity  // Ensure the quantity is initialized
        };
      }
    });

    // Convert aggregated object back to an array
    return Object.values(aggregated);
  }

  callRolePermission() {
    if (sessionStorage.getItem('roleName') !== 'superAdmin') {
      let settingPermssion = JSON.parse(sessionStorage.getItem('permission'))
      const orderPermission = settingPermssion?.find(ele => ele.area == 'total-orders')?.write == 1
      // console.log("fef",orderPermission)
      this.showAccept = orderPermission
    }
  }

  ngAfterViewInit(): void {
    this.matPaginator._intl.itemsPerPageLabel = this.translate.instant("itemsPerPage");
  }

  getDateQuery(object) {
    this.authService.getSalesReport(object).subscribe(
      (res: any) => {
        let filterArray = [];
        res.deliveryBoyOrderList.forEach(element => {
          element.cartDetails.forEach(cartdet => {
            cartdet.driverName = element.driverName
            cartdet.driverName = element.driverName
            cartdet.orderPlaceTime = element.orderPlaceTime
            cartdet.deliveryDate = element.deliveryDate
            cartdet.deliveryOrderDate = element.deliveryOrderDate
            cartdet.newDeliveryDate = element.newDeliveryDate
            filterArray.push(cartdet);
          });
        });
        const aggregatedOrders = this.aggregateOrders(filterArray);
        // console.log(aggregatedOrders);
        var revOrder = aggregatedOrders.reverse();
        this.dataSource = new MatTableDataSource(revOrder);
        this.dataSource.paginator = this.matPaginator;
        this.dataSource.sort = this.matSort;
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  startEvent(event) {
    var stDate = event.value
    var date = new Date(stDate);

    const year: number = date.getFullYear();
    const month: number = date.getMonth() + 1; // Note: Months are zero-indexed, so add 1
    const day: number = date.getDate();

    const startFomatDate: string = `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;

    this.startDate = startFomatDate;

    const object = { type: this.flowType, deliveryBoyId: this.driverId, startDate: this.startDate, endDate: this.endDate, orderStatus: 'DRIVERASSIGNED,OUTFORDELIVERY' }
    this.getDateQuery(object)
  }

  endEvent(event) {
    var stDate = event.value
    var date = new Date(stDate);

    const year: number = date.getFullYear();
    const month: number = date.getMonth() + 1; // Note: Months are zero-indexed, so add 1
    const day: number = date.getDate();

    const endFomatDate: string = `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;

    this.endDate = endFomatDate;

    const object = { type: this.flowType, deliveryBoyId: this.driverId, startDate: this.startDate, endDate: this.endDate, orderStatus: 'DRIVERASSIGNED,OUTFORDELIVERY' }
    this.getDateQuery(object)
  }

  onChangeFilter(value) {
    // console.log("se", value)
    if (value == "all") {
      const object = { type: this.flowType, deliveryBoyId: '', startDate: this.startDate, endDate: this.endDate, orderStatus: 'DRIVERASSIGNED,OUTFORDELIVERY' }
      this.getDateQuery(object)
    } else {
      this.driverId = Number(value);
      const object = { type: this.flowType, deliveryBoyId: this.driverId, startDate: this.startDate, endDate: this.endDate, orderStatus: 'DRIVERASSIGNED,OUTFORDELIVERY' }
      this.getDateQuery(object)
    }
  }

  onChangeFlowTypeFilter(value){
    this.flowType  = value;
    const object = { type: this.flowType, deliveryBoyId: this.driverId, startDate: this.startDate, endDate: this.endDate, orderStatus: 'DRIVERASSIGNED,OUTFORDELIVERY'}
    this.getDateQuery(object)
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
      fileName: `Total Order Report ${this.formattedDateTime}`,
    });
  }
}