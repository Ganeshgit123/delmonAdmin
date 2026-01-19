import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, Validators,FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModal,NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/shared/auth.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslateService,TranslateModule } from '@ngx-translate/core';
import { NgMaterialModule } from '../../ng-material.module';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-poulty',
  templateUrl: './poulty.component.html',
  styleUrls: ['./poulty.component.scss'],
   standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslateModule, NgMaterialModule, NgbModalModule],
})
export class PoultyComponent implements OnInit, AfterViewInit {
  displayedColumns: string[];
  dataSource: MatTableDataSource<CategoryRow>;
  getvalue: CategoryRow[] = [];
  isEdit = false;
  categoryForm: FormGroup;
  catImg: string | null = null;
  submitted = false;
  categoryId: any;
  iconImg: string | null = null;
  fileImgUpload: File | null = null;
  iconImgUrl: string | null = null;
  color: string | null = null;
  showAccept = true;
  superAdminRole = false;

  @ViewChild(MatPaginator) matPaginator: MatPaginator;
  @ViewChild(MatSort) matSort: MatSort;

  constructor(
    private modalService: NgbModal,
    public fb: FormBuilder,
    public authService: AuthService,
    private toastr: ToastrService,
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

    localStorage.setItem('flow', 'POULTRY');

    if (this.showAccept == true) {
      this.displayedColumns = [
        'index',
        'enName',
        'arName',
        'image',
        'colorCode',
        'vat',
        'rowActionToggle',
        'actionUser',
        'actionEmployee',
        'rowActionIcon',
      ];
    } else if (this.showAccept == false) {
      this.displayedColumns = ['index', 'enName', 'arName', 'image', 'colorCode', 'vat'];
    }

    this.authService.getCategory('POULTRY').subscribe((res: any) => {
      this.getvalue = res.data as CategoryRow[];
      this.dataSource = new MatTableDataSource(this.getvalue);
      this.dataSource.paginator = this.matPaginator;
      this.dataSource.sort = this.matSort;
    });

    this.categoryForm = this.fb.group({
      enName: ['', [Validators.required]],
      arName: ['', [Validators.required]],
      image: ['', [Validators.required]],
      colorCode: ['', [Validators.required]],
      vat: ['', [Validators.required]],
      type: [''],
      parentId: [''],
      userType: [''],
      employeeType: [''],
    });
  }

  get f() {
    return this.categoryForm.controls;
  }

  callRolePermission() {
    if (sessionStorage.getItem('roleName') !== 'superAdmin') {
      const permStr = sessionStorage.getItem('permission');
      const settingPermssion: Array<{ area: string; read: number; write: number }> | null = permStr ? JSON.parse(permStr) : null;
      const orderPermission = settingPermssion?.find((ele: { area: string; read: number; write: number }) => ele.area === 'category')?.write === 1;
      // console.log("fef",orderPermission)
      this.showAccept = !!orderPermission;
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
    this.submitted = false;
    this.categoryForm.reset();
    this.isEdit = false;
    this.iconImg = '';
    this.catImg = null;
    this.modalService.open(content, { centered: true });
  }

  checkFileFormat(checkFile: File) {
    if (
      checkFile.type == 'image/webp' ||
      checkFile.type == 'image/png' ||
      checkFile.type == 'image/jpeg' ||
      checkFile.type == 'image/TIF' ||
      checkFile.type == 'image/tif' ||
      checkFile.type == 'image/tiff'
    ) {
      return false;
    } else {
      return true;
    }
  }

  removeImg() {
    this.iconImg = '';
    this.fileImgUpload = null;
  }

  uploadImageFile(event: any) {
    const input = event.target as HTMLInputElement;
    const file = input.files && input.files[0];
    if (!file) {
      return;
    }
    const valid = this.checkFileFormat(file);
    if (!valid) {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        this.iconImg = event.target.result;
      };
      reader.readAsDataURL(file);
      this.fileImgUpload = file;
    }
  }

  colorClicked(colorvalue: string) {
    const cvalue: string = colorvalue;
    this.color = cvalue;
    this.categoryForm.patchValue({ colorCode: cvalue });
  }

  editCategory(data: CategoryRow, content: any) {
    this.modalService.open(content, { centered: true });
    this.isEdit = true;
    this.fileImgUpload = null;
    this.categoryId = data.id;
    this.iconImg = data.image;

    this.categoryForm = this.fb.group({
      type: [data.type],
      enName: [data.enName],
      arName: [data.arName],
      image: [''],
      colorCode: [data.colorCode],
      parentId: [data.parentId],
      vat: [data.vat],
      userType: [data.userType],
      employeeType: [data.employeeType],
    });
  }

