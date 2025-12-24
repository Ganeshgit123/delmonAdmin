import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/shared/auth.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-zones',
  templateUrl: './zones.component.html',
  styleUrls: ['./zones.component.scss'],
})
export class ZonesComponent implements OnInit, AfterViewInit {
  displayedColumns!: string[];
  dataSource!: MatTableDataSource<ZoneRow>;
  getvalue: ZoneRow[] = [];
  zoneForm!: FormGroup;
  isEdit = false;
  zoneId: string | number | null = null;
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

    if (this.showAccept == true) {
      this.displayedColumns = ['index', 'name', 'arName', 'deliveryCharge', 'rowActionToggle', 'rowActionIcon'];
    } else if (this.showAccept == false) {
      this.displayedColumns = ['index', 'name', 'arName', 'deliveryCharge', 'rowActionIcon'];
    }

    this.authService.getZones().subscribe((res: any) => {
      this.getvalue = res.data as ZoneRow[];
      this.dataSource = new MatTableDataSource<ZoneRow>(this.getvalue);
      this.dataSource.paginator = this.matPaginator;
      this.dataSource.sort = this.matSort;
    });

    this.zoneForm = this.fb.group({
      name: ['', [Validators.required]],
      arName: ['', [Validators.required]],
      deliveryCharge: ['', [Validators.required, Validators.pattern(/^\d+\.\d{0,3}$/)]],
    });
  }

  get f() {
    return this.zoneForm.controls;
  }

  callRolePermission() {
    if (sessionStorage.getItem('roleName') !== 'superAdmin') {
      const rawPermission = sessionStorage.getItem('permission');
      const settingPermssion: Permission[] = rawPermission ? (JSON.parse(rawPermission) as Permission[]) : [];
      const orderPermission = settingPermssion?.find((ele: Permission) => ele.area == 'zones')?.write == 1;
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
    this.zoneForm.reset();
    this.isEdit = false;
    this.modalService.open(content, { centered: true });
  }

  onSubmitData() {
    this.submitted = true;
    if (!this.zoneForm.valid) {
      return;
    }

    if (this.isEdit) {
      this.zoneEditService(this.zoneForm.value);
      return;
    }
    this.submitted = false;
    this.authService.addZone(this.zoneForm.value).subscribe((res: any) => {
      if (res.error == false) {
        this.toastr.success('Success ', res.message);
        this.zoneForm.reset();
        this.modalService.dismissAll();
        this.ngOnInit();
      } else {
        this.toastr.error('Enter valid ', res.message);
      }
    });
  }

  editZone(data: ZoneRow, content: any) {
    this.modalService.open(content, { centered: true });
    this.isEdit = true;
    this.zoneId = data.id ?? null;

    this.zoneForm = this.fb.group({
      name: [data.name],
      arName: [data.arName],
      deliveryCharge: [data.deliveryCharge],
    });
  }

  zoneEditService(data: any) {
    this.authService.editZone(data, this.zoneId as string | number).subscribe((res: any) => {
      if (res.error == false) {
        this.toastr.success('Success ', res.message);
        this.zoneForm.reset();
        this.modalService.dismissAll();
        this.ngOnInit();
      } else {
        this.toastr.error('Enter valid ', res.message);
      }
    });
  }

  changeStatus(value: ZoneRow) {
    const visible = value.active === 1 ? 0 : 1;
    const object = { active: visible };

    this.authService.editZone(object, value.id as string | number).subscribe((res: any) => {
      if (res.error == false) {
        this.toastr.success('Success ', res.message);
        this.ngOnInit();
      } else {
        this.toastr.error('Enter valid ', res.message);
      }
    });
  }

  zoneWithArea(id: string | number) {
    this.router.navigate([`/area/${id}`]);
  }
}

interface ZoneRow {
  id?: string | number;
  name?: string;
  arName?: string;
  deliveryCharge?: string | number;
  active?: number;
}

interface Permission {
  area: string;
  write: number;
}
