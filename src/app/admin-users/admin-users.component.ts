import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/shared/auth.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { NgMaterialModule } from '../ng-material.module';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss'],
  standalone: true,
  imports: [CommonModule, NgMaterialModule, TranslateModule],
})
export class AdminUsersComponent implements OnInit, AfterViewInit {
  displayedColumns: string[];
  dataSource: MatTableDataSource<AdminUserRow>;
  getAdminUsers: AdminUserRow[] = [];
  adminUserForm: FormGroup;
  isEdit = false;
  adminUserId: number | null = null;
  getRoles: RoleRow[] = [];
  submitted = false;
  some: any;
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

    if (this.showAccept == true) {
      this.displayedColumns = ['index', 'email', 'password', 'userType', 'role', 'rowActionIcon'];
    } else if (this.showAccept == false) {
      this.displayedColumns = ['index', 'email', 'password', 'userType', 'role'];
    }

    this.authService.getAdminUser().subscribe((res: any) => {
      res.data = res.data.filter((obj: any) => obj.id !== 1);
      this.getAdminUsers = (res.data as AdminUserRow[]).reverse();
      this.dataSource = new MatTableDataSource<AdminUserRow>(this.getAdminUsers);
      this.dataSource.paginator = this.matPaginator;
      this.dataSource.sort = this.matSort;
    });

    this.authService.getRoles().subscribe((res: any) => {
      this.getRoles = res.data as RoleRow[];
    });

    this.adminUserForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      userType: ['', [Validators.required]],
      roles: ['', [Validators.required]],
    });
  }

  get f() {
    return this.adminUserForm.controls;
  }

  callRolePermission() {
    if (sessionStorage.getItem('roleName') !== 'superAdmin') {
      const permStr = sessionStorage.getItem('permission');
      const settingPermssion: Array<{ area: string; read: number; write: number }> | null = permStr
        ? JSON.parse(permStr)
        : null;
      const orderPermission = settingPermssion?.find((ele: { area: string; read: number; write: number }) => ele.area == 'adminUsers')?.write == 1;
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
    this.adminUserForm.reset();
    this.isEdit = false;
    this.modalService.open(content, { centered: true });
  }

  editAdminUser(data: AdminUserRow, content: any) {
    this.modalService.open(content, { centered: true });
    this.isEdit = true;
    this.adminUserId = data.id;

    this.adminUserForm = this.fb.group({
      email: [data.email],
      password: [data.password],
      userType: [data.userType],
      roles: [data.roles],
    });
  }

  onSubmitData() {
    this.submitted = true;
    if (!this.adminUserForm.valid) {
      return false;
    }

    if (this.isEdit) {
      this.adminEditService(this.adminUserForm.value);
      return;
    }

    this.submitted = false;
    this.authService.addAdminUser(this.adminUserForm.value).subscribe((res: any) => {
      if (res.error == false) {
        this.toastr.success('Success ', res.message);
        this.adminUserForm.reset();
        this.modalService.dismissAll();
        this.ngOnInit();
      } else {
        this.toastr.warning('Enter valid ', res.message);
      }
    });
  }

  adminEditService(data: any) {
    this.authService.editAdminUser(data, this.adminUserId).subscribe((res: any) => {
      if (res.error == false) {
        this.toastr.success('Success ', res.message);
        this.adminUserForm.reset();
        this.modalService.dismissAll();
        this.ngOnInit();
      } else {
        this.toastr.warning('Enter valid ', res.message);
      }
    });
  }

  getNameById(id: number): string {
    const item = this.getRoles.find((item: RoleRow) => item.id === id);
    return item ? item.roleName : 'Unknown';
  }
}

interface AdminUserRow {
  id: number;
  email: string;
  password: string;
  userType: string;
  roles: number;
}

interface RoleRow {
  id: number;
  roleName: string;
}
