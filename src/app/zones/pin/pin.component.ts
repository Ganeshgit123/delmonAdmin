import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/shared/auth.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-pin',
  templateUrl: './pin.component.html',
  styleUrls: ['./pin.component.scss'],
})
export class PinComponent implements OnInit, AfterViewInit {
  displayedColumns!: string[];
  dataSource!: MatTableDataSource<any>;
  getvalue: any[] = [];
  pinForm!: FormGroup;
  isEdit = false;
  areaId: any;
  pinId: any;
  submitted = false;
  showAccept = true;
  superAdminRole = false;

  @ViewChild(MatPaginator) matPaginator!: MatPaginator;
  @ViewChild(MatSort) matSort!: MatSort;

  constructor(
    private modalService: NgbModal,
    public fb: FormBuilder,
    public authService: AuthService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.callRolePermission();
    if (sessionStorage.getItem('roleName') == 'superAdmin') {
      this.superAdminRole = true;
    } else {
      this.superAdminRole = false;
    }

    this.route.params.subscribe((params) => {
      this.areaId = params['id'];
    });

    if (this.showAccept == true) {
      this.displayedColumns = ['index', 'pin', 'rowActionToggle', 'rowActionIcon'];
    } else if (this.showAccept == false) {
      this.displayedColumns = ['index', 'pin'];
    }

    this.authService.getPin(this.areaId).subscribe((res: any) => {
      this.getvalue = res.data;
      this.dataSource = new MatTableDataSource<any>(this.getvalue as any[]);
      this.dataSource.paginator = this.matPaginator;
      this.dataSource.sort = this.matSort;
    });

    this.pinForm = this.fb.group({
      pin: ['', [Validators.required]],
      areaId: [this.areaId],
    });
  }

  get f() {
    return this.pinForm.controls;
  }

  callRolePermission() {
    if (sessionStorage.getItem('roleName') !== 'superAdmin') {
      const rawPermission = sessionStorage.getItem('permission');
      const settingPermssion = rawPermission ? JSON.parse(rawPermission) : null;
      const orderPermission = settingPermssion?.find((ele) => ele.area == 'zones')?.write == 1;
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
    this.pinForm.reset();
    this.isEdit = false;
    this.modalService.open(content, { centered: true });
  }

  onSubmitData() {
    this.submitted = true;
    if (!this.pinForm.valid) {
      return false;
    }

    if (this.isEdit) {
      this.pinEditService(this.pinForm.value);
      return;
    }
    this.submitted = false;

    this.pinForm.value.areaId = this.areaId;

    this.authService.addPin(this.pinForm.value).subscribe((res: any) => {
      if (res.error == false) {
        this.toastr.success('Success ', res.message);
        this.pinForm.reset();
        this.modalService.dismissAll();
        this.ngOnInit();
      } else {
        this.toastr.error('Enter valid ', res.message);
      }
    });
  }

  editPin(data, content) {
    this.modalService.open(content, { centered: true });
    this.isEdit = true;
    this.pinId = data['id'];

    this.pinForm = this.fb.group({
      pin: [data['pin']],
      areaId: [data['areaId']],
    });
  }

  pinEditService(data) {
    this.authService.editPin(data, this.pinId).subscribe((res: any) => {
      if (res.error == false) {
        this.toastr.success('Success ', res.message);
        this.pinForm.reset();
        this.modalService.dismissAll();
        this.ngOnInit();
      } else {
        this.toastr.error('Enter valid ', res.message);
      }
    });
  }

  changeStatus(value) {
    if (value.active === 1) {
      var visible = 0;
    } else {
      var visible = 1;
    }
    const object = { active: visible };

    this.authService.editPin(object, value.id).subscribe((res: any) => {
      if (res.error == false) {
        this.toastr.success('Success ', res.message);
        this.ngOnInit();
      } else {
        this.toastr.error('Enter valid ', res.message);
      }
    });
  }
}
