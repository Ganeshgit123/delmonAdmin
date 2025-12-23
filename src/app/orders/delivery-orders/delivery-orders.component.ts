import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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
  selector: 'app-delivery-orders',
  templateUrl: './delivery-orders.component.html',
  styleUrls: ['./delivery-orders.component.scss'],
})
export class DeliveryOrdersComponent implements OnInit, AfterViewInit {
  displayedColumns: string[];
  dataSource: MatTableDataSource<any>;
  getvalue = [];
  ordSelectId = [];
  ordDriverSelectId = [];
  currentStatus: any;
  isAllSelect = false;
  isAllDriverSelect = false;
  orderDetail: any;
  getDrivers = [];
  deliveryDate: any;
  deliveryType: any;
  orderDeliverId: any;
  showAccept = true;
  superAdminRole = false;
  userType: any;
  newOrders: any;
  notAssignedOrders: any;
  multiDriverDropdown = false;
  flowType: any;

  @ViewChild(MatPaginator) matPaginator: MatPaginator;
  @ViewChild(MatSort) matSort: MatSort;

  constructor(
    private modalService: NgbModal,
    public fb: FormBuilder,
    public authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.callRolePermission();
    if (sessionStorage.getItem('roleName') == 'superAdmin') {
      this.superAdminRole = true;
    } else {
      this.superAdminRole = false;
    }

    this.userType = sessionStorage.getItem('userType');

    if (this.showAccept == true) {
      this.displayedColumns = [
        'checkbox',
        'index',
        'orderId',
        'orderDetails',
        'approve',
        'orderStatus',
        'drivers',
        'zone',
        'area',
        'orderDate',
        'deliveryDate',
        'rowActionIcon',
      ];
    } else if (this.showAccept == false) {
      this.displayedColumns = [
        'index',
        'orderId',
        'orderDetails',
        'orderStatus',
        'drivers',
        'zone',
        'area',
        'orderDate',
        'deliveryDate',
      ];
    }

    if (this.userType == 1) {
      this.flowType = 'POULTRY';
    } else {
      this.flowType = 'FEEDING';
    }

    if (this.superAdminRole == true) {
      const object = {
        deliveryType: 1,
        orderStatus: 'PLACED,USERACCEPTED,DRIVERASSIGNED,OUTFORDELIVERY',
        type: 'POULTRY',
      };
      this.authService.getOrdersWithStatus(object).subscribe((res: any) => {
        res.data.forEach((element) => {
          ((element.zoneName = element.deliveryAddress?.zoneName),
            (element.area = element.deliveryAddress?.area),
            (element.driverName = element.deliveryBoyDetail?.userName));
        });
        this.getvalue = res.data;
        this.getvalue = res.data;
        this.newOrders = res.data.filter((item) => item.orderStatus == 'PLACED');
        this.notAssignedOrders = res.data.filter((item) => item.orderStatus == 'USERACCEPTED');
        this.dataSource = new MatTableDataSource(this.getvalue);
        this.dataSource.paginator = this.matPaginator;
        this.dataSource.sort = this.matSort;
      });
    } else {
      const object = {
        deliveryType: 1,
        orderStatus: 'PLACED,USERACCEPTED,DRIVERASSIGNED,OUTFORDELIVERY',
        type: this.flowType,
      };
      this.getTypeFilter(object);
    }

    this.authService.getDriversActive(1).subscribe((res: any) => {
      this.getDrivers = res.data.reverse();
    });
  }

  callRolePermission() {
    if (sessionStorage.getItem('roleName') !== 'superAdmin') {
      const settingPermssion = JSON.parse(sessionStorage.getItem('permission'));
      const orderPermission = settingPermssion?.find((ele) => ele.area == 'orders')?.write == 1;
      // console.log("fef",orderPermission)
      this.showAccept = orderPermission;
    }
  }

