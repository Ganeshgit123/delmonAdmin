import { Component, OnInit, ViewChild } from '@angular/core';
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
  selector: 'app-completed-orders',
  templateUrl: './completed-orders.component.html',
  styleUrls: ['./completed-orders.component.scss']
})
export class CompletedOrdersComponent implements OnInit {
  displayedColumns: string[];
  dataSource: MatTableDataSource<any>;
  getvalue = [];
  orderDetail: any;
  showAccept = true;
  superAdminRole = false;
  userType: any;
  userFlowType: any;
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

    this.displayedColumns = ['index', 'orderId', 'orderDetails', 'drivers',
      'zone', 'area', 'orderDate', 'deliveryDate'];

    if (this.userType == 1 || this.userType == 0) {
      const object = { deliveryType: 1, orderStatus: 'COMPLETED', type: this.userFlowType }
      this.getTypeFilter(object)
    } else if (this.userType == 2 || this.userType == 0) {
      const object = { deliveryType: 1, orderStatus: 'COMPLETED', type: this.userFlowType }
      this.getTypeFilter(object)
    }
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
    const object = { deliveryType: value.deliveryType, orderStatus: value.orderStatus, type: value.type }
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
      const object = { deliveryType: 1, orderStatus: 'COMPLETED', type: this.userFlowType }
      this.getTypeFilter(object)
    } else {
      const object = { deliveryType: 0, orderStatus: 'COMPLETED', type: this.userFlowType }
      this.getTypeFilter(object)
    }
  }

  onChangeFlowTypeFilter(value) {
    this.userFlowType = value;
    const object = { deliveryType: this.deliveryType, orderStatus: 'COMPLETED', type: this.userFlowType }
    this.getTypeFilter(object)
  }

}
