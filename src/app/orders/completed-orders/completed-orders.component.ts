import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/shared/auth.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService, NgxSpinnerModule } from 'ngx-spinner';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgMaterialModule } from '../../ng-material.module';

@Component({
  selector: 'app-completed-orders',
  templateUrl: './completed-orders.component.html',
  styleUrls: ['./completed-orders.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslateModule, NgMaterialModule, NgbModalModule, NgxSpinnerModule],
})
export class CompletedOrdersComponent implements OnInit, AfterViewInit {
  displayedColumns: string[];
  dataSource: MatTableDataSource<OrderRow>;
  getvalue: OrderRow[] = [];
  orderDetail: any;
  showAccept = true;
  superAdminRole = false;
  userType: any;
  userFlowType: any;
  deliveryType: any = 1;

  @ViewChild(MatPaginator) matPaginator: MatPaginator;
  @ViewChild(MatSort) matSort: MatSort;

  constructor(
    private modalService: NgbModal,
    public fb: FormBuilder,
    public authService: AuthService,
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

    if (this.userType == 1 || this.userType == 0) {
      this.userFlowType = 'POULTRY';
    } else if (this.userType == 2 || this.userType == 0) {
      this.userFlowType = 'FEEDING';
    }

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

    if (this.userType == 1 || this.userType == 0) {
      const object = { deliveryType: 1, orderStatus: 'COMPLETED', type: this.userFlowType };
      this.getTypeFilter(object);
    } else if (this.userType == 2 || this.userType == 0) {
      const object = { deliveryType: 1, orderStatus: 'COMPLETED', type: this.userFlowType };
      this.getTypeFilter(object);
    }
  }

  callRolePermission() {
    if (sessionStorage.getItem('roleName') !== 'superAdmin') {
      const permStr = sessionStorage.getItem('permission');
      const settingPermssion: Array<{ area: string; read: number; write: number }> | null = permStr
        ? JSON.parse(permStr)
        : null;
      const orderPermission = settingPermssion?.find((ele: { area: string; read: number; write: number }) => ele.area == 'orders')?.write == 1;
      // console.log("fef",orderPermission)
      this.showAccept = orderPermission;
    }
  }

  ngAfterViewInit(): void {
    this.matPaginator._intl.itemsPerPageLabel = this.translate.instant('itemsPerPage');
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

  openModal(content: any, data: OrderRow) {
    this.modalService.open(content, { centered: true, size: 'lg' });
    this.orderDetail = data;
  }

  getTypeFilter(value: { deliveryType: number | string; orderStatus: string; type: string }) {
    this.spinner.show();
    const object = { deliveryType: value.deliveryType, orderStatus: value.orderStatus, type: value.type };
    this.authService.getOrdersWithStatus(object).subscribe((res: any) => {
      res.data.forEach((element: any) => {
        ((element.zoneName = element.deliveryAddress?.zoneName),
          (element.area = element.deliveryAddress?.area),
          (element.driverName = element.deliveryBoyDetail?.userName));
      });
      this.getvalue = res.data as OrderRow[];
      this.spinner.hide();
      this.dataSource = new MatTableDataSource<OrderRow>(this.getvalue);
      this.dataSource.paginator = this.matPaginator;
      this.dataSource.sort = this.matSort;
    });
  }

  onChangeFilter(value: string | number) {
    this.deliveryType = value;
    if (this.deliveryType == '1') {
      const object = { deliveryType: 1, orderStatus: 'COMPLETED', type: this.userFlowType };
      this.getTypeFilter(object);
    } else {
      const object = { deliveryType: 0, orderStatus: 'COMPLETED', type: this.userFlowType };
      this.getTypeFilter(object);
    }
  }

  onChangeFlowTypeFilter(value: string) {
    this.userFlowType = value;
    const object = { deliveryType: this.deliveryType, orderStatus: 'COMPLETED', type: this.userFlowType };
    this.getTypeFilter(object);
  }
}

interface OrderRow {
  orderId: number | string;
  orderDetails?: unknown;
  drivers?: unknown;
  zoneName?: string;
  area?: string;
  orderDate?: string;
  deliveryDate?: string;
  deliveryAddress?: { zoneName?: string; area?: string };
  deliveryBoyDetail?: { userName?: string };
  driverName?: string;
}
