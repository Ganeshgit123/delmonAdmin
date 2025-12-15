import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/shared/auth.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-canelled-orders',
  templateUrl: './canelled-orders.component.html',
  styleUrls: ['./canelled-orders.component.scss']
})
export class CanelledOrdersComponent implements OnInit {
  displayedColumns: string[];
  dataSource: MatTableDataSource<any>;
  getvalue = [];
  orderDetail: any;
  showAccept = true;
  superAdminRole = false;
  userType: any;
  userFlowType: any;
  clickedDriverId: any;
  clickOrderId: any;
  driverMsg = false;
  getDrivers = [];
  errorMsg = false;
  deliveryDate: any;
  deliveryType: any = 1;

  @ViewChild(MatPaginator) matPaginator: MatPaginator;
  @ViewChild(MatSort) matSort: MatSort;

  constructor(private modalService: NgbModal, public fb: FormBuilder, public authService: AuthService,
    private toastr: ToastrService, private router: Router, private spinner: NgxSpinnerService,
    private translate: TranslateService,) { }

  ngOnInit(): void {
    this.callRolePermission();
    if (sessionStorage.getItem('roleName') == 'superAdmin') {
      this.superAdminRole = true;
    } else {
      this.superAdminRole = false;
    }

    this.userType = sessionStorage.getItem('userType');

    if (this.userType == 1 || this.userType == 0) {
      this.userFlowType = 'POULTRY';
    } else if (this.userType == 2 || this.userType == 0) {
      this.userFlowType = 'FEEDING';
    }

    if (this.showAccept == true) {
      this.displayedColumns = ['index', 'orderId', 'orderDetails', 'drivers',
        'zone', 'area', 'orderDate', 'deliveryDate', 'rowActionIcon'];
    } else if (this.showAccept == false) {
      this.displayedColumns = ['index', 'orderId', 'orderDetails', 'drivers',
        'zone', 'area', 'orderDate', 'deliveryDate'];
    }

    if (this.userType == 1 || this.userType == 0) {
      const object = { deliveryType: 1, orderStatus: 'USERREJECTED,CANCELLED', type: this.userFlowType }
      this.getTypeFilter(object)
    } else if (this.userType == 2 || this.userType == 0) {
      const object = { deliveryType: 1, orderStatus: 'USERREJECTED,CANCELLED', type: this.userFlowType }
      this.getTypeFilter(object)
    }

    this.authService.getDriversActive(1).subscribe(
      (res: any) => {
        this.getDrivers = res.data.reverse();
      });
  }

  callRolePermission() {
    if (sessionStorage.getItem('roleName') !== 'superAdmin') {
      let settingPermssion = JSON.parse(sessionStorage.getItem('permission'))
      const orderPermission = settingPermssion?.find(ele => ele.area == 'orders')?.write == 1
      // console.log("fef",orderPermission)
      this.showAccept = orderPermission
    }
  }

  ngAfterViewInit(): void {
    this.matPaginator._intl.itemsPerPageLabel = this.translate.instant("itemsPerPage");
  }

  isDateValid(date: string): boolean {
    return !isNaN(Date.parse(date));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openModal(content, data) {
    this.modalService.open(content, { centered: true, size: 'lg' });
    this.orderDetail = data;
  }

  getTypeFilter(value) {
    this.spinner.show();
    const object = { deliveryType: value.deliveryType, orderStatus: value.orderStatus, type: this.userFlowType }
    this.authService.getOrdersWithStatus(object).subscribe(
      (res: any) => {
        res.data.forEach(element => {
          element.zoneName = element.deliveryAddress?.zoneName,
            element.area = element.deliveryAddress?.area,
            element.driverName = element.deliveryBoyDetail?.userName
        });
        this.getvalue = res.data;
        this.spinner.hide();
        this.dataSource = new MatTableDataSource(this.getvalue);
        this.dataSource.paginator = this.matPaginator;
        this.dataSource.sort = this.matSort;
      });
  }

  onChangeFilter(value) {
    this.deliveryType = value;
    if (this.deliveryType == "1") {
      const object = { deliveryType: 1, orderStatus: 'USERREJECTED,CANCELLED', type: this.userFlowType }
      this.getTypeFilter(object)
    } else {
      const object = { deliveryType: 0, orderStatus: 'USERREJECTED,CANCELLED', type: this.userFlowType }
      this.getTypeFilter(object)
    }
  }

  onChangeFlowTypeFilter(value) {
    this.userFlowType = value;
    const object = { deliveryType: this.deliveryType, orderStatus: 'USERREJECTED,CANCELLED', type: this.userFlowType }
    this.getTypeFilter(object)
  }

  resheduleOrder(data, editModal) {
    this.clickOrderId = data.id;
    this.modalService.open(editModal, { centered: true, size: 'md' });
  }

  driverClick(driverId) {
    this.driverMsg = false;
    this.clickedDriverId = Number(driverId);
  }

  dateEvent(event) {
    this.errorMsg = false;
    function formatDate(date: Date): string {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so add 1
      const year = date.getFullYear();

      return `${day}/${month}/${year}`;
    }

    const stDate = event.value;
    const formattedDate = formatDate(stDate);
    this.deliveryDate = formattedDate;
  }

  onReAssign() {
    if (this.deliveryDate == undefined && this.clickedDriverId == undefined) {
      this.errorMsg = true;
      this.driverMsg = true;
    } else if (this.clickedDriverId == undefined) {
      this.driverMsg = true;
    } else if (this.deliveryDate == undefined) {
      this.errorMsg = true;
    } else {
      const object = {
        orderStatus: "DRIVERASSIGNED",
        deliveryBoyId: this.clickedDriverId,
        deliveryOrderDate: this.deliveryDate,
        isRechedule: 1
      }
      // console.log("DFef",object)
      this.authService.approveOrderSingle(this.clickOrderId, object)
        .subscribe((res: any) => {
          if (res.success == true) {
            this.toastr.success('Success ', res.massage);
            this.modalService.dismissAll();
            this.errorMsg = false;
            this.driverMsg = false;
            this.ngOnInit();
          } else {
            this.toastr.error('Enter valid ', res.massage);
          }
        });
    }
  }

}
