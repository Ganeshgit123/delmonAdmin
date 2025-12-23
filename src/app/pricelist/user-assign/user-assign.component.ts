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
  selector: 'app-user-assign',
  templateUrl: './user-assign.component.html',
  styleUrls: ['./user-assign.component.scss'],
})
export class UserAssignComponent implements OnInit, AfterViewInit {
  displayedColumns: string[];
  dataSource: MatTableDataSource<any>;
  getvalue = [];
  userListForm: FormGroup;
  userListId: any;
  submitted = false;
  getPriceName = [];
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

    if (this.showAccept == true) {
      this.displayedColumns = ['index', 'name', 'priceListNames', 'rowActionIcon'];
    } else if (this.showAccept == false) {
      this.displayedColumns = ['index', 'name', 'priceListNames'];
    }

    this.authService.getuserListPrice().subscribe((res: any) => {
      this.getvalue = res.data;
      this.dataSource = new MatTableDataSource(this.getvalue);
      this.dataSource.paginator = this.matPaginator;
      this.dataSource.sort = this.matSort;
    });

    this.authService.getPriceListName().subscribe((res: any) => {
      this.getPriceName = res.data;
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

  onSelectPriceName(id, element) {
    // console.log("vd",element)
    const data = {
      name: element.name,
      priceListNameId: id,
    };

    this.authService.edituserListPrice(data, element.id).subscribe((res: any) => {
      if (res.error == false) {
        this.toastr.success('Success ', res.message);
        this.userListForm.reset();
        this.ngOnInit();
      } else {
        this.toastr.error('Enter valid ', res.message);
      }
    });
  }
}
