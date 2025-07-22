import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/shared/auth.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {
  displayedColumns: string[];
  dataSource: MatTableDataSource<any>;
  getvalue = [];
  roleForm: FormGroup;
  isEdit = false;
  roleId: any;
  submitted = false;
  perm = [];
  permRoleId; any;
  updatedPerm = [];
  showAccept = true;
  superAdminRole = false;

  permissionArray = [{ "id": 1, "area": "dashboard", "read": 1, "write": 1 }, 
    { "id": 2, "area": "orders", "read": 1, "write": 1 }, 
    { "id": 3, "area": "category", "read": 1, "write": 1 }, 
    { "id": 4, "area": "users", "read": 1, "write": 1 }, 
    { "id": 5, "area": "products", "read": 1, "write": 1 }, 
    { "id": 6, "area": "priceList", "read": 1, "write": 1 }, 
    { "id": 7, "area": "recipes", "read": 1, "write": 1 }, 
    { "id": 8, "area": "zones", "read": 1, "write": 1 }, 
    { "id": 9, "area": "master", "read": 1, "write": 1 }, 
    { "id": 10, "area": "drivers", "read": 1, "write": 1 }, 
    { "id": 11, "area": "coupons", "read": 1, "write": 1 }, 
    { "id": 12, "area": "feedbacks", "read": 1, "write": 1 }, 
    { "id": 13, "area": "adminUsers", "read": 1, "write": 1 }, 
    { "id": 14, "area": "one-day-orders", "read": 1, "write": 1 }, 
    { "id": 15, "area": "total-orders", "read": 1, "write": 1 }, 
    { "id": 16, "area": "financial-reports", "read": 1, "write": 1 }, 
    { "id": 17, "area": "salesman-reports", "read": 1, "write": 1 }, 
    { "id": 18, "area": "internal-sales-reports", "read": 1, "write": 1 }, 
    { "id": 19, "area": "online-sales-reports", "read": 1, "write": 1 }, 
    { "id": 20, "area": "employee-purchase-reports", "read": 1, "write": 1 }
  ];

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

    if (this.showAccept == true) {
      this.displayedColumns = ['index', 'roleName', 'permission', 'rowActionIcon'];
    } else if (this.showAccept == false) {
      this.displayedColumns = ['index', 'roleName'];
    }

    this.authService.getRoles().subscribe(
      (res: any) => {
        res.data = res.data.filter(obj => obj.id !== 1)
        this.getvalue = res.data.reverse();
        this.dataSource = new MatTableDataSource(this.getvalue);
        this.dataSource.paginator = this.matPaginator;
        this.dataSource.sort = this.matSort;
      }
    );

    this.roleForm = this.fb.group({
      roleName: ['', [Validators.required]],
    });

  }
  get f() { return this.roleForm.controls; }

  callRolePermission() {
    if (sessionStorage.getItem('roleName') !== 'superAdmin') {
      let settingPermssion = JSON.parse(sessionStorage.getItem('permission'))
      const orderPermission = settingPermssion?.find(ele => ele.area == 'adminUsers')?.write == 1
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
    this.roleForm.reset();
    this.isEdit = false;
    this.modalService.open(content, { centered: true, size: 'md' });
  }

  editRole(data, content) {
    this.modalService.open(content, { centered: true });
    this.isEdit = true;
    this.roleId = data['id'];

    this.roleForm = this.fb.group({
      roleName: [data['roleName']],
    });
  }

  onSubmitData() {
    this.submitted = true;
    if (!this.roleForm.valid) {
      return false;
    }

    if (this.isEdit) {
      this.roleEditService(this.roleForm.value)
      return;
    }

    this.submitted = false;
    this.roleForm.value.permission = JSON.stringify(this.permissionArray);
    this.authService.addRole(this.roleForm.value)
      .subscribe((res: any) => {
        if (res.error == true) {
          this.toastr.success('Success ', res.massage);
          this.roleForm.reset();
          this.modalService.dismissAll();
          this.ngOnInit();
        } else {
          this.toastr.warning('Enter valid ', res.massage);
        }
      });
  }

  roleEditService(data) {
    this.authService.editRole(data, this.roleId)
      .subscribe((res: any) => {
        if (res.error == true) {
          this.toastr.success('Success ', res.massage);
          this.roleForm.reset();
          this.modalService.dismissAll();
          this.ngOnInit();
        } else {
          this.toastr.warning('Enter valid ', res.massage);
        }
      });
  }

  viewPerm(data, value) {
    this.modalService.open(value, { centered: true, size: 'lg' });
    this.permRoleId = data['id'];
    this.perm = data['permission'];
  }

  deleteRole(value) {
    Swal.fire({
      title: this.translate.instant("AreYouSure"),
      text: this.translate.instant("YouWontBeRevertThis"),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: this.translate.instant("YesDeleteIt"),
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          this.translate.instant("Deleted"),
          this.translate.instant("YourFileHasBeenDeleted"),
          this.translate.instant("success"),
        ),
          this.authService.deleteRole(value).subscribe((res: any) => {
            if (res.success == true) {
              this.toastr.success('Success ', res.message);
              this.ngOnInit()
            } else {
              this.toastr.error('Error', res.message);
            }
          });
      }
    })
  }

  changeReadStatus(event) {
    // console.log("vall",event)
    let newValue;
    if (event.read == 1) {
      newValue = 0;
    } else {
      newValue = 1;
    }
    let idToUpdate = event.id;

    this.updatedPerm = this.perm.map(obj =>
      obj.id === idToUpdate ? { ...obj, read: newValue } : obj);

    const obj = {
      permission: JSON.stringify(this.updatedPerm)
    }
    // console.log("rer",obj)

    this.authService.editRole(obj, this.permRoleId)
      .subscribe((res: any) => {
        if (res.error == true) {
          this.toastr.success('Success ', res.massage);
          this.modalService.dismissAll();
          this.ngOnInit();
        } else {
          this.toastr.warning('Enter valid ', res.massage);
        }
      });
  }

  changeWriteStatus(event) {
    let newValue;
    if (event.write == 1) {
      newValue = 0;
    } else {
      newValue = 1;
    }
    let idToUpdate = event.id;

    this.updatedPerm = this.perm.map(obj =>
      obj.id === idToUpdate ? { ...obj, write: newValue } : obj);

    const obj = {
      permission: JSON.stringify(this.updatedPerm)
    }
    // console.log("rer",obj)

    this.authService.editRole(obj, this.permRoleId)
      .subscribe((res: any) => {
        if (res.error == true) {
          this.toastr.success('Success ', res.massage);
          this.modalService.dismissAll();
          this.ngOnInit();
        } else {
          this.toastr.warning('Enter valid ', res.massage);
        }
      });
  }
}
