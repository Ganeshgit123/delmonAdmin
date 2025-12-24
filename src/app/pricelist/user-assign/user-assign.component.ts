import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiResponse } from 'src/app/shared/models/api-response';
import { AuthService } from 'src/app/shared/auth.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';


interface PriceListName {
  id: number;
  name: string;
}

interface UserAssignItem {
  id: number;
  name: string;
  priceListNames?: string[] | string;
}

@Component({
  selector: 'app-user-assign',
  templateUrl: './user-assign.component.html',
  styleUrls: ['./user-assign.component.scss'],
})
export class UserAssignComponent implements OnInit, AfterViewInit {
  displayedColumns: string[];
  dataSource: MatTableDataSource<UserAssignItem>;
  getvalue: UserAssignItem[] = [];
  userListForm: FormGroup;
  submitted = false;
  getPriceName: PriceListName[] = [];
  showAccept = true;
  superAdminRole = false;

  @ViewChild(MatPaginator) matPaginator: MatPaginator;
  @ViewChild(MatSort) matSort: MatSort;

  constructor(
    public fb: FormBuilder,
    public authService: AuthService,
    private toastr: ToastrService,
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.callRolePermission();
    if (sessionStorage.getItem('roleName') === 'superAdmin') {
      this.superAdminRole = true;
    } else {
      this.superAdminRole = false;
    }

    if (this.showAccept === true) {
      this.displayedColumns = ['index', 'name', 'priceListNames', 'rowActionIcon'];
    } else if (this.showAccept === false) {
      this.displayedColumns = ['index', 'name', 'priceListNames'];
    }

    this.authService.getuserListPrice().subscribe((res) => {
      this.getvalue = (res as ApiResponse<UserAssignItem[]>).data;
      this.dataSource = new MatTableDataSource(this.getvalue);
      this.dataSource.paginator = this.matPaginator;
      this.dataSource.sort = this.matSort;
    });

    this.authService.getPriceListName().subscribe((res) => {
      this.getPriceName = (res as ApiResponse<PriceListName[]>).data;
    });

    this.userListForm = this.fb.group({
      name: ['', [Validators.required]],
    });
  }

  get f() {
    return this.userListForm.controls;
  }

  callRolePermission() {
    if (sessionStorage.getItem('roleName') !== 'superAdmin') {
      const permRaw = sessionStorage.getItem('permission');
      const settingPermssion = permRaw ? (JSON.parse(permRaw) as { area: string; write: number }[]) : null;
      const orderPermission = settingPermssion?.find((ele) => ele.area === 'priceList')?.write === 1;
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

  onSelectPriceName(id: number, element: UserAssignItem) {
    // console.log("vd",element)
    const data = {
      name: element.name,
      priceListNameId: id,
    };

    this.authService.edituserListPrice(data, element.id).subscribe((res) => {
      const r = res as ApiResponse<unknown>;
      if (r.error === false) {
        this.toastr.success('Success ', r.message);
        this.userListForm.reset();
        this.ngOnInit();
      } else {
        this.toastr.error('Enter valid ', r.message);
      }
    });
  }
}
