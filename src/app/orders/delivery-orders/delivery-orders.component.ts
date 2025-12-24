import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder } from '@angular/forms';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/shared/auth.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgMaterialModule } from '../../ng-material.module';

interface OrderRow {
  id: number;
  _id?: number;
  orderStatus: string;
  deliveryAddress?: { zoneName?: string; area?: string } | null;
  deliveryBoyDetail?: { userName?: string } | null;
}

@Component({
  selector: 'app-delivery-orders',
  templateUrl: './delivery-orders.component.html',
  styleUrls: ['./delivery-orders.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslateModule, NgMaterialModule, NgbModalModule],
})
export class DeliveryOrdersComponent implements OnInit, AfterViewInit {
  displayedColumns: string[];
  dataSource: MatTableDataSource<OrderRow>;
  getvalue: OrderRow[] = [];
  ordSelectId: number[] = [];
  ordDriverSelectId: number[] = [];
  currentStatus: string | null = null;
  isAllSelect = false;
  isAllDriverSelect = false;
  orderDetail: OrderRow | null = null;
  getDrivers: any[] = [];
  deliveryDate: any;
  deliveryType: string | number | null = null;
  orderDeliverId: number | null = null;
  showAccept = true;
  superAdminRole = false;
  userType: string | null = null;
  newOrders: OrderRow[] = [];
  notAssignedOrders: OrderRow[] = [];
  multiDriverDropdown = false;
  flowType: string;

  @ViewChild(MatPaginator) matPaginator: MatPaginator;
  @ViewChild(MatSort) matSort: MatSort;

  constructor(
    private modalService: NgbModal,
    public fb: FormBuilder,
    public authService: AuthService,
    private toastr: ToastrService,
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.callRolePermission();
    if (sessionStorage.getItem('roleName') === 'superAdmin') {
      this.superAdminRole = true;
    } else {
      this.superAdminRole = false;
    }

    this.userType = sessionStorage.getItem('userType');

    if (this.showAccept === true) {
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
    } else if (this.showAccept === false) {
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

    if (this.userType == '1') {
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
        (res.data as OrderRow[]).forEach((element: OrderRow & { zoneName?: string; area?: string; driverName?: string }) => {
          ((element.zoneName = element.deliveryAddress?.zoneName),
            (element.area = element.deliveryAddress?.area),
            (element.driverName = element.deliveryBoyDetail?.userName));
        });
        this.getvalue = res.data as OrderRow[];
        this.newOrders = (res.data as OrderRow[]).filter((item: OrderRow) => item.orderStatus === 'PLACED');
        this.notAssignedOrders = (res.data as OrderRow[]).filter((item: OrderRow) => item.orderStatus === 'USERACCEPTED');
        this.dataSource = new MatTableDataSource<OrderRow>(this.getvalue);
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
      this.getDrivers = (res.data as any[]).reverse();
    });
  }

  callRolePermission() {
    if (sessionStorage.getItem('roleName') !== 'superAdmin') {
      const permRaw = sessionStorage.getItem('permission');
      const settingPermssion = permRaw ? (JSON.parse(permRaw) as { area: string; write: number }[]) : null;
      const orderPermission = settingPermssion?.find((ele) => ele.area === 'orders')?.write === 1;
      // console.log("fef",orderPermission)
      this.showAccept = orderPermission;
    }
  }

  getTypeFilter(value: { deliveryType: number; orderStatus: string; type: string }) {
    const object = { deliveryType: value.deliveryType, orderStatus: value.orderStatus, type: value.type };
    this.authService.getOrdersWithStatus(object).subscribe((res: any) => {
      (res.data as OrderRow[]).forEach((element: OrderRow & { zoneName?: string; area?: string; driverName?: string }) => {
        ((element.zoneName = element.deliveryAddress?.zoneName),
          (element.area = element.deliveryAddress?.area),
          (element.driverName = element.deliveryBoyDetail?.userName));
      });
      this.getvalue = res.data as OrderRow[];
      this.newOrders = (res.data as OrderRow[]).filter((item: OrderRow) => item.orderStatus === 'PLACED');
      this.notAssignedOrders = (res.data as OrderRow[]).filter((item: OrderRow) => item.orderStatus === 'USERACCEPTED');
      this.dataSource = new MatTableDataSource<OrderRow>(this.getvalue);
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

  approveOrder(id: number) {
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

  onInputChange(id: number) {
    const index = this.ordSelectId.indexOf(id);
    if (index > -1) {
      this.ordSelectId = this.removeItemOnce(this.ordSelectId, id);
      if (this.ordSelectId.length == 0) {
        this.currentStatus = null;
        this.dataSource = new MatTableDataSource<OrderRow>(this.getvalue);
        this.ngOnInit();
      }
    } else {
      if (this.ordSelectId.length > 0) {
        this.ordSelectId.push(id);
      } else {
        this.currentStatus = this.getvalue.find((data) => data._id === id)?.orderStatus ?? null;
        if (this.currentStatus) {
          this.getvalue = this.getvalue.filter((data) => data.orderStatus === this.currentStatus);
        }
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
      const totalA: number[] = [];
      await this.newOrders.map(async (element: OrderRow) => {
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

  removeItemOnce(arr: number[], value: number): number[] {
    const index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
  }

  onDriverInputChange(id: number) {
    const index = this.ordDriverSelectId.indexOf(id);
    if (index > -1) {
      this.ordDriverSelectId = this.removeItemOnce(this.ordDriverSelectId, id);
      if (this.ordDriverSelectId.length == 0) {
        this.dataSource = new MatTableDataSource<OrderRow>(this.getvalue);
        this.ngOnInit();
      }
    } else {
      if (this.ordDriverSelectId.length > 0) {
        this.ordDriverSelectId.push(id);
      } else {
        const currentStatus = this.getvalue.find((data) => data._id === id)?.orderStatus;
        if (currentStatus) {
          this.getvalue = this.getvalue.filter((data) => data.orderStatus === currentStatus);
        }
        this.ordDriverSelectId.push(id);
      }
    }
  }

  

  async selectDriverAllClick() {
    this.isAllDriverSelect = !this.isAllDriverSelect;
    if (this.isAllDriverSelect) {
      //selection
      const totalA: number[] = [];
      await this.notAssignedOrders.map(async (element: OrderRow) => {
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

  assignMultiDriverToOrder(id: number) {
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

  openModal(content: any, data: any) {
    this.modalService.open(content, { centered: true, size: 'lg' });
    this.orderDetail = data;
  }

  assignDriver(driverId: number, orderId: number) {
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

  editOrderType(data: any, editModal: any) {
    this.modalService.open(editModal, { centered: true, size: 'sm' });
    this.deliveryType = data.deliveryType ?? null;
    this.orderDeliverId = data.id;
  }
  onSubmitDeliveryType() {
    if (this.orderDeliverId == null) {
      return;
    }
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

  cancelOrder(id: number) {
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

  onChangeFilter(value: string) {
    const object = { deliveryType: 1, orderStatus: 'PLACED,USERACCEPTED,DRIVERASSIGNED,OUTFORDELIVERY', type: value };
    this.getTypeFilter(object);
  }
}
