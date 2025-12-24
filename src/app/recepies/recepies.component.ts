import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
// Router not used; remove import
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

interface RecipeRow {
  id: number;
  name: string;
  arName: string;
  ingredients: string;
  arIngredients: string;
  steps: string;
  arSteps: string;
  categoryId: number;
  videos: string | null;
  thumbnailImage: string | null;
  active: number;
}

@Component({
  selector: 'app-recepies',
  templateUrl: './recepies.component.html',
  styleUrls: ['./recepies.component.scss'],
})
export class RecepiesComponent implements OnInit, AfterViewInit {
  displayedColumns: string[];
  dataSource: MatTableDataSource<RecipeRow>;
  getvalue: RecipeRow[] = [];
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
  iconImg: string | null = null;
  videoUpp: string | null = null;
  fileImgUpload: File | null = null;
  iconImgUrl: string | null = null;
  videoUrl: string | null = null;
  fileVideoUpload: File | null = null;
  receipeId: number | string;
  showAccept = true;
  superAdminRole = false;
  userType: string | null;

  @ViewChild(MatPaginator) matPaginator: MatPaginator;
  @ViewChild(MatSort) matSort: MatSort;

  constructor(
    private modalService: NgbModal,
    public fb: FormBuilder,
    public authService: AuthService,
    private toastr: ToastrService,
    // router not used
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

    if (this.userType == '1' || this.userType == '0') {
      this.authService.getCategory('POULTRY').subscribe((res: any) => {
        this.getCategory = res.data;
      });
    } else if (this.userType == '2' || this.userType == '0') {
      this.authService.getCategory('FEEDING').subscribe((res: any) => {
        this.getCategory = res.data;
      });
    }

    this.authService.getReceipes().subscribe((res: any) => {
      this.getvalue = res.data.filter((category: RecipeRow) => this.getCategory.some((item: any) => item.id === category.categoryId));
      this.dataSource = new MatTableDataSource<RecipeRow>(this.getvalue);
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
      const perm = sessionStorage.getItem('permission');
      const settingPermssion: any[] | null = perm ? JSON.parse(perm) : null;
      const orderPermission = settingPermssion?.find((ele: any) => ele.area == 'recipes')?.write == 1;
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
    this.modalService.open(content, { centered: true, size: 'xl' });
    this.receipeForm.reset();
    this.isEdit = false;
    this.submitted = false;
    this.fileVideoUpload = null;
    this.fileImgUpload = null;
  }

  checkFileFormat(checkFile: File) {
    if (checkFile.type === 'video/mp4') {
      return false;
    } else {
      return true;
    }
  }

  uploadVideoFile(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files && input.files[0];
    const valid = input.files ? this.checkFileFormat(input.files[0]) : true;
    if (!valid) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.videoUpp = (e.target as FileReader).result as string;
        // console.log("fef", this.videoUpp)
      };
      if (file) reader.readAsDataURL(file);
      this.fileVideoUpload = file;
    } else {
      this.toastr.error('Error ', 'Upload only mp4 Video format');
    }
  }

  removeVideo() {
    this.videoUpp = null;
    this.fileVideoUpload = null;
  }

  checkImageFormat(checkFile: File) {
    if (
      checkFile.type === 'image/webp' ||
      checkFile.type === 'image/png' ||
      checkFile.type === 'image/jpeg' ||
      checkFile.type === 'image/jpg'
    ) {
      return false;
    } else {
      return true;
    }
  }

  uploadImageFile(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files && input.files[0];
    const valid = input.files ? this.checkImageFormat(input.files[0]) : true;
    if (!valid) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.iconImg = (e.target as FileReader).result as string;
      };
      if (file) reader.readAsDataURL(file);
      this.fileImgUpload = file;
    } else {
      this.toastr.error('Error ', 'Upload only jpg,jpeg,png,webp Image formats');
    }
  }
  removeImg() {
    this.iconImg = null;
    this.fileImgUpload = null;
  }

  onSubmitData() {
    this.submitted = true;
    if (!this.receipeForm.valid) {
      return;
    }

    if (this.isEdit) {
      this.receipeEditService();
      return;
    }

    this.spinner.show();
    if (this.fileVideoUpload) {
      const postData = new FormData();
      postData.append('image', this.fileVideoUpload as File);
      this.authService.s3upload(postData).subscribe((res: any) => {
        if (res.error == false) {
          this.videoUrl = res.files;
          this.receipeForm.value.videos = this.videoUrl;

          if (this.fileImgUpload) {
            const postData = new FormData();
            postData.append('image', this.fileImgUpload as File);
            this.authService.s3upload(postData).subscribe((res: any) => {
              if (res.error == false) {
                this.iconImgUrl = res.files;
                this.receipeForm.value.thumbnailImage = this.iconImgUrl;
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
          } else {
            this.receipeForm.value.thumbnailImage = null;
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
        }
      });
    }
  }

  editReceipe(data: RecipeRow, content: any) {
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

  receipeEditService() {
    if (this.fileImgUpload && this.fileVideoUpload) {
      const postData = new FormData();
      postData.append('image', this.fileVideoUpload);
      this.authService.s3upload(postData).subscribe((res: any) => {
        if (res.error == false) {
          this.videoUrl = res.files;
          this.receipeForm.value.videos = this.videoUrl;

          const postData = new FormData();
          postData.append('image', this.fileImgUpload as File);
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
          const dataVal = this.receipeForm.value as any;
          dataVal['thumbnailImage'] = this.iconImgUrl;
          dataVal['videos'] = this.videoUpp;
          this.authService.editReceipes(dataVal, this.receipeId).subscribe((res: any) => {
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
          const dataVal = this.receipeForm.value as any;
          dataVal['videos'] = this.videoUrl;
          dataVal['thumbnailImage'] = this.iconImg;
          this.authService.editReceipes(dataVal, this.receipeId).subscribe((res: any) => {
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
      const dataVal = this.receipeForm.value as any;
      dataVal['videos'] = this.videoUpp;
      dataVal['thumbnailImage'] = this.iconImg;
      this.authService.editReceipes(dataVal, this.receipeId).subscribe((res: any) => {
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

  changeStatus(value: RecipeRow) {
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

  deleteReceipe(value: RecipeRow) {
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
          this.authService.deleteReceipes(value.id).subscribe((res: any) => {
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
