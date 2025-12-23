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
  selector: 'app-spin-wheel',
  templateUrl: './spin-wheel.component.html',
  styleUrls: ['./spin-wheel.component.scss'],
})
export class SpinWheelComponent implements OnInit, AfterViewInit {
  displayedColumns: string[];
  dataSource: MatTableDataSource<any>;
  getvalue = [];
  isEdit = false;
  spinForm: FormGroup;
  submitted = false;
  showAccept = true;
  superAdminRole = false;
  spinId: any;
  startDate: any = '';
  endDate: any = '';
  getOrders = [];
  userIds: number[];

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

    this.displayedColumns = ['index', 'userID', 'user_name', 'mobile_number', 'totalAmount'];

    const object = { startDate: this.startDate, endDate: this.endDate, amount: '' };
    this.authService.getSpinList(object).subscribe((res: any) => {
      this.getOrders = res.data;
      this.dataSource = new MatTableDataSource(this.getOrders);
      this.dataSource.paginator = this.matPaginator;
      this.dataSource.sort = this.matSort;
    });
  }

  callRolePermission() {
    if (sessionStorage.getItem('roleName') !== 'superAdmin') {
      const settingPermssion = JSON.parse(sessionStorage.getItem('permission'));
      const orderPermission = settingPermssion?.find((ele) => ele.area == 'master')?.write == 1;
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

  startEvent(event) {
    const stDate = event.value;
    const date = new Date(stDate);

    const year: number = date.getFullYear();
    const month: number = date.getMonth() + 1; // Note: Months are zero-indexed, so add 1
    const day: number = date.getDate();

    const startFomatDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

    this.startDate = startFomatDate;
  }

  endEvent(event) {
    const stDate = event.value;
    const date = new Date(stDate);

    const year: number = date.getFullYear();
    const month: number = date.getMonth() + 1; // Note: Months are zero-indexed, so add 1
    const day: number = date.getDate();

    const endFomatDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

    this.endDate = endFomatDate;
  }

  getList(value) {
    const object = { startDate: this.startDate, endDate: this.endDate, amount: value };
    this.authService.getSpinList(object).subscribe((res: any) => {
      this.getOrders = res.data;
      this.dataSource = new MatTableDataSource(this.getOrders);
      this.dataSource.paginator = this.matPaginator;
      this.dataSource.sort = this.matSort;
    });
  }

  addSpinUsers() {
    this.userIds = this.getOrders.map((item) => item.userID);
    const stingIds = JSON.stringify(this.userIds);
    const object = { id: stingIds };
    const stringOBj = JSON.stringify(object);
    console.log(stringOBj);
    this.authService.addUserIdForSpinner(stringOBj).subscribe((res: any) => {
      if (res.success == true) {
        this.toastr.success('Success ', res.massage);
        this.ngOnInit();
      } else {
        this.toastr.error('Enter valid ', res.massage);
      }
    });
  }

  restrictNumeric(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }
}
