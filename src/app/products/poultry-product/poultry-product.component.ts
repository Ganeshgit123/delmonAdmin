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
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-poultry-product',
  templateUrl: './poultry-product.component.html',
  styleUrls: ['./poultry-product.component.scss'],
})
export class PoultryProductComponent implements OnInit, AfterViewInit {
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
  filteredProd = [];
  recipeId: any;
  getReceipeList = [];
  checkPieceValue: any;
  checkCartonValue: any;
  prodImg: any;
  iconImg: any;
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

    if (this.showAccept == true) {
      this.displayedColumns = [
        'index',
        'categoryId',
        'enProductName',
        'arProductName',
        'soldType',
        'image',
        'rowActionIcon',
        'addSimilar',
        'addRecipe',
        'mostWantedProduct',
        'offers',
        'newProduct',
        'rowActionToggle',
      ];
    } else if (this.showAccept == false) {
      this.displayedColumns = [
        'index',
        'categoryId',
        'enProductName',
        'arProductName',
        'soldType',
        'image',
        'addSimilar',
      ];
    }

    this.authService.getProductsWithParentOnly('POULTRY').subscribe((res: any) => {
      this.getvalue = res.data;
      this.dataSource = new MatTableDataSource(this.getvalue);
      this.dataSource.paginator = this.matPaginator;
      this.dataSource.sort = this.matSort;
    });

    this.authService.getCategory('POULTRY').subscribe((res: any) => {
      this.getCategory = res.data;
    });

