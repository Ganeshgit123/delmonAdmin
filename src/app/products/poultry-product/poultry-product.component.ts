import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/shared/auth.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService, NgxSpinnerModule } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgMaterialModule } from '../../ng-material.module';

// Note: Use service response types; avoid local ApiResponse conflicts.

interface ProductRow {
  id: number;
  categoryId: number;
  enProductName: string;
  arProductName: string;
  soldType: number;
  image: string;
  mostWantedProduct: number;
  offers: number;
  newProduct: number;
  active: number;
}

@Component({
  selector: 'app-poultry-product',
  templateUrl: './poultry-product.component.html',
  styleUrls: ['./poultry-product.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslateModule, NgMaterialModule, NgbModalModule, NgxSpinnerModule, RouterModule],
})
export class PoultryProductComponent implements OnInit, AfterViewInit {
  displayedColumns: string[];
  dataSource: MatTableDataSource<ProductRow>;
  getvalue: ProductRow[] = [];
  isEdit = false;
  productForm: FormGroup;
  submitted = false;
  fileImgUpload: File | null = null;
  getCategory: unknown[] = [];
  imgs3: string[] = [];
  uploadFiles: File[] = [];
  imageNeed = false;
  previews: string[] = [];
  productId: number;
  newUploadImg: string[] = [];
  pushedImage: string[] = [];
  isRelated = false;
  productRelId: number;
  filteredProd: { id: number }[] = [];
  recipeId: number;
  getReceipeList: { id: number }[] = [];
  checkPieceValue: boolean;
  checkCartonValue: boolean;
  prodImg: string;
  iconImg: string;
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
    if (sessionStorage.getItem('roleName') === 'superAdmin') {
      this.superAdminRole = true;
    } else {
      this.superAdminRole = false;
    }

    if (this.showAccept === true) {
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
    } else if (this.showAccept === false) {
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
      const perm = sessionStorage.getItem('permission');
      const settingPermssion: any[] | null = perm ? JSON.parse(perm) : null;
      const orderPermission = settingPermssion?.find((ele: any) => ele.area === 'products')?.write === 1;
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

  uploadImageFile(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const result = (e.target as FileReader).result as string | ArrayBuffer;
        this.prodImg = result as string;
      };
      reader.readAsDataURL(file);
      this.fileImgUpload = file;
    }
  }

  removeProdImg() {
    this.iconImg = '';
    this.prodImg = '';
    this.fileImgUpload = null;
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
        if (res.error === false) {
          this.iconImg = (res.files as string) ?? '';
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

  typeChange(event: MatCheckboxChange & { source: { value: 'piece' | 'carton'; checked: boolean } }) {
    if (event.source.value === 'piece') {
      this.checkPieceValue = event.source.checked === true ? true : false;
    }
    if (event.source.value === 'carton') {
      this.checkCartonValue = event.source.checked === true ? true : false;
    }
  }

  onSubmitProductImage(data: any) {
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
      if (res.error === false) {
        this.toastr.success('Success ', res.message);
        this.spinner.hide();
        this.submitted = false;
        this.productForm.reset();
        this.iconImg = '';
        this.prodImg = '';
        this.fileImgUpload = null;
        this.modalService.dismissAll();
        this.ngOnInit();
      } else {
        this.toastr.error('Enter valid ', res.message);
      }
    });
  }

  editProduct(data: ProductRow & { piecesActive?: number; cartonActive?: number; parentId?: number; description?: string; arDescription?: string }, content: any) {
    this.modalService.open(content, { centered: true, size: 'lg' });
    this.isEdit = true;
    this.isRelated = false;
    this.productId = data['id'];
    this.uploadFiles = [];
    this.iconImg = data['image'];
    if (this.iconImg.length === 0) {
      this.iconImg = '';
      this.prodImg = '';
    }
    if (data['piecesActive'] === 1 && data['cartonActive'] === 0) {
      this.checkPieceValue = true;
      this.checkCartonValue = false;
    } else if (data['cartonActive'] === 1 && data['piecesActive'] === 0) {
      this.checkCartonValue = true;
      this.checkPieceValue = false;
    } else if (data['piecesActive'] === 1 && data['cartonActive'] === 1) {
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
        if (res.error === false) {
          this.iconImg = (res.files as string) ?? '';
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

  editProductImage(data: any) {
    if (this.checkPieceValue === true && this.checkCartonValue === false) {
      this.productForm.value.soldType = 1;
      this.productForm.value.piecesActive = 1;
      this.productForm.value.cartonActive = 0;
    }
    if (this.checkCartonValue === true && this.checkPieceValue === false) {
      this.productForm.value.soldType = 2;
      this.productForm.value.cartonActive = 1;
      this.productForm.value.piecesActive = 0;
    }
    if (this.checkPieceValue === true && this.checkCartonValue === true) {
      this.productForm.value.soldType = 3;
      this.productForm.value.piecesActive = 1;
      this.productForm.value.cartonActive = 1;
    }
    this.authService.editProduct(data, this.productId).subscribe((res: any) => {
      if (res.error === false) {
        this.toastr.success('Success ', res.message);
        this.spinner.hide();
        this.getRelatedProduct();
        this.submitted = false;
        this.iconImg = '';
        this.fileImgUpload = null;
        this.prodImg = '';
        this.modalService.dismissAll();
      } else {
        this.toastr.error('Enter valid ', res.message);
      }
    });
  }

  getRelatedProduct() {
    this.authService.getProductsDetails('POULTRY', this.productId).subscribe((res: any) => {
      const filteredData = res.data.filter((item: any) => item.id !== this.productId);
      const updatedData = filteredData.map((obj: any) => ({
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
        if (res.error === false) {
          this.productForm.reset();
          this.ngOnInit();
        }
      });
    });
  }

  changeStatus(value: ProductRow) {
    const visible = value.active === 1 ? 0 : 1;
    const object = { active: visible };

    this.authService.editProduct(object, value.id).subscribe((res: any) => {
      if (res.error === false) {
        this.toastr.success('Success ', res.message);
        this.ngOnInit();
      } else {
        this.toastr.error('Enter valid ', res.message);
      }
    });
  }

  deleteProduct(value: ProductRow) {
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
        Swal.fire({
          title: this.translate.instant('Deleted'),
          text: this.translate.instant('YourFileHasBeenDeleted'),
          icon: 'success',
          confirmButtonText: this.translate.instant('Ok'),
        });
        this.authService.deleteProd(value.id).subscribe((res: any) => {
          if (res.error === false) {
            this.toastr.success('Success ', res.message);
            this.ngOnInit();
          } else {
            this.toastr.error('Error', res.message);
          }
        });
      }
    });
  }

  recipeProduct(data: ProductRow & { recipiesId?: number[] }, receipe: any) {
    this.filteredProd = [];
    this.modalService.open(receipe, { centered: true, size: 'xl' });
    this.productId = data['id'];
    const prod = data['recipiesId'] || [];
    this.authService.getReceipes().subscribe((res: any) => {
      this.getReceipeList = res.data;
      // console.log("Vv", this.getProducts)
      // console.log("ttt", prod)
      let filll: { id: number }[] = [];
      filll = this.getReceipeList.filter((object1: { id: number }) => prod.some((object2: number) => object1.id === object2)); // requires unique id

      this.filteredProd = filll;
    });
  }

  sentProdutId(id: number) {
    const result = this.getReceipeList.filter((obj) => {
      return obj.id === id;
    });

    // concatenate the above arrays using spread operator
    const join_arr = [...this.filteredProd, ...result];

    // remove duplicate from above array using Set() function
    this.filteredProd = [...new Set(join_arr)];
  }

  removeImg(id: number) {
    const findIndex = this.filteredProd.findIndex((a) => a.id === id);

    if (findIndex !== -1) {
      this.filteredProd.splice(findIndex, 1);
    }
  }

  recipeSubmit() {
    const uniqueAddresses = Array.from(new Set(this.filteredProd.map((a) => a.id))).map((id) => {
      return this.filteredProd.find((a) => a.id === id);
    });
    let lastArray: number[] = [];
    uniqueAddresses.forEach((element) => {
      if (element) {
        lastArray.push(element.id);
      }
    });

    const data = {
      recipiesId: JSON.stringify(lastArray),
    };

    this.authService.editProduct(data, this.productId).subscribe((res: any) => {
      if (res.error === false) {
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

  changeMostWantedProduct(value: ProductRow) {
    const visible = value.mostWantedProduct === 1 ? 0 : 1;
    const object = { mostWantedProduct: visible };

    this.authService.editProduct(object, value.id).subscribe((res: any) => {
      if (res.error === false) {
        this.toastr.success('Success ', res.message);
        this.ngOnInit();
      } else {
        this.toastr.error('Enter valid ', res.message);
      }
    });
  }

  changeOffers(value: ProductRow) {
    const visible = value.offers === 1 ? 0 : 1;
    const object = { offers: visible };

    this.authService.editProduct(object, value.id).subscribe((res: any) => {
      if (res.error === false) {
        this.toastr.success('Success ', res.message);
        this.ngOnInit();
      } else {
        this.toastr.error('Enter valid ', res.message);
      }
    });
  }
  changeNewProduct(value: ProductRow) {
    const visible = value.newProduct === 1 ? 0 : 1;
    const object = { newProduct: visible };

    this.authService.editProduct(object, value.id).subscribe((res: any) => {
      if (res.error === false) {
        this.toastr.success('Success ', res.message);
        this.ngOnInit();
      } else {
        this.toastr.error('Enter valid ', res.message);
      }
    });
  }
}
