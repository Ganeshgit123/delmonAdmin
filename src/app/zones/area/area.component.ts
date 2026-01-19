import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/shared/auth.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.scss'],
  standalone: true,
  imports: [

  ],
})
export class AreaComponent implements OnInit, AfterViewInit {
  displayedColumns!: string[];
  dataSource!: MatTableDataSource<AreaRow>;
  getvalue: AreaRow[] = [];
  areaForm!: FormGroup;
  isEdit = false;
  zoneId: string | number | null = null;
  areaId: string | number | null = null;
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

    this.route.params.subscribe((params: { [key: string]: string }) => {
      this.zoneId = params['id'];
    });

    if (this.showAccept == true) {
      this.displayedColumns = ['index', 'areaName', 'arAreaName', 'rowActionToggle', 'rowActionIcon'];
    } else if (this.showAccept == false) {
      this.displayedColumns = ['index', 'areaName', 'arAreaName', 'rowActionIcon'];
    }

    this.authService.getAreas(this.zoneId as string | number).subscribe((res: any) => {
      this.getvalue = res.data as AreaRow[];
      this.dataSource = new MatTableDataSource<AreaRow>(this.getvalue);
      this.dataSource.paginator = this.matPaginator;
      this.dataSource.sort = this.matSort;
    });

    this.areaForm = this.fb.group({
      areaName: ['', [Validators.required]],
      arAreaName: ['', [Validators.required]],
      zoneId: [this.zoneId],
    });
  }

  get f() {
    return this.areaForm.controls;
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
    this.areaForm.reset();
    this.isEdit = false;
    this.modalService.open(content, { centered: true });
  }

  onSubmitData() {
    this.submitted = true;
    if (!this.areaForm.valid) {
      return;
    }

    if (this.isEdit) {
      this.areaEditService(this.areaForm.value);
      return;
    }
    this.submitted = false;
    (this.areaForm as any).value.zoneId = this.zoneId;
    this.authService.addAreas(this.areaForm.value).subscribe((res: any) => {
      if (res.error == false) {
        this.toastr.success('Success ', res.message);
        this.areaForm.reset();
        this.modalService.dismissAll();
        this.ngOnInit();
      } else {
        this.toastr.error('Enter valid ', res.message);
      }
    });
  }

  editArea(data: AreaRow, content: any) {
    this.modalService.open(content, { centered: true });
    this.isEdit = true;
    this.areaId = data.id ?? null;

    this.areaForm = this.fb.group({
      areaName: [data.areaName],
      arAreaName: [data.arAreaName],
      zoneId: [data.zoneId],
    });
  }

  areaEditService(data: any) {
    this.authService.editAreasd(data, this.areaId as string | number).subscribe((res: any) => {
      if (res.error == false) {
        this.toastr.success('Success ', res.message);
        this.areaForm.reset();
        this.modalService.dismissAll();
        this.ngOnInit();
      } else {
        this.toastr.error('Enter valid ', res.message);
      }
    });
  }

  changeStatus(value: AreaRow) {
    const visible = value.active === 1 ? 0 : 1;
    const object = { active: visible };

    this.authService.editAreasd(object, value.id as string | number).subscribe((res: any) => {
      if (res.error == false) {
        this.toastr.success('Success ', res.message);
        this.ngOnInit();
      } else {
        this.toastr.error('Enter valid ', res.message);
      }
    });
  }

  areaWithPin(id: string | number) {
    this.router.navigate([`/pin/${id}`]);
  }
}

interface AreaRow {
  id?: string | number;
  areaName?: string;
  arAreaName?: string;
  zoneId?: string | number;
  active?: number;
}

interface Permission {
  area: string;
  write: number;
}