  onSubmitData() {
    this.submitted = true;
    if (!this.categoryForm.valid) {
      return false;
    }

    if (this.isEdit) {
      this.categoryEditService(this.categoryForm.value);
      return;
    }

    this.spinner.show();
    const postData = new FormData();
    if (this.fileImgUpload) {
      postData.append('image', this.fileImgUpload);
    }
    this.authService.s3upload(postData).subscribe((res: any) => {
      if (res.error == false) {
        this.iconImgUrl = res.files;
        const data = this.categoryForm.value;
        if (this.iconImgUrl) {
          data['image'] = this.iconImgUrl;
        } else {
          data['image'] = '';
        }
        data['type'] = 'POULTRY';
        data['parentId'] = 0;
        data['userType'] = 1;
        data['employeeType'] = 1;
        // console.log("add", data)
        this.authService.addPoultryCategory(data).subscribe((res: any) => {
          if (res.error == false) {
            this.toastr.success('Success ', res.message);
            this.spinner.hide();
            this.iconImg = null;
            this.categoryForm.reset();
            this.modalService.dismissAll();
            this.ngOnInit();
          } else {
            this.toastr.error('Enter valid ', res.message);
          }
        });
      }
    });
  }

  categoryEditService(data: any) {
    if (this.fileImgUpload) {
      this.spinner.show();
      const postData = new FormData();
      postData.append('image', this.fileImgUpload);
      this.authService.s3upload(postData).subscribe((res: any) => {
        if (res.error == false) {
          this.iconImgUrl = res.files;
          const data = this.categoryForm.value;
          if (this.iconImgUrl) {
            data['image'] = this.iconImgUrl;
          } else {
            data['image'] = '';
          }
          // console.log("1stImageUpload", data)
          this.authService.editCategory(data, this.categoryId).subscribe((res: any) => {
            if (res.error == false) {
              this.toastr.success('Success ', res.message);
              this.iconImg = null;
              this.categoryForm.reset();
              this.modalService.dismissAll();
              this.ngOnInit();
              this.spinner.hide();
            } else {
              this.toastr.error('Enter valid ', res.message);
            }
          });
        }
      });
    } else {
      const data = this.categoryForm.value;
      data['image'] = this.iconImg ?? '';
      // console.log("withoutupload", data)
      this.authService.editCategory(data, this.categoryId).subscribe((res: any) => {
        if (res.error == false) {
          this.toastr.success(res.message);
          this.iconImg = null;
          this.categoryForm.reset();
          this.modalService.dismissAll();
          this.ngOnInit();
          this.spinner.hide();
        } else {
          this.toastr.error(res.message);
        }
      });
    }
  }

  changeStatus(value: CategoryRow) {
    const visible = value.active === 1 ? 0 : 1;
    const object = { active: visible };

    this.authService.editCategory(object, value.id).subscribe((res: any) => {
      if (res.error == false) {
        this.toastr.success('Success ', res.message);
        this.ngOnInit();
      } else {
        this.toastr.error('Enter valid ', res.message);
      }
    });
  }

  deleteCategory(value: CategoryRow) {
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
          this.authService.deleteCategory(value.id).subscribe((res: any) => {
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

  changeUserStatus(value: CategoryRow) {
    const stat: number = value.userType === 1 ? 0 : 1;
    const object = { userType: stat };

    this.authService.editCategory(object, value.id).subscribe((res: any) => {
      if (res.error == false) {
        this.toastr.success('Success ', res.message);
        this.ngOnInit();
      } else {
        this.toastr.error('Enter valid ', res.message);
      }
    });
  }

  changeEmployeeStatus(value: CategoryRow) {
    const stat: number = value.employeeType === 1 ? 0 : 1;
    const object = { employeeType: stat };

    this.authService.editCategory(object, value.id).subscribe((res: any) => {
      if (res.error == false) {
        this.toastr.success('Success ', res.message);
        this.ngOnInit();
      } else {
        this.toastr.error('Enter valid ', res.message);
      }
    });
  }
}

interface CategoryRow {
  id: number;
  enName: string;
  arName: string;
  image: string;
  colorCode: string;
  vat: number | string;
  type: string;
  parentId: number | string;
  userType: number;
  employeeType: number;
  active: number;
}