  getTypeFilter(value) {
    const object = { deliveryType: value.deliveryType, orderStatus: value.orderStatus, type: value.type };
    this.authService.getOrdersWithStatus(object).subscribe((res: any) => {
      res.data.forEach((element) => {
        ((element.zoneName = element.deliveryAddress?.zoneName),
          (element.area = element.deliveryAddress?.area),
          (element.driverName = element.deliveryBoyDetail?.userName));
      });
      this.getvalue = res.data;
      this.newOrders = res.data.filter((item) => item.orderStatus == 'PLACED');
      this.notAssignedOrders = res.data.filter((item) => item.orderStatus == 'USERACCEPTED');
      this.dataSource = new MatTableDataSource(this.getvalue);
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

  isSpecificDateFormat(dateStr: string): boolean {
    const specificFormatRegex = /^[a-zA-Z]+,\s[a-zA-Z]+\s\d{1,2},\s\d{4}$/;
    return specificFormatRegex.test(dateStr);
  }

  approveOrder(id) {
    const object = {
      orderStatus: 'USERACCEPTED',
    };
    this.authService.approveOrderSingle(id, object).subscribe((res: any) => {
      if (res.success == true) {
        this.toastr.success('Success ', res.massage);
        this.ngOnInit();
      } else {
        this.toastr.error('Enter valid ', res.massage);
      }
    });
  }

  onInputChange(id) {
    const index = this.ordSelectId.indexOf(id);
    if (index > -1) {
      this.ordSelectId = this.removeItemOnce(this.ordSelectId, id);
      if (this.ordSelectId.length == 0) {
        this.currentStatus = null;
        this.dataSource = new MatTableDataSource(this.getvalue);
        this.ngOnInit();
      }
    } else {
      if (this.ordSelectId.length > 0) {
        this.ordSelectId.push(id);
      } else {
        this.currentStatus = this.getvalue.find((data) => data._id == id)?.orderStatus;
        this.getvalue = this.getvalue.filter((data) => data.orderStatus == this.currentStatus);
        this.ordSelectId.push(id);
      }
    }

    if (this.ordSelectId.length == this.getvalue.length) {
      this.isAllSelect = true;
    } else {
      this.isAllSelect = false;
    }
  }

  async selectAllClick() {
    this.isAllSelect = !this.isAllSelect;
    if (this.isAllSelect) {
      //selection
      const totalA = [];
      await this.newOrders.map(async (element) => {
        await totalA.push(element.id);
      });
      this.ordSelectId = totalA;
    } else {
      //deselection
      this.currentStatus = null;
      this.getvalue = this.newOrders;
      this.ordSelectId = [];
    }
  }

  removeItemOnce(arr, value) {
    const index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
  }

  onDriverInputChange(id) {
    const index = this.ordDriverSelectId.indexOf(id);
    if (index > -1) {
      this.ordDriverSelectId = this.removeItemOnce(this.ordDriverSelectId, id);
      if (this.ordDriverSelectId.length == 0) {
        this.dataSource = new MatTableDataSource(this.getvalue);
        this.ngOnInit();
      }
    } else {
      if (this.ordDriverSelectId.length > 0) {
        this.ordDriverSelectId.push(id);
      } else {
        const currentStatus = this.getvalue.find((data) => data._id == id)?.orderStatus;
        this.getvalue = this.getvalue.filter((data) => data.orderStatus == currentStatus);
        this.ordDriverSelectId.push(id);
      }
    }

    if (this.ordDriverSelectId.length == this.getvalue.length) {
      this.isAllDriverSelect = true;
    } else {
      this.isAllDriverSelect = false;
    }
  }

  async selectDriverAllClick() {
    this.isAllDriverSelect = !this.isAllDriverSelect;
    if (this.isAllDriverSelect) {
      //selection
      const totalA = [];
      await this.notAssignedOrders.map(async (element) => {
        await totalA.push(element.id);
      });
      this.ordDriverSelectId = totalA;
    } else {
      //deselection
      this.getvalue = this.notAssignedOrders;
      this.ordDriverSelectId = [];
    }
  }

  approveMulti() {
    const object = {
      id: JSON.stringify(this.ordSelectId),
      orderStatus: 'USERACCEPTED',
    };
    // console.log("ddd",some)
    this.authService.approveOrderMulti(object).subscribe((res: any) => {
      if (res.success == true) {
        this.toastr.success('Success ', res.massage);
        this.ordSelectId = [];
        this.ngOnInit();
      } else {
        this.toastr.error('Enter valid ', res.massage);
      }
    });
  }

  assignMultiDriver() {
    this.multiDriverDropdown = true;
  }

  assignMultiDriverToOrder(id) {
    const assignDriverId = id;
    function formatDate(date: Date): string {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so add 1
      const year = date.getFullYear();

      return `${day}/${month}/${year}`;
    }
    const today = new Date();
    const formattedDate = formatDate(today);
    // console.log(formattedDate);
    this.deliveryDate = formattedDate;
    const object = {
      id: JSON.stringify(this.ordDriverSelectId),
      orderStatus: 'DRIVERASSIGNED',
      deliveryBoyId: Number(assignDriverId),
      deliveryOrderDate: this.deliveryDate,
    };
    // console.log("ddd",object)
    this.authService.approveOrderMulti(object).subscribe((res: any) => {
      if (res.success == true) {
        this.toastr.success('Success ', res.massage);
        this.ordDriverSelectId = [];
        this.multiDriverDropdown = false;
        this.ngOnInit();
      } else {
        this.toastr.error('Enter valid ', res.massage);
      }
    });
  }

  openModal(content, data) {
    this.modalService.open(content, { centered: true, size: 'lg' });
    this.orderDetail = data;
  }

  assignDriver(driverId, orderId) {
    const assignDriverId = driverId;
    const assignOrderId = orderId;

    function formatDate(date: Date): string {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so add 1
      const year = date.getFullYear();

      return `${day}/${month}/${year}`;
    }
    const today = new Date();
    const formattedDate = formatDate(today);
    // console.log(formattedDate);
    this.deliveryDate = formattedDate;

    const object = {
      orderStatus: 'DRIVERASSIGNED',
      deliveryBoyId: Number(assignDriverId),
      deliveryOrderDate: this.deliveryDate,
    };

    // console.log("DFef", object)
    this.authService.approveOrderSingle(assignOrderId, object).subscribe((res: any) => {
      if (res.success == true) {
        this.toastr.success('Success ', res.massage);
        this.ngOnInit();
      } else {
        this.toastr.error('Enter valid ', res.massage);
      }
    });
  }

  editOrderType(data, editModal) {
    this.modalService.open(editModal, { centered: true, size: 'sm' });
    this.deliveryType = data.deliveryType;
    this.orderDeliverId = data.id;
  }
  onSubmitDeliveryType() {
    const object = {
      deliveryType: 'PICKUP',
    };
    this.authService.approveOrderSingle(this.orderDeliverId, object).subscribe((res: any) => {
      if (res.success == true) {
        this.toastr.success('Success ', res.massage);
        this.modalService.dismissAll();
        this.ngOnInit();
      } else {
        this.toastr.error('Enter valid ', res.massage);
      }
    });
  }

  cancelOrder(id) {
    const object = {
      orderStatus: 'CANCELLED',
    };
    this.authService.approveOrderSingle(id, object).subscribe((res: any) => {
      if (res.success == true) {
        this.toastr.success('Success ', res.massage);
        this.ngOnInit();
      } else {
        this.toastr.error('Enter valid ', res.massage);
      }
    });
  }

  onChangeFilter(value) {
    const object = { deliveryType: 1, orderStatus: 'PLACED,USERACCEPTED,DRIVERASSIGNED,OUTFORDELIVERY', type: value };
    this.getTypeFilter(object);
  }
}
