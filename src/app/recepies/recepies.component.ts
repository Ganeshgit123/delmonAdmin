import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/shared/auth.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-recepies',
  templateUrl: './recepies.component.html',
  styleUrls: ['./recepies.component.scss'],
})
export class RecepiesComponent implements OnInit, AfterViewInit {
  displayedColumns: string[];
  dataSource: MatTableDataSource<any>;
  getvalue = [];
  isEdit = false;
  receipeForm: FormGroup;
  submitted = false;
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '200px',
    minHeight: '0',
    maxHeight: '200px',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    sanitize: false,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'poppins', name: 'Poppins' },
      { class: 'DroidKufi', name: 'DroidKufi' },
    ],
    // uploadUrl: 'v1/image',
    // upload: (file: File) => { ... }
    // uploadWithCredentials: false,
    // sanitize: true,
    // toolbarPosition: 'top',
    toolbarHiddenButtons: [['italic', 'insertImage', 'insertVideo', 'subscript', 'superscript']],
  };
  getCategory = [];
  iconImg = null;
  videoUpp = null;
  fileImgUpload: any;
  iconImgUrl: any;
  videoUrl: any;
  fileVideoUpload: any;
  receipeId: any;
  showAccept = true;
  superAdminRole = false;
  userType: any;

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

    this.userType = sessionStorage.getItem('userType');

    if (this.showAccept == true) {
      this.displayedColumns = ['index', 'name', 'videos', 'thumbnailImage', 'rowActionToggle', 'rowActionIcon'];
    } else if (this.showAccept == false) {
      this.displayedColumns = ['index', 'name', 'videos', 'thumbnailImage'];
    }

    if (this.userType == 1 || this.userType == 0) {
      this.authService.getCategory('POULTRY').subscribe((res: any) => {
        this.getCategory = res.data;
      });
    } else if (this.userType == 2 || this.userType == 0) {
      this.authService.getCategory('FEEDING').subscribe((res: any) => {
        this.getCategory = res.data;
      });
    }

    this.authService.getReceipes().subscribe((res: any) => {
      this.getvalue = res.data.filter((category) => this.getCategory.some((item) => item.id === category.categoryId));
      this.dataSource = new MatTableDataSource(this.getvalue);
      this.dataSource.paginator = this.matPaginator;
      this.dataSource.sort = this.matSort;
    });

    this.receipeForm = this.fb.group({
      name: ['', [Validators.required]],
      arName: ['', [Validators.required]],
      ingredients: ['', [Validators.required]],
      arIngredients: ['', [Validators.required]],
      steps: ['', [Validators.required]],
      arSteps: ['', [Validators.required]],
      categoryId: ['', [Validators.required]],
      videos: [''],
      thumbnailImage: [''],
    });
  }

  get f() {
    return this.receipeForm.controls;
  }

  callRolePermission() {
    if (sessionStorage.getItem('roleName') !== 'superAdmin') {
      const settingPermssion = JSON.parse(sessionStorage.getItem('permission'));
      const orderPermission = settingPermssion?.find((ele) => ele.area == 'recipes')?.write == 1;
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
    this.modalService.open(content, { centered: true, size: 'xl' });
    this.receipeForm.reset();
    this.isEdit = false;
    this.submitted = false;
    this.fileVideoUpload = null;
    this.fileImgUpload = null;
  }

  checkFileFormat(checkFile) {
    if (checkFile.type == 'video/mp4') {
      return false;
    } else {
      return true;
    }
  }

  uploadVideoFile(event) {
    const file = event.target.files && event.target.files[0];
    const valid = this.checkFileFormat(event.target.files[0]);
    if (!valid) {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        this.videoUpp = event.target.result;
        // console.log("fef", this.videoUpp)
      };
      reader.readAsDataURL(event.target.files[0]);
      this.fileVideoUpload = file;
    } else {
      this.toastr.error('Error ', 'Upload only mp4 Video format');
    }
  }

  removeVideo() {
    this.videoUpp = '';
    this.fileVideoUpload = '';
  }

  checkImageFormat(checkFile) {
    if (
      checkFile.type == 'image/webp' ||
      checkFile.type == 'image/png' ||
      checkFile.type == 'image/jpeg' ||
      checkFile.type == 'image/jpg'
    ) {
      return false;
    } else {
      return true;
    }
  }

  uploadImageFile(event) {
    const file = event.target.files && event.target.files[0];
    const valid = this.checkImageFormat(event.target.files[0]);
    if (!valid) {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        this.iconImg = event.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
      this.fileImgUpload = file;
    } else {
      this.toastr.error('Error ', 'Upload only jpg,jpeg,png,webp Image formats');
    }
  }
  removeImg() {
    this.iconImg = '';
    this.fileImgUpload = '';
  }

  onSubmitData() {
    this.submitted = true;
    if (!this.receipeForm.valid) {
      return false;
    }

    if (this.isEdit) {
      this.receipeEditService(this.receipeForm.value);
      return;
    }

    this.spinner.show();
    if (this.fileVideoUpload) {
      const postData = new FormData();
      postData.append('image', this.fileVideoUpload);
      this.authService.s3upload(postData).subscribe((res: any) => {
        if (res.error == false) {
          this.videoUrl = res.files;
          this.receipeForm.value.videos = this.videoUrl;

          const postData = new FormData();
          postData.append('image', this.fileImgUpload);
          this.authService.s3upload(postData).subscribe((res: any) => {
            if (res.error == false) {
              this.iconImgUrl = res.files;
              this.receipeForm.value.thumbnailImage = this.iconImgUrl;

              // console.log("fef", this.receipeForm.value)
              this.authService.addReceipes(this.receipeForm.value).subscribe((res: any) => {
                if (res.error == false) {
                  this.toastr.success('Success ', res.message);
                  this.spinner.hide();
                  this.iconImg = null;
                  this.receipeForm.reset();
                  this.modalService.dismissAll();
                  this.ngOnInit();
                } else {
                  this.toastr.error('Enter valid ', res.message);
                }
              });
            }
          });
        }
      });
    }
  }

  editReceipe(data, content) {
    this.modalService.open(content, { centered: true, size: 'xl' });
    this.isEdit = true;
    this.fileImgUpload = null;
    this.fileVideoUpload = null;
    this.receipeId = data['id'];
    this.videoUpp = data['videos'];
    this.iconImg = data['thumbnailImage'];

    this.receipeForm = this.fb.group({
      name: [data['name']],
      arName: [data['arName']],
      ingredients: [data['ingredients']],
      arIngredients: [data['arIngredients']],
      steps: [data['steps']],
      arSteps: [data['arSteps']],
      categoryId: [data['categoryId']],
      videos: [''],
      thumbnailImage: [''],
    });
  }

  receipeEditService(data) {
    if (this.fileImgUpload && this.fileVideoUpload) {
      const postData = new FormData();
      postData.append('image', this.fileVideoUpload);
      this.authService.s3upload(postData).subscribe((res: any) => {
        if (res.error == false) {
          this.videoUrl = res.files;
          this.receipeForm.value.videos = this.videoUrl;

          const postData = new FormData();
          postData.append('image', this.fileImgUpload);
          this.authService.s3upload(postData).subscribe((res: any) => {
            if (res.error == false) {
              this.iconImgUrl = res.files;
              this.receipeForm.value.thumbnailImage = this.iconImgUrl;

              // console.log("fef", this.receipeForm.value)
              this.authService.editReceipes(this.receipeForm.value, this.receipeId).subscribe((res: any) => {
                if (res.error == false) {
                  this.toastr.success('Success ', res.message);
                  this.spinner.hide();
                  this.iconImg = null;
                  this.receipeForm.reset();
                  this.modalService.dismissAll();
                  this.ngOnInit();
                } else {
                  this.toastr.error('Enter valid ', res.message);
                }
              });
            }
          });
        }
      });
    } else if (this.fileImgUpload) {
      this.spinner.show();
      const postData = new FormData();
      postData.append('image', this.fileImgUpload);
      this.authService.s3upload(postData).subscribe((res: any) => {
        if (res.error == false) {
          this.iconImgUrl = res.files;
          const data = this.receipeForm.value;
          data['thumbnailImage'] = this.iconImgUrl;
          data['videos'] = this.videoUpp;
          // console.log("1stImageUpload", data)
          this.authService.editReceipes(data, this.receipeId).subscribe((res: any) => {
            if (res.error == false) {
              this.toastr.success('Success ', res.message);
              this.iconImgUrl = null;
              this.videoUpp = null;
              this.receipeForm.reset();
              this.modalService.dismissAll();
              this.ngOnInit();
              this.spinner.hide();
            } else {
              this.toastr.error('Enter valid ', res.message);
            }
          });
        }
      });
    } else if (this.fileVideoUpload) {
      this.spinner.show();
      const postData = new FormData();
      postData.append('image', this.fileVideoUpload);
      this.authService.s3upload(postData).subscribe((res: any) => {
        if (res.error == false) {
          this.videoUrl = res.files;
          const data = this.receipeForm.value;
          data['videos'] = this.videoUrl;
          data['thumbnailImage'] = this.iconImg;
          // console.log("1stImageUpload", data)
          this.authService.editReceipes(data, this.receipeId).subscribe((res: any) => {
            if (res.error == false) {
              this.toastr.success('Success ', res.message);
              this.iconImg = null;
              this.videoUrl = null;
              this.receipeForm.reset();
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
      const data = this.receipeForm.value;
      data['videos'] = this.videoUpp;
      data['thumbnailImage'] = this.iconImg;
      // console.log("1stImageUpload", data)
      this.authService.editReceipes(data, this.receipeId).subscribe((res: any) => {
        if (res.error == false) {
          this.toastr.success('Success ', res.message);
          this.iconImg = null;
          this.videoUpp = null;
          this.receipeForm.reset();
          this.modalService.dismissAll();
          this.ngOnInit();
          this.spinner.hide();
        } else {
          this.toastr.error('Enter valid ', res.message);
        }
      });
    }
  }

  changeStatus(value) {
    const visible = value.active === 1 ? 0 : 1;
    const object = { active: visible };

    this.authService.editReceipes(object, value.id).subscribe((res: any) => {
      if (res.error == false) {
        this.toastr.success('Success ', res.message);
        this.ngOnInit();
      } else {
        this.toastr.error('Enter valid ', res.message);
      }
    });
  }

  deleteReceipe(value) {
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
          this.authService.deleteReceipes(value).subscribe((res: any) => {
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
}
