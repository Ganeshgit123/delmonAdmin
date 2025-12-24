import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder } from '@angular/forms';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/shared/auth.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService, NgxSpinnerModule } from 'ngx-spinner';
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
  selector: 'app-unavailable',
  templateUrl: './unavailable.component.html',
  styleUrls: ['./unavailable.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslateModule, NgMaterialModule, NgbModalModule, NgxSpinnerModule],
})
export class UnavailableComponent implements OnInit, AfterViewInit {
  displayedColumns: string[];
  dataSource: MatTableDataSource<OrderRow>;
  getvalue: OrderRow[] = [];
  getDrivers: any[] = [];
  orderDetail: OrderRow | null = null;
  errorMsg = false;
  deliveryDate: any;
  clickedDriverId: any;
  clickOrderId: any;
  driverMsg = false;
  showAccept = true;
  superAdminRole = false;
  userType: string | null;
  userFlowType: string;
  deliveryType: any = 1;

  @ViewChild(MatPaginator) matPaginator: MatPaginator;
  @ViewChild(MatSort) matSort: MatSort;

  constructor(
    private modalService: NgbModal,
    public fb: FormBuilder,
    public authService: AuthService,
    private toastr: ToastrService,
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
        'index',
        'orderId',
        'orderDetails',
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
        'drivers',
        'zone',
        'area',
        'orderDate',
        'deliveryDate',
      ];
    }

    if (this.userType === '1' || this.userType === '0') {
      this.userFlowType = 'POULTRY';
    } else if (this.userType === '2' || this.userType === '0') {
      this.userFlowType = 'FEEDING';
    }

    if (this.userType === '1' || this.userType === '0') {
      const object = { deliveryType: 1, orderStatus: 'UNAVAILABLE', type: this.userFlowType };
      this.getTypeFilter(object);
    } else if (this.userType === '2' || this.userType === '0') {
      const object = { deliveryType: 1, orderStatus: 'UNAVAILABLE', type: this.userFlowType };
      this.getTypeFilter(object);
    }

    this.authService.getDriversActive(1).subscribe((res: any) => {
      this.getDrivers = res.data.reverse();
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

  openModal(content: any, data: OrderRow) {
    this.modalService.open(content, { centered: true, size: 'lg' });
    this.orderDetail = data;
  }

  resheduleOrder(data: OrderRow, editModal: any) {
    this.clickOrderId = data.id;
    this.modalService.open(editModal, { centered: true, size: 'md' });
  }

  driverClick(driverId: number) {
    this.driverMsg = false;
    this.clickedDriverId = Number(driverId);
  }

  dateEvent(event: any) {
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
        orderStatus: 'DRIVERASSIGNED',
        deliveryBoyId: this.clickedDriverId,
        deliveryOrderDate: this.deliveryDate,
        isRechedule: 1,
      };
      // console.log("DFef",object)
      this.authService.approveOrderSingle(this.clickOrderId, object).subscribe((res: any) => {
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

  getTypeFilter(value: { deliveryType: number; orderStatus: string; type: string }) {
    const object = { deliveryType: value.deliveryType, orderStatus: value.orderStatus, type: value.type };
    this.authService.getOrdersWithStatus(object).subscribe((res: any) => {
      (res.data as OrderRow[]).forEach((element: OrderRow & { zoneName?: string; area?: string; driverName?: string }) => {
        ((element.zoneName = element.deliveryAddress?.zoneName),
          (element.area = element.deliveryAddress?.area),
          (element.driverName = element.deliveryBoyDetail?.userName));
      });
      this.getvalue = res.data as OrderRow[];
      this.dataSource = new MatTableDataSource<OrderRow>(this.getvalue);
      this.dataSource.paginator = this.matPaginator;
      this.dataSource.sort = this.matSort;
    });
  }

  onChangeFilter(value: string) {
    this.deliveryType = value;
    if (this.deliveryType == '1') {
      const object = { deliveryType: 1, orderStatus: 'UNAVAILABLE', type: this.userFlowType };
      this.getTypeFilter(object);
    } else {
      const object = { deliveryType: 0, orderStatus: 'UNAVAILABLE', type: this.userFlowType };
      this.getTypeFilter(object);
    }
  }

  onChangeFlowTypeFilter(value: string) {
    this.userFlowType = value;
    const object = { deliveryType: this.deliveryType, orderStatus: 'UNAVAILABLE', type: this.userFlowType };
    this.getTypeFilter(object);
  }
}
