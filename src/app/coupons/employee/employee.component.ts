import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/shared/auth.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit {
  displayedColumns: string[];
  dataSource: MatTableDataSource<any>;
  getvalue = [];
  isEdit = false;
  couponForm: FormGroup;
  submitted = false;
  couponId: any;
  showAccept = true;
  superAdminRole = false;

  @ViewChild(MatPaginator) matPaginator: MatPaginator;
  @ViewChild(MatSort) matSort: MatSort;

  constructor(private modalService: NgbModal, public fb: FormBuilder, public authService: AuthService,
    private toastr: ToastrService, private router: Router, private translate: TranslateService,) { }

  ngOnInit(): void {
    this.callRolePermission();
    if (sessionStorage.getItem('roleName') == 'superAdmin') {
      this.superAdminRole = true;
    } else {
      this.superAdminRole = false;
    }

    this.authService.getCoupon('EMPLOYEE').subscribe(
      (res: any) => {
        this.getvalue = res.data.reverse();
        this.dataSource = new MatTableDataSource(this.getvalue);
        this.dataSource.paginator = this.matPaginator;
        this.dataSource.sort = this.matSort;
      });

    if (this.showAccept == true) {
      this.displayedColumns = ['index', 'enCouponName', 'couponCode', 'discountPercentage', 'maximumDiscount', 'title', 'enDescription', 'expiryDate', 'rowActionToggle', 'rowActionIcon'];
    } else if (this.showAccept == false) {
      this.displayedColumns = ['index', 'enCouponName', 'couponCode', 'discountPercentage', 'maximumDiscount', 'title', 'enDescription', 'expiryDate'];
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

  get f() { return this.couponForm.controls; }

  callRolePermission() {
    if (sessionStorage.getItem('roleName') !== 'superAdmin') {
      let settingPermssion = JSON.parse(sessionStorage.getItem('permission'))
      const orderPermission = settingPermssion?.find(ele => ele.area == 'coupons')?.write == 1
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

  openModal(content) {
    this.submitted = false;
    this.couponForm.reset();
    this.isEdit = false;
    this.modalService.open(content, { centered: true, size: 'lg' });
  }

  onCouponInput(event: any): void {
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

  editCoupon(data, content) {
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

  onSubmitData() {
    this.submitted = true;
    if (!this.couponForm.valid) {
      return false;
    }

    if (this.isEdit) {
      this.couponEditService(this.couponForm.value)
      return;
    }
    this.submitted = false;
    this.couponForm.value.type = 'EMPLOYEE';
    this.authService.addCoupon(this.couponForm.value)
      .subscribe((res: any) => {
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

  couponEditService(data) {
    this.authService.editCoupon(data, this.couponId)
      .subscribe((res: any) => {
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

  changeStatus(value) {
    if (value.active === 1) {
      var visible = 0
    } else {
      var visible = 1
    }
    const object = { active: visible }

    this.authService.editCoupon(object, value.id)
      .subscribe((res: any) => {
        if (res.success == true) {
          this.toastr.success('Success ', res.massage);
          this.ngOnInit();
        } else {
          this.toastr.error('Enter valid ', res.massage);
        }
      });
  }

  deleteCoupon(value) {
    Swal.fire({
      title: this.translate.instant("AreYouSure"),
      text: this.translate.instant("YouWontBeRevertThis"),
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: this.translate.instant("Cancel"),
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: this.translate.instant("YesDeleteIt")
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: this.translate.instant("Deleted"),
          text: this.translate.instant("YourFileHasBeenDeleted"),
          icon: 'success',
          confirmButtonText: this.translate.instant("Ok")
        }),
          this.authService.deleteCoupons(value).subscribe((res: any) => {
            if (res.success == true) {
              this.toastr.success('Success ', res.massage);
              this.ngOnInit();
            } else {
              this.toastr.error('Enter valid ', res.massage);
            }
          });
      }
    })
  }
}