    this.productForm = this.fb.group({
      categoryId: ['', [Validators.required]],
      enProductName: ['', [Validators.required]],
      arProductName: ['', [Validators.required]],
      soldType: [''],
      image: [''],
      description: ['', [Validators.required]],
      arDescription: ['', [Validators.required]],
      parentId: [''],
    });
  }

  get f() {
    return this.productForm.controls;
  }

  callRolePermission() {
    if (sessionStorage.getItem('roleName') !== 'superAdmin') {
      const settingPermssion = JSON.parse(sessionStorage.getItem('permission'));
      const orderPermission = settingPermssion?.find((ele) => ele.area == 'products')?.write == 1;
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
    this.productForm.reset();
    this.imageNeed = false;
    this.isEdit = false;
    this.isRelated = false;
    this.previews = [];
    this.iconImg = '';
    this.prodImg = '';
    this.submitted = false;
    this.checkPieceValue = false;
    this.checkCartonValue = false;
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
      const reader = new FileReader();
      reader.onload = (event: any) => {
        this.prodImg = event.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
      this.fileImgUpload = file;
    }
  }

  removeProdImg() {
    this.iconImg = '';
    this.prodImg = '';
    this.fileImgUpload = '';
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
      postData.append('image', this.fileImgUpload);
      this.authService.s3upload(postData).subscribe((res: any) => {
        if (res.error == false) {
          this.iconImg = res.files;
          this.imgs3.push(this.iconImg);
          this.productForm.value.image = JSON.stringify(this.imgs3);
          this.onSubmitProductImage(this.productForm.value);
        }
      });
    } else {
      this.productForm.value.image = JSON.stringify([]);
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

  typeChange(event) {
    if (event.source.value == 'piece') {
      this.checkPieceValue = event.source.checked == true ? true : false;
    }
    if (event.source.value == 'carton') {
      this.checkCartonValue = event.source.checked == true ? true : false;
    }
  }

  onSubmitProductImage(data) {
    this.submitted = false;
    if (this.checkPieceValue == true && this.checkCartonValue == false) {
      this.productForm.value.soldType = 1;
      this.productForm.value.piecesActive = 1;
      this.productForm.value.cartonActive = 0;
    }
    if (this.checkCartonValue == true && this.checkPieceValue == false) {
      this.productForm.value.soldType = 2;
      this.productForm.value.cartonActive = 1;
      this.productForm.value.piecesActive = 0;
    }
    if (this.checkPieceValue == true && this.checkCartonValue == true) {
      this.productForm.value.soldType = 3;
      this.productForm.value.piecesActive = 1;
      this.productForm.value.cartonActive = 1;
    }
    this.productForm.value.type = 'POULTRY';
    this.productForm.value.parentId = 0;
    this.productForm.value.isBasket = 0;
    // console.log("submit", this.productForm.value)
    this.authService.addProduct(data).subscribe((res: any) => {
      if (res.error == false) {
        this.toastr.success('Success ', res.message);
        this.spinner.hide();
        this.submitted = false;
        this.productForm.reset();
        this.iconImg = '';
        this.prodImg = '';
        this.fileImgUpload = '';
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
    this.isRelated = false;
    this.productId = data['id'];
    this.uploadFiles = [];
    this.iconImg = data['image'];
    if (this.iconImg.length == 0) {
      this.iconImg = '';
      this.prodImg = '';
    }
    if (data['piecesActive'] == 1 && data['cartonActive'] == 0) {
      this.checkPieceValue = true;
      this.checkCartonValue = false;
    } else if (data['cartonActive'] == 1 && data['piecesActive'] == 0) {
      this.checkCartonValue = true;
      this.checkPieceValue = false;
    } else if (data['piecesActive'] == 1 && data['cartonActive'] == 1) {
      this.checkPieceValue = true;
      this.checkCartonValue = true;
    }

    this.productForm = this.fb.group({
      categoryId: [data['categoryId']],
      enProductName: [data['enProductName']],
      arProductName: [data['arProductName']],
      soldType: [''],
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
      postData.append('image', this.fileImgUpload);
      this.authService.s3upload(postData).subscribe((res: any) => {
        if (res.error == false) {
          this.iconImg = res.files;
          this.imgs3.push(this.iconImg);
          this.productForm.value.image = JSON.stringify(this.imgs3);
          this.editProductImage(this.productForm.value);
        }
      });
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
    if (this.checkPieceValue == true && this.checkCartonValue == false) {
      this.productForm.value.soldType = 1;
      this.productForm.value.piecesActive = 1;
      this.productForm.value.cartonActive = 0;
    }
    if (this.checkCartonValue == true && this.checkPieceValue == false) {
      this.productForm.value.soldType = 2;
      this.productForm.value.cartonActive = 1;
      this.productForm.value.piecesActive = 0;
    }
    if (this.checkPieceValue == true && this.checkCartonValue == true) {
      this.productForm.value.soldType = 3;
      this.productForm.value.piecesActive = 1;
      this.productForm.value.cartonActive = 1;
    }
    this.authService.editProduct(data, this.productId).subscribe((res: any) => {
      if (res.error == false) {
        this.toastr.success('Success ', res.message);
        this.spinner.hide();
        this.getRelatedProduct();
        this.submitted = false;
        this.iconImg = '';
        this.fileImgUpload = '';
        this.prodImg = '';
        this.modalService.dismissAll();
      } else {
        this.toastr.error('Enter valid ', res.message);
      }
    });
  }

  getRelatedProduct() {
    this.authService.getProductsDetails('POULTRY', this.productId).subscribe((res: any) => {
      const filteredData = res.data.filter((item) => item.id !== this.productId);
      const updatedData = filteredData.map((obj) => ({
        id: obj.id,
        categoryId: this.productForm.value.categoryId,
        enProductName: this.productForm.value.enProductName,
        arProductName: this.productForm.value.arProductName,
        description: this.productForm.value.description,
        arDescription: this.productForm.value.arDescription,
      }));
      // console.log("afterUpdate", updatedData)
      const object = { product: updatedData };
      this.authService.editReletedProduct(object).subscribe((res: any) => {
        if (res.error == false) {
          this.productForm.reset();
          this.ngOnInit();
        }
      });
    });
  }

  changeStatus(value) {
    const visible = value.active === 1 ? 0 : 1;
    const object = { active: visible };

    this.authService.editProduct(object, value.id).subscribe((res: any) => {
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
          this.authService.deleteProd(value).subscribe((res: any) => {
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

  recipeProduct(data, receipe) {
    this.filteredProd = [];
    this.modalService.open(receipe, { centered: true, size: 'xl' });
    this.productId = data['id'];
    const prod = data['recipiesId'] || [];
    this.authService.getReceipes().subscribe((res: any) => {
      this.getReceipeList = res.data;
      // console.log("Vv", this.getProducts)
      // console.log("ttt", prod)
      let filll = [];
      filll = this.getReceipeList.filter((object1) => prod.some((object2) => object1.id === object2)); // requires unique id

      this.filteredProd = filll;
    });
  }

  sentProdutId(id) {
    const result = this.getReceipeList.filter((obj) => {
      return obj.id == id;
    });

    // concatenate the above arrays using spread operator
    const join_arr = [...this.filteredProd, ...result];

    // remove duplicate from above array using Set() function
    this.filteredProd = [...new Set(join_arr)];
  }

  removeImg(id) {
    const findIndex = this.filteredProd.findIndex((a) => a.id === id);

    findIndex !== -1 && this.filteredProd.splice(findIndex, 1);
  }

  recipeSubmit() {
    const uniqueAddresses = Array.from(new Set(this.filteredProd.map((a) => a.id))).map((id) => {
      return this.filteredProd.find((a) => a.id === id);
    });
    let lastArray = [];
    uniqueAddresses.forEach((element) => {
      lastArray.push(element.id);
    });

    const data = {
      recipiesId: JSON.stringify(lastArray),
    };

    this.authService.editProduct(data, this.productId).subscribe((res: any) => {
      if (res.error == false) {
        this.toastr.success('Success ', res.message);
        this.productForm.reset();
        lastArray = [];
        this.filteredProd = [];
        this.modalService.dismissAll();
        this.ngOnInit();
      } else {
        this.toastr.error('Enter valid ', res.message);
      }
    });
  }

  changeMostWantedProduct(value) {
    const visible = value.mostWantedProduct === 1 ? 0 : 1;
    const object = { mostWantedProduct: visible };

    this.authService.editProduct(object, value.id).subscribe((res: any) => {
      if (res.error == false) {
        this.toastr.success('Success ', res.message);
        this.ngOnInit();
      } else {
        this.toastr.error('Enter valid ', res.message);
      }
    });
  }

  changeOffers(value) {
    const visible = value.offers === 1 ? 0 : 1;
    const object = { offers: visible };

    this.authService.editProduct(object, value.id).subscribe((res: any) => {
      if (res.error == false) {
        this.toastr.success('Success ', res.message);
        this.ngOnInit();
      } else {
        this.toastr.error('Enter valid ', res.message);
      }
    });
  }
  changeNewProduct(value) {
    const visible = value.newProduct === 1 ? 0 : 1;
    const object = { newProduct: visible };

    this.authService.editProduct(object, value.id).subscribe((res: any) => {
      if (res.error == false) {
        this.toastr.success('Success ', res.message);
        this.ngOnInit();
      } else {
        this.toastr.error('Enter valid ', res.message);
      }
    });
  }
}
