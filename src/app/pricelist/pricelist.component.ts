import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/shared/auth.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-pricelist',
  templateUrl: './pricelist.component.html',
  styleUrls: ['./pricelist.component.scss'],
})
export class PricelistComponent implements OnInit, AfterViewInit {
  displayedColumns: string[];
  dataSource: MatTableDataSource<any>;
  getvalue = [];
  priceListForm: FormGroup;
  isEdit = false;
  bannerId: any;
  submitted = false;
  priceNameId: any;
  showAccept = true;
  superAdminRole = false;

  @ViewChild(MatPaginator) matPaginator: MatPaginator;
  @ViewChild(MatSort) matSort: MatSort;

  constructor(
    private modalService: NgbModal,
    public fb: FormBuilder,
    public authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.callRolePermission();
    if (sessionStorage.getItem('roleName') == 'superAdmin') {
      this.superAdminRole = true;
    } else {
      this.superAdminRole = false;
    }

    this.displayedColumns = ['index', 'name', 'rowActionIcon'];

    this.authService.getPriceListName().subscribe((res: any) => {
      this.getvalue = res.data;
      this.dataSource = new MatTableDataSource(this.getvalue);
      this.dataSource.paginator = this.matPaginator;
      this.dataSource.sort = this.matSort;
    });

    this.priceListForm = this.fb.group({
      name: ['', [Validators.required]],
    });
  }

  get f() {
    return this.priceListForm.controls;
  }

  callRolePermission() {
    if (sessionStorage.getItem('roleName') !== 'superAdmin') {
      const settingPermssion = JSON.parse(sessionStorage.getItem('permission'));
      const orderPermission = settingPermssion?.find((ele) => ele.area == 'priceList')?.write == 1;
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

  openModal(content) {
    this.priceListForm.reset();
    this.isEdit = false;
    this.modalService.open(content, { centered: true });
  }

  onSubmitData() {
    this.submitted = true;
    if (!this.priceListForm.valid) {
      return false;
    }

    if (this.isEdit) {
      this.priceNameEditService(this.priceListForm.value);
      return;
    }
    this.submitted = false;
    this.authService.addPriceListName(this.priceListForm.value).subscribe((res: any) => {
      if (res.error == false) {
        this.toastr.success('Success ', res.message);
        this.priceListForm.reset();
        this.modalService.dismissAll();
        this.ngOnInit();
      } else {
        this.toastr.error('Enter valid ', res.message);
      }
    });
  }

  editPriceName(data, content) {
    this.modalService.open(content, { centered: true });
    this.isEdit = true;
    this.priceNameId = data['id'];

    this.priceListForm = this.fb.group({
      name: [data['name']],
    });
  }

  priceNameEditService(data) {
    this.authService.editPriceListName(data, this.priceNameId).subscribe((res: any) => {
      if (res.error == false) {
        this.toastr.success('Success ', res.message);
        this.priceListForm.reset();
        this.modalService.dismissAll();
        this.ngOnInit();
      } else {
        this.toastr.error('Enter valid ', res.message);
      }
    });
  }

  deletePriceName(value) {
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
          this.authService.deletePriceListName(value).subscribe((res: any) => {
            if (res.error == false) {
              this.toastr.success('Success ', res.message);
              this.ngOnInit();
            } else {
              this.toastr.error('Error', res.message);
            }
          }));
      }
    });
  }

  setPrice(id) {
    this.router.navigate([`/assing_product_pricelist/${id}`]);
  }
}
