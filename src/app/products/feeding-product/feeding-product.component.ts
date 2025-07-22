import { Component, OnInit, ViewChild } from '@angular/core';
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
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-feeding-product',
  templateUrl: './feeding-product.component.html',
  styleUrls: ['./feeding-product.component.scss']
})
export class FeedingProductComponent implements OnInit {
  displayedColumns: string[];
  dataSource: MatTableDataSource<any>;
  getvalue = [];
  isEdit = false;
  productForm: FormGroup;
  submitted = false;
  fileImgUpload: any;
  getCategory = [];
  imgs3 = [];
  uploadFiles = [];
  imageNeed = false;
  previews = [];
  productId: any;
  newUploadImg = [];
  pushedImage = [];
  isRelated = false;
  productRelId: any;
  getSubCategory: any;
  subCategLength: any;
  subCate = false;
  subSubCate = false;
  subSubCategLength: any;
  getSubSubCategory: any;
  subSubSubCate = false;
  getSubSubSubCategory: any;
  subSubSubCategLength: any;
  categId: any;
  getCategoryUSer = [];
  prodImg: any;
  iconImg: any;
  showAccept = true;
  superAdminRole = false;

  @ViewChild(MatPaginator) matPaginator: MatPaginator;
  @ViewChild(MatSort) matSort: MatSort;

  constructor(private modalService: NgbModal, public fb: FormBuilder, public authService: AuthService,
    private toastr: ToastrService, private router: Router, private spinner: NgxSpinnerService,
    private translate: TranslateService,) { }

  ngOnInit(): void {
    this.callRolePermission();
    if (sessionStorage.getItem('roleName') == 'superAdmin') {
      this.superAdminRole = true;
    } else {
      this.superAdminRole = false;
    }

    if (this.showAccept == true) {
      this.displayedColumns = ['index', 'categoryId', 'enProductName', 'arProductName', 'image', 'rowActionIcon',
        'addSimilar', 'mostWantedProduct', 'offers', 'newProduct', 'rowActionToggle'];
    } else if (this.showAccept == false) {
      this.displayedColumns = ['index', 'categoryId', 'enProductName', 'arProductName', 'image',
        'addSimilar'];
    }

    this.authService.getProductsWithParentIdFeed('FEEDING').subscribe(
      (res: any) => {
        this.getvalue = res.data;
        this.dataSource = new MatTableDataSource(this.getvalue);
        this.dataSource.paginator = this.matPaginator;
        this.dataSource.sort = this.matSort;
      }
    );

    this.authService.getCategoryUser('FEEDING').subscribe(
      (res: any) => {
        this.getCategoryUSer = res.data.filter(item => item.id !== 0);
        // console.log("fe",this.getCategoryUSer)
      }
    );

    this.authService.getCategory('FEEDING').subscribe(
      (res: any) => {
        this.getCategory = res.data;
      }
    );

    this.productForm = this.fb.group({
      categoryId: [''],
      enProductName: ['', [Validators.required]],
      arProductName: ['', [Validators.required]],
      soldType: 1,
      image: [''],
      description: ['', [Validators.required]],
      arDescription: ['', [Validators.required]],
      parentId: [''],
    });
  }

  get f() { return this.productForm.controls; }

