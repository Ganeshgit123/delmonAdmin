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
  selector: 'app-spin-wheel-slices',
  templateUrl: './spin-wheel-slices.component.html',
  styleUrls: ['./spin-wheel-slices.component.scss'],
})
export class SpinWheelSlicesComponent implements OnInit {
  displayedColumns: string[];
  dataSource: MatTableDataSource<any>;
  getvalue = [];
  isEdit = false;
  spinForm: FormGroup;
  submitted = false;
  showAccept = true;
  superAdminRole = false;
  spinId: any;

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

    this.displayedColumns = ['index', 'type', 'title', 'rowActionToggle', 'rowActionIcon'];

    this.authService.getSpinWheel().subscribe((res: any) => {
      this.getvalue = res.data;
      this.dataSource = new MatTableDataSource(this.getvalue);
      this.dataSource.paginator = this.matPaginator;
      this.dataSource.sort = this.matSort;
    });

    this.spinForm = this.fb.group({
      type: ['', [Validators.required]],
      title: ['', [Validators.required]],
    });
  }

  get f() {
    return this.spinForm.controls;
  }

  callRolePermission() {
    if (sessionStorage.getItem('roleName') !== 'superAdmin') {
      const settingPermssion = JSON.parse(sessionStorage.getItem('permission'));
      const orderPermission = settingPermssion?.find((ele) => ele.area == 'master')?.write == 1;
      // console.log("fef",orderPermission)
      this.showAccept = orderPermission;
    }
  }

  gAfterViewInit(): void {
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
    this.submitted = false;
    this.spinForm.reset();
    this.isEdit = false;
    this.modalService.open(content, { centered: true, size: 'md' });
  }

  editSpinData(data, content) {
    this.modalService.open(content, { centered: true, size: 'md' });
    this.isEdit = true;
    this.spinId = data['id'];

    this.spinForm = this.fb.group({
      type: [data['type']],
      title: [data['title']],
    });
  }

  onSubmitData() {
    this.submitted = true;
    if (!this.spinForm.valid) {
      return false;
    }

    if (this.isEdit) {
      this.spinWheelEditService(this.spinForm.value);
      return;
    }
    this.submitted = false;
    this.authService.addSpinWheel(this.spinForm.value).subscribe((res: any) => {
      if (res.success == true) {
        this.toastr.success('Success ', res.massage);
        this.spinForm.reset();
        this.modalService.dismissAll();
        this.ngOnInit();
      } else {
        this.toastr.error('Enter valid ', res.massage);
      }
    });
  }

  spinWheelEditService(data) {
    this.authService.editSpinWheel(data, this.spinId).subscribe((res: any) => {
      if (res.success == true) {
        this.toastr.success('Success ', res.massage);
        this.spinForm.reset();
        this.modalService.dismissAll();
        this.ngOnInit();
      } else {
        this.toastr.error('Enter valid ', res.massage);
      }
    });
  }

  changeStatus(value) {
    const visible = value.active === 1 ? 0 : 1;
    const object = { active: visible };

    this.authService.editSpinWheel(object, value.id).subscribe((res: any) => {
      if (res.success == true) {
        this.toastr.success('Success ', res.massage);
        this.ngOnInit();
      } else {
        this.toastr.error('Enter valid ', res.massage);
      }
    });
  }
}
