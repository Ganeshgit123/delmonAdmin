import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ExportType, MatTableExporterDirective } from 'mat-table-exporter';

@Component({
  selector: 'app-merchats',
  templateUrl: './merchats.component.html',
  styleUrls: ['./merchats.component.scss']
})
export class MerchatsComponent implements OnInit {
  displayedColumns: string[];
  dataSource: MatTableDataSource<any>;
  getUsers = [];
  userId: any;
  approveForm: FormGroup;
  submitted = false;
  showAccept = true;
  superAdminRole = false;
  formattedDateTime: string;

  @ViewChild(MatPaginator) matPaginator: MatPaginator;
  @ViewChild(MatSort) matSort: MatSort;
  @ViewChild(MatTableExporterDirective, { static: true }) exporter: MatTableExporterDirective;

  constructor(public authService: AuthService, private toastr: ToastrService, private router: Router,
    private modalService: NgbModal, public fb: FormBuilder, private translate: TranslateService,) { }

  ngOnInit(): void {
    this.callRolePermission();
    if (sessionStorage.getItem('roleName') == 'superAdmin') {
      this.superAdminRole = true;
    } else {
      this.superAdminRole = false;
    }

    if (this.showAccept == true) {
      this.displayedColumns = ['index', 'mobileNumber', 'crNumber', 'userName', 'email', 'merchantType', 'action', 'active'];
    } else if (this.showAccept == false) {
      this.displayedColumns = ['index', 'mobileNumber', 'crNumber', 'userName', 'email', 'merchantType'];
    }

    this.authService.getMerchantUsers().subscribe(
      (res: any) => {
        this.getUsers = res.data;
        this.dataSource = new MatTableDataSource(this.getUsers);
        this.dataSource.paginator = this.matPaginator;
        this.dataSource.sort = this.matSort;
      }
    );

    this.approveForm = this.fb.group({
      merchantType: ['', [Validators.required]],
    });
  }

  get approveF() { return this.approveForm.controls; }

  callRolePermission() {
    if (sessionStorage.getItem('roleName') !== 'superAdmin') {
      let settingPermssion = JSON.parse(sessionStorage.getItem('permission'))
      const orderPermission = settingPermssion?.find(ele => ele.area == 'users')?.write == 1
      // console.log("fef",orderPermission)
      this.showAccept = orderPermission
    }
  }

  ngAfterViewInit(): void {
    this.matPaginator._intl.itemsPerPageLabel = this.translate.instant("itemsPerPage");
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  approve(Package, id) {
    this.userId = id;
    this.modalService.open(Package, { centered: true });
  }

  onSubmitData() {
    this.submitted = true;
    if (this.approveForm.invalid) {
      return;
    }
    this.approveForm.value.isApprove = 1;
    this.authService.approveMerchant(this.approveForm.value, this.userId)
      .subscribe((res: any) => {
        if (res.error == false) {
          this.toastr.success('Success ', res.message);
          this.approveForm.reset();
          this.modalService.dismissAll();
          this.ngOnInit();
        } else {
          this.toastr.warning('Enter valid ', res.message);
        }
      });
  }

  reject(id) {
    this.approveForm.value.isApprove = 2;
    this.authService.approveMerchant(this.approveForm.value, id)
      .subscribe((res: any) => {
        if (res.error == false) {
          this.toastr.success('Success ', res.message);
          this.approveForm.reset();
          this.modalService.dismissAll();
          this.ngOnInit();
        } else {
          this.toastr.warning('Enter valid ', res.message);
        }
      });
  }

  changeActiveStatus(value) {
    if (value.active === 1) {
      var visible = 0
    } else {
      var visible = 1
    }
    const object = { active: visible }
    this.authService.updateUserType(object, value.id)
      .subscribe((res: any) => {
        if (res.error == false) {
          this.toastr.success('Success ', res.message);
          this.ngOnInit();
        } else {
          this.toastr.error('Enter valid ', res.message);
        }
      });
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
      fileName: `Merchants ${this.formattedDateTime}`,
    });
  }

}