  callRolePermission() {
    if (sessionStorage.getItem('roleName') !== 'superAdmin') {
      let settingPermssion = JSON.parse(sessionStorage.getItem('permission'))
      const orderPermission = settingPermssion?.find(ele => ele.area == 'products')?.write == 1
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

  selectCategory(event) {
    this.authService.getSubCategory(event).subscribe(
      (res: any) => {
        this.subCate = true;
        this.getSubCategory = res.data;
        this.subCategLength = this.getSubCategory.length;
        if (this.subCategLength == 0) {
          this.categId = event;
        } else {
          this.categId = null;
        }
        // console.log("ff",this.categId)
      }
    );
  }

  selectSubCategory(event) {
    this.authService.getSubCategory(event).subscribe(
      (res: any) => {
        this.subSubCate = true;
        this.getSubSubCategory = res.data;
        this.subSubCategLength = this.getSubSubCategory.length;
        if (this.subSubCategLength == 0) {
          this.categId = event;
        } else {
          this.categId = null;
        }
        // console.log("ssss",this.categId)
      }
    );
  }

  selectSubSubCategory(event) {
    this.authService.getSubCategory(event).subscribe(
      (res: any) => {
        this.subSubSubCate = true;
        this.getSubSubSubCategory = res.data;
        this.subSubSubCategLength = this.getSubSubSubCategory.length;
        if (this.subSubSubCategLength == 0) {
          this.categId = event;
        } else {
          this.categId = null;
        }
        // console.log("bbbb",this.categId)
      }
    );
  }

  selectLastCategory(event) {
    this.categId = event;
    // console.log("lllll",this.categId)
  }

  openModal(content) {
    this.productForm.reset();
    this.imageNeed = false;
    this.isEdit = false;
    this.submitted = false;
    this.previews = [];
    this.iconImg = '';
    this.prodImg = '';
    this.modalService.open(content, { centered: true, size: 'lg' });
  }

  // changeProductImages(event: any) {
  //   this.imageNeed = false;
  //   if (event.target.files && event.target.files[0]) {
  //     const numberOfFiles = event.target.files.length;
  //     if (numberOfFiles <= 1) {
  //       for (let i = 0; i < numberOfFiles; i++) {
  //         const reader = new FileReader();
  //         reader.onload = (e: any) => {
  //           this.previews.push(e.target.result);
  //           // console.log("fehh",this.previews)
  //           this.pushedImage.push(e.target.result);
  //         };
  //         reader.readAsDataURL(event.target.files[i]);
  //         this.uploadFiles.push(event.target.files[i]);
  //       }
  //     } else {
  //       this.toastr.error('Error', 'Max 1 images is allowed');
  //     }
  //   }
  // }

  // removeImage(i: any) {
  //   this.previews.splice(i, 1);
  //   this.uploadFiles.splice(i, 1);
  //   this.pushedImage.splice(i, 1);
  // }

  uploadImageFile(event) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files && event.target.files[0];
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.prodImg = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);
      this.fileImgUpload = file;
    }
  }

  removeImg() {
    this.iconImg = "";
    this.prodImg = "";
    this.fileImgUpload = "";
  }

  onSubmitData() {
    this.submitted = true;
    if (this.productForm.invalid) {
      return;
    }
    // if (this.previews == null || this.previews.length == 0) {
    //   this.imageNeed = true;
    //   return;
    // }
    if (this.fileImgUpload) {
      this.spinner.show();
      const postData = new FormData();
      postData.append('image', this.fileImgUpload)
      this.authService.s3upload(postData).subscribe((res: any) => {
        if (res.error == false) {
          this.iconImg = res.files;
          this.imgs3.push(this.iconImg);
          this.productForm.value.image = JSON.stringify(this.imgs3);
          this.onSubmitProductImage(this.productForm.value);
        }
      })
    } else {
      this.productForm.value.image = JSON.stringify([]);;
      this.onSubmitProductImage(this.productForm.value);
    }

    // if (this.uploadFiles.length > 0) {
    //   var imgLength = this.uploadFiles.length;

    //   for (let i = 0; i < this.uploadFiles.length; i++) {
    //     var postData = new FormData();
    //     postData.append('image', this.uploadFiles[i]);
    //     this.authService.s3upload(postData).subscribe((res: any) => {
    //       if (res.error == false) {
    //         var uploadedImg = res.files[0].url;
    //         // console.log("uploadimg", uploadedImg)
    //         this.imgs3.push(uploadedImg);
    //         // this.previews.push(uploadedImg);

    //         if (0 === --imgLength) {
    //           this.productForm.value.image = JSON.stringify(this.imgs3.reverse());
    //           this.onSubmitProductImage(this.productForm.value);
    //         }
    //       }
    //     })
    //   }
    // } else {
    //   this.productForm.value.image = JSON.stringify(this.previews);
    //   this.onSubmitProductImage(this.productForm.value);
    // }
  }

  onSubmitProductImage(data) {
    this.submitted = false;
    this.productForm.value.type = "FEEDING";
    this.productForm.value.categoryId = this.categId;
    this.productForm.value.parentId = 0;
    this.productForm.value.soldType = 1;
    this.productForm.value.piecesActive = 1;
    this.productForm.value.cartonActive = 0;
    this.productForm.value.isBasket = 0;
    // console.log("submit", this.productForm.value)
    this.authService.addProduct(data)
      .subscribe((res: any) => {
        if (res.error == false) {
          this.toastr.success('Success ', res.message);
          this.spinner.hide();
          this.submitted = false;
          this.iconImg = "";
          this.prodImg = "";
          this.fileImgUpload = "";
          this.productForm.reset();
          this.modalService.dismissAll();
          this.ngOnInit();
        } else {
          this.toastr.error('Enter valid ', res.message);
        }
      });
  }

  editProduct(data, content) {
    this.modalService.open(content, { centered: true, size: 'lg' });
    this.isEdit = true;
    this.productId = data['id'];
    this.iconImg = data['image'];
    if (this.iconImg.length == 0) {
      this.iconImg = '';
      this.prodImg = '';
    }
    this.productForm = this.fb.group({
      categoryId: [data['categoryId']],
      enProductName: [data['enProductName']],
      arProductName: [data['arProductName']],
      soldType: [data['soldType']],
      description: [data['description']],
      arDescription: [data['arDescription']],
      parentId: [data['parentId']],
      image: '',
    });
  }

  productEditService() {
    if (this.fileImgUpload) {
      this.imgs3 = [];
      this.spinner.show();
      const postData = new FormData();
      postData.append('image', this.fileImgUpload)
      this.authService.s3upload(postData).subscribe((res: any) => {
        if (res.error == false) {
          this.iconImg = res.files;
          this.imgs3.push(this.iconImg);
          this.productForm.value.image = JSON.stringify(this.imgs3);
          this.editProductImage(this.productForm.value);
        }
      })
    } else {
      this.productForm.value.image = JSON.stringify(this.iconImg);
      this.editProductImage(this.productForm.value);
    }
    // if (this.uploadFiles.length > 0) {
    //   var imgLength = this.uploadFiles.length;

    //   for (let i = 0; i < this.uploadFiles.length; i++) {
    //     var postData = new FormData();
    //     postData.append('image', this.uploadFiles[i]);
    //     this.authService.s3upload(postData).subscribe((res: any) => {
    //       if (res.error == false) {
    //         var uploadedImg = res.files[0].url;
    //         // console.log("uploadimg", uploadedImg)
    //         this.newUploadImg.push(uploadedImg);

    //         this.previews = this.previews.filter(val => !this.pushedImage.includes(val));

    //         if (0 === --imgLength) {
    //           var merge = this.previews.concat(this.newUploadImg)
    //           this.productForm.value.image = JSON.stringify(merge);
    //           this.editProductImage(this.productForm.value);
    //         }
    //       }
    //     })
    //   }
    // } else {
    //   this.productForm.value.image = JSON.stringify(this.previews);
    //   this.editProductImage(this.productForm.value);
    // }
  }

  editProductImage(data) {
    this.authService.editProduct(data, this.productId)
      .subscribe((res: any) => {
        if (res.error == false) {
          this.toastr.success('Success ', res.message);
          this.spinner.hide();
          this.getRelatedProduct();
          this.submitted = false;
          this.iconImg = "";
          this.prodImg = "";
          this.fileImgUpload = "";
          this.modalService.dismissAll();
        } else {
          this.toastr.error('Enter valid ', res.message);
        }
      });
  }

  getRelatedProduct() {
    this.authService.getProductsDetails('FEEDING', this.productId).subscribe(
      (res: any) => {
        const filteredData = res.data.filter(item => item.id !== this.productId);
        const updatedData = filteredData.map(obj => ({
          id: obj.id,
          categoryId: this.productForm.value.categoryId,
          enProductName: this.productForm.value.enProductName,
          arProductName: this.productForm.value.arProductName,
          description: this.productForm.value.description,
          arDescription: this.productForm.value.arDescription,
        }));
        // console.log("afterUpdate", updatedData)
        const object = { product: updatedData }
        this.authService.editReletedProduct(object)
          .subscribe((res: any) => {
            if (res.error == false) {
              this.productForm.reset();
              this.ngOnInit();
            }
          });
      })
  }

  changeStatus(value) {
    if (value.active === 1) {
      var visible = 0
    } else {
      var visible = 1
    }
    const object = { active: visible }

    this.authService.editProduct(object, value.id)
      .subscribe((res: any) => {
        if (res.error == false) {
          this.toastr.success('Success ', res.message);
          this.ngOnInit();
        } else {
          this.toastr.error('Enter valid ', res.message);
        }
      });
  }

  deleteProduct(value) {
    Swal.fire({
      title: this.translate.instant("AreYouSure"),
      text: this.translate.instant("YouWontBeRevertThis"),
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: this.translate.instant("Cancel"),
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: this.translate.instant("YesDeleteIt")
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: this.translate.instant("Deleted"),
          text: this.translate.instant("YourFileHasBeenDeleted"),
          icon: 'success',
          confirmButtonText: this.translate.instant("Ok")
        }),
          this.authService.deleteProd(value).subscribe((res: any) => {
            if (res.error == false) {
              this.toastr.success('Success ', res.message);
              this.ngOnInit()
            } else {
              this.toastr.error('Error', res.message);
            }
          });
      }
    })
  }


  changeMostWantedProduct(value) {
    if (value.mostWantedProduct === 1) {
      var visible = 0
    } else {
      var visible = 1
    }
    const object = { mostWantedProduct: visible }

    this.authService.editProduct(object, value.id)
      .subscribe((res: any) => {
        if (res.error == false) {
          this.toastr.success('Success ', res.message);
          this.ngOnInit();
        } else {
          this.toastr.error('Enter valid ', res.message);
        }
      });
  }

  changeOffers(value) {
    if (value.offers === 1) {
      var visible = 0
    } else {
      var visible = 1
    }
    const object = { offers: visible }

    this.authService.editProduct(object, value.id)
      .subscribe((res: any) => {
        if (res.error == false) {
          this.toastr.success('Success ', res.message);
          this.ngOnInit();
        } else {
          this.toastr.error('Enter valid ', res.message);
        }
      });
  }
  changeNewProduct(value) {
    if (value.newProduct === 1) {
      var visible = 0
    } else {
      var visible = 1
    }
    const object = { newProduct: visible }

    this.authService.editProduct(object, value.id)
      .subscribe((res: any) => {
        if (res.error == false) {
          this.toastr.success('Success ', res.message);
          this.ngOnInit();
        } else {
          this.toastr.error('Enter valid ', res.message);
        }
      });
  }

}
