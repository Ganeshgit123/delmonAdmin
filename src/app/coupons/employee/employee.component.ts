import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/shared/auth.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import { ReactiveFormsModule } from '@angular/forms';
import { NgMaterialModule } from 'src/app/ng-material.module';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, NgMaterialModule, NgbModalModule],
})
export class EmployeeComponent implements OnInit, AfterViewInit {
  displayedColumns: string[];
  dataSource: MatTableDataSource<CouponRow>;
  getvalue: CouponRow[] = [];
  isEdit = false;
  couponForm: FormGroup;
  submitted = false;
  couponId: number;
  showAccept = true;
  superAdminRole = false;

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
    if (sessionStorage.getItem('roleName') == 'superAdmin') {
      this.superAdminRole = true;
    } else {
      this.superAdminRole = false;
    }

    this.authService.getCoupon('EMPLOYEE').subscribe((res: any) => {
      this.getvalue = (res.data as CouponRow[]).reverse();
      this.dataSource = new MatTableDataSource<CouponRow>(this.getvalue);
      this.dataSource.paginator = this.matPaginator;
      this.dataSource.sort = this.matSort;
    });

    if (this.showAccept == true) {
      this.displayedColumns = [
        'index',
        'enCouponName',
        'couponCode',
        'discountPercentage',
        'maximumDiscount',
        'title',
        'enDescription',
        'expiryDate',
        'rowActionToggle',
        'rowActionIcon',
      ];
    } else if (this.showAccept == false) {
      this.displayedColumns = [
        'index',
        'enCouponName',
        'couponCode',
        'discountPercentage',
        'maximumDiscount',
        'title',
        'enDescription',
        'expiryDate',
      ];
    }

    this.couponForm = this.fb.group({
      enCouponName: ['', [Validators.required]],
      arCouponName: ['', [Validators.required]],
      couponCode: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]*$/)]],
      discountPercentage: ['', [Validators.required]],
      maximumDiscount: ['', [Validators.required]],
      title: ['', [Validators.required]],
      enDescription: ['', [Validators.required]],
      arDescription: ['', [Validators.required]],
      expiryDate: ['', [Validators.required]],
    });
  }

  get f() {
    return this.couponForm.controls;
  }

  callRolePermission() {
    if (sessionStorage.getItem('roleName') !== 'superAdmin') {
      const raw = sessionStorage.getItem('permission');
      const settingPermssion: Array<{ area: string; write: number }> = raw ? JSON.parse(raw) : [];
      const orderPermission = settingPermssion.find((ele) => ele.area === 'coupons')?.write === 1;
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

  openModal(content: any) {
    this.submitted = false;
    this.couponForm.reset();
    this.isEdit = false;
    this.modalService.open(content, { centered: true, size: 'lg' });
  }

  onCouponInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const filteredValue = input.value.replace(/[^a-zA-Z]/g, '');
    input.value = filteredValue;
    this.couponForm.controls['couponCode'].setValue(filteredValue, { emitEvent: false });
  }

  onCouponPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pastedText = event.clipboardData?.getData('text') || '';
    const sanitized = pastedText.replace(/[^a-zA-Z]/g, '');
    const input = event.target as HTMLInputElement;
    input.value = sanitized;
    this.couponForm.controls['couponCode'].setValue(sanitized, { emitEvent: false });
  }

  editCoupon(data: CouponRow, content: any) {
    this.modalService.open(content, { centered: true, size: 'lg' });
    this.isEdit = true;
    this.couponId = data['id'];

    this.couponForm = this.fb.group({
      enCouponName: [data['enCouponName']],
      arCouponName: [data['arCouponName']],
      couponCode: [data['couponCode']],
      discountPercentage: [data['discountPercentage']],
      maximumDiscount: [data['maximumDiscount']],
      title: [data['title']],
      arDescription: [data['arDescription']],
      enDescription: [data['enDescription']],
      expiryDate: [data['expiryDate']],
      type: [data['type']],
    });
  }

  onSubmitData(): boolean | void {
    this.submitted = true;
    if (!this.couponForm.valid) {
      return false;
    }

    if (this.isEdit) {
      this.couponEditService(this.couponForm.value);
      return;
    }
    this.submitted = false;
    this.couponForm.value.type = 'EMPLOYEE';
    this.authService.addCoupon(this.couponForm.value).subscribe((res: any) => {
      if (res.success == true) {
        this.toastr.success('Success ', res.massage);
        this.couponForm.reset();
        this.modalService.dismissAll();
        this.ngOnInit();
      } else {
        this.toastr.error('Enter valid ', res.massage);
      }
    });
  }

  couponEditService(data: CouponRow) {
    this.authService.editCoupon(data, this.couponId).subscribe((res: any) => {
      if (res.success == true) {
        this.toastr.success('Success ', res.massage);
        this.couponForm.reset();
        this.modalService.dismissAll();
        this.ngOnInit();
      } else {
        this.toastr.error('Enter valid ', res.massage);
      }
    });
  }

  changeStatus(value: CouponRow) {
    const visible = value.active === 1 ? 0 : 1;
    const object = { active: visible };

    this.authService.editCoupon(object, value.id).subscribe((res: any) => {
      if (res.success == true) {
        this.toastr.success('Success ', res.massage);
        this.ngOnInit();
      } else {
        this.toastr.error('Enter valid ', res.massage);
      }
    });
  }

  deleteCoupon(id: number) {
    Swal.fire({
      title: this.translate.instant('AreYouSure'),
      text: this.translate.instant('YouWontBeRevertThis'),
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: this.translate.instant('Cancel'),
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: this.translate.instant('YesDeleteIt'),
    }).then((result) => {
      if (result.isConfirmed) {
        (Swal.fire({
          title: this.translate.instant('Deleted'),
          text: this.translate.instant('YourFileHasBeenDeleted'),
          icon: 'success',
          confirmButtonText: this.translate.instant('Ok'),
        }),
          this.authService.deleteCoupons(id).subscribe((res: any) => {
            if (res.success == true) {
              this.toastr.success('Success ', res.massage);
              this.ngOnInit();
            } else {
              this.toastr.error('Enter valid ', res.massage);
            }
          }));
      }
    });
  }
}

interface CouponRow {
  id: number;
  enCouponName: string;
  arCouponName: string;
  couponCode: string;
  discountPercentage: number;
  maximumDiscount: number;
  title: string;
  enDescription: string;
  arDescription: string;
  expiryDate: string;
  active: number;
  type?: string;
}
