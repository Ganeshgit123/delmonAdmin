import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/shared/auth.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService, NgxSpinnerModule } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { ApiResponse } from 'src/app/shared/models/api-response';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgMaterialModule } from '../../ng-material.module';
import { MatSelectModule } from '@angular/material/select';

interface Basket {
  id: number;
  enProductName: string;
  arProductName: string;
  image: string[] | string;
  soldType: number;
  categoryId: number;
  type: string;
  price: number | null;
  description: string;
  arDescription: string;
  active: number;
  basketProductList: number[];
}

interface Product {
  id: number;
  enProductName: string;
}


@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslateModule, NgMaterialModule, NgbModalModule, NgxSpinnerModule, MatSelectModule],
})
export class BasketComponent implements OnInit, AfterViewInit {
  displayedColumns: string[];
  dataSource: MatTableDataSource<Basket>;
  getvalue: Basket[] = [];
  submitted = false;
  fileImgUpload: File | '' = '';
  getCategory: unknown[] = [];
  imgs3: string[] = [];
  uploadFiles: File[] = [];
  imageNeed = false;
  previews: string[] = [];
  productId: number | null = null;
  newUploadImg: string[] = [];
  pushedImage: string[] = [];
  isBasketEdit = false;
  basketForm: FormGroup;
  baskedId: number | null = null;
  getProducts: Product[] = [];
  filteredProd: Product[] = [];
  basketProdForm: FormGroup;
  selectedProvince: Product[] = [];
  showAccept = true;
  superAdminRole = false;
  prodImg = '';
  iconImg: string | string[] = '';

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

    this.authService.getBaskets('POULTRY').subscribe((res) => {
      this.getvalue = (res as ApiResponse<Basket[]>).data;
      this.dataSource = new MatTableDataSource(this.getvalue);
      this.dataSource.paginator = this.matPaginator;
      this.dataSource.sort = this.matSort;
    });

    this.basketForm = this.fb.group({
      enProductName: ['', [Validators.required]],
      arProductName: ['', [Validators.required]],
      image: [''],
      soldType: [''],
      categoryId: [''],
      description: [''],
      arDescription: [''],
      type: [''],
      price: [''],
    });

    this.basketProdForm = this.fb.group({
      basketProductList: [''],
    });

    if (this.showAccept === true) {
      this.displayedColumns = ['index', 'name', 'image', 'addProducts', 'rowActionToggle', 'rowActionIcon'];
    } else if (this.showAccept === false) {
      this.displayedColumns = ['index', 'name', 'image'];
    }
  }

  get f() {
    return this.basketForm.controls;
  }

  callRolePermission() {
    if (sessionStorage.getItem('roleName') !== 'superAdmin') {
      const permRaw = sessionStorage.getItem('permission');
      const settingPermssion = permRaw ? (JSON.parse(permRaw) as { area: string; write: number }[]) : null;
      const orderPermission = settingPermssion?.find((ele) => ele.area === 'products')?.write === 1;
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
  addBasket(basket: unknown) {
    this.basketForm.reset();
    this.imageNeed = false;
    this.isBasketEdit = false;
    this.previews = [];
    this.iconImg = '';
    this.prodImg = '';
    this.submitted = false;
    this.modalService.open(basket, { centered: true, size: 'md' });
  }

  changeProductImages(event: Event) {
    this.imageNeed = false;
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const numberOfFiles = input.files.length;
      if (numberOfFiles <= 1) {
        for (let i = 0; i < numberOfFiles; i++) {
          const reader = new FileReader();
          reader.onload = (e: ProgressEvent<FileReader>) => {
            const result = (e.target as FileReader).result as string;
            this.previews.push(result);
            // console.log("fehh",this.previews)
            this.pushedImage.push(result);
          };
          reader.readAsDataURL(input.files[i]);
          this.uploadFiles.push(input.files[i]);
        }
      } else {
        this.toastr.error('Error', 'Max 1 images is allowed');
      }
    }
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
        this.prodImg = (e.target as FileReader).result as string;
      };
      reader.readAsDataURL(input.files[0]);
      this.fileImgUpload = file;
    }
  }

  removeProdImg() {
    this.iconImg = '';
    this.prodImg = '';
    this.fileImgUpload = '';
  }

  onBasketSave() {
    this.submitted = true;
    if (this.basketForm.invalid) {
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
      this.authService.s3upload(postData).subscribe((res) => {
        const r: any = res;
        if (r.error === false) {
          this.iconImg = r.files as string;
          this.imgs3.push(this.iconImg);
          this.basketForm.value.image = JSON.stringify(this.imgs3);
          this.onSubmitBasketImage(this.basketForm.value);
        }
      });
    } else {
      this.basketForm.value.image = JSON.stringify([]);
      this.onSubmitBasketImage(this.basketForm.value);
    }

    // if (this.uploadFiles.length > 0) {
    //   var imgLength = this.uploadFiles.length;

    //   for (let i = 0; i < this.uploadFiles.length; i++) {
    //     var postData = new FormData();
    //     postData.append('image', this.uploadFiles[i]);
    //     this.authService.s3upload(postData).subscribe((res: any) => {
    //       if (res.error == false) {
    //         var uploadedImg = res.files;
    //         // console.log("uploadimg", uploadedImg)
    //         this.imgs3.push(uploadedImg);
    //         // this.previews.push(uploadedImg);

    //         if (0 === --imgLength) {
    //           this.basketForm.value.image = JSON.stringify(this.imgs3.reverse());
    //           this.onSubmitBasketImage(this.basketForm.value);
    //         }
    //       }
    //     })
    //   }
    // } else {
    //   this.basketForm.value.image = JSON.stringify(this.previews);
    //   this.onSubmitBasketImage(this.basketForm.value);
    // }
  }

  onSubmitBasketImage(data: unknown) {
    this.submitted = false;
    this.basketForm.value.type = 'POULTRY';
    this.basketForm.value.price = null;
    this.basketForm.value.isBasket = 1;
    this.basketForm.value.soldType = 3;
    this.basketForm.value.categoryId = 0;
    this.basketForm.value.description = 'null';
    this.basketForm.value.arDescription = 'null';
    // console.log("submit", this.productForm.value)
    this.authService.addNewBasket(data).subscribe((res) => {
      const r = res as ApiResponse<unknown>;
      if (r.error === false) {
        this.toastr.success('Success ', r.message);
        this.spinner.hide();
        this.submitted = false;
        this.basketForm.reset();
        this.filteredProd = [];
        this.iconImg = '';
        this.prodImg = '';
        this.fileImgUpload = '';
        this.modalService.dismissAll();
        this.ngOnInit();
      } else {
        this.toastr.error('Enter valid ', r.message);
      }
    });
  }

  editBasket(data: Basket, content: unknown) {
    this.modalService.open(content, { centered: true, size: 'lg' });
    this.isBasketEdit = true;
    this.baskedId = data.id;
    this.uploadFiles = [];
    this.iconImg = data.image;
    if (Array.isArray(this.iconImg) && this.iconImg.length === 0) {
      this.iconImg = '';
      this.prodImg = '';
    }
    this.basketForm = this.fb.group({
      enProductName: [data.enProductName],
      arProductName: [data.arProductName],
      soldType: [data.soldType],
      categoryId: [data.categoryId],
      type: [data.type],
      price: [data.price],
      description: [data.description],
      arDescription: [data.arDescription],
      image: '',
    });
  }

  basketEditService() {
    if (this.fileImgUpload) {
      this.imgs3 = [];
      this.spinner.show();
      const postData = new FormData();
      postData.append('image', this.fileImgUpload);
      this.authService.s3upload(postData).subscribe((res) => {
        const r: any = res;
        if (r.error === false) {
          this.iconImg = r.files as string;
          this.imgs3.push(this.iconImg);
          this.basketForm.value.image = JSON.stringify(this.imgs3);
          this.editBasketImage(this.basketForm.value);
        }
      });
    } else {
      this.basketForm.value.image = JSON.stringify(this.iconImg);
      this.editBasketImage(this.basketForm.value);
    }
    // this.spinner.show();
    // if (this.uploadFiles.length > 0) {
    //   var imgLength = this.uploadFiles.length;

    //   for (let i = 0; i < this.uploadFiles.length; i++) {
    //     var postData = new FormData();
    //     postData.append('image', this.uploadFiles[i]);
    //     this.authService.s3upload(postData).subscribe((res: any) => {
    //       if (res.error == false) {
    //         var uploadedImg = res.files;
    //         // console.log("uploadimg", uploadedImg)
    //         this.newUploadImg.push(uploadedImg);

    //         this.previews = this.previews.filter(val => !this.pushedImage.includes(val));

    //         if (0 === --imgLength) {
    //           var merge = this.previews.concat(this.newUploadImg)
    //           this.basketForm.value.image = JSON.stringify(merge);
    //           this.editBasketImage(this.basketForm.value);
    //         }
    //       }
    //     })
    //   }
    // } else {
    //   this.basketForm.value.image = JSON.stringify(this.previews);
    //   this.editBasketImage(this.basketForm.value);
    // }
  }

  editBasketImage(data: unknown) {
    this.authService.editBakset(data, this.baskedId as number).subscribe((res) => {
      const r = res as ApiResponse<unknown>;
      if (r.error === false) {
        this.toastr.success('Success ', r.message);
        this.spinner.hide();
        this.submitted = false;
        this.basketForm.reset();
        this.iconImg = '';
        this.fileImgUpload = '';
        this.prodImg = '';
        this.modalService.dismissAll();
        this.ngOnInit();
      } else {
        this.toastr.error('Enter valid ', r.message);
      }
    });
  }

  changeStatus(value: Basket) {
    const visible = value.active === 1 ? 0 : 1;
    const object = { active: visible };

    this.authService.editProduct(object, value.id).subscribe((res) => {
      const r = res as ApiResponse<unknown>;
      if (r.error === false) {
        this.toastr.success('Success ', r.message);
        this.ngOnInit();
      } else {
        this.toastr.error('Enter valid ', r.message);
      }
    });
  }

  deleteProduct(value: Basket) {
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
        this.authService.deleteProd(value.id).subscribe((res) => {
          const r = res as ApiResponse<unknown>;
          if (r.error === false) {
            this.toastr.success('Success ', r.message);
            this.ngOnInit();
          } else {
            this.toastr.error('Error', r.message);
          }
        });
      }
    });
  }

  addProductsEle(data: Basket, content: unknown) {
    // console.log("df",data)
    this.filteredProd = [];
    this.modalService.open(content, { centered: true, size: 'xl' });
    this.baskedId = data.id;
    const prod = data.basketProductList;
    this.authService.getProductsWithoutParentId1('POULTRY').subscribe((res) => {
      this.getProducts = (res as ApiResponse<Product[]>).data;
      this.selectedProvince = this.getProducts;
      // console.log("ttt", prod)
      let filll = [];
      filll = this.getProducts.filter((object1) => prod.some((object2) => object1.id === object2)); // requires unique id

      this.filteredProd = filll;
    });
  }

  sentProdutId(id: number) {
    const result = this.getProducts.filter((obj) => {
      return obj.id === id;
    });

    this.filteredProd.push(result[0]);
    // console.log("fwe", this.filteredProd)
  }

  onProvinceKey(event: Event) {
    const input = event.target as HTMLInputElement;
    this.selectedProvince = this.provinceSearch(input.value);
  }

  provinceSearch(value: string) {
    const filter = value.toLowerCase();
    return this.getProducts.filter((option) => option.enProductName.toLowerCase().startsWith(filter));
  }

  removeImg(id: number) {
    const findIndex = this.filteredProd.findIndex((a) => a.id === id);

    if (findIndex !== -1) {
      this.filteredProd.splice(findIndex, 1);
    }
  }

  basketProductSubmit() {
    const uniqueAddresses = Array.from(new Set(this.filteredProd.map((a) => a.id))).map((id) => {
      return this.filteredProd.find((a) => a.id === id);
    });
    let lastArray: number[] = [];
    uniqueAddresses.forEach((element) => {
      if (element) {
        lastArray.push(element.id);
      }
    });

    this.basketProdForm.value.basketProductList = JSON.stringify(lastArray);

    this.authService.editBakset(this.basketProdForm.value, (this.baskedId as number)).subscribe((res) => {
      const r = res as ApiResponse<unknown>;
      if (r.error === false) {
        this.toastr.success('Success ', r.message);
        this.basketProdForm.reset();
        lastArray = [];
        this.filteredProd = [];
        this.iconImg = '';
        this.fileImgUpload = '';
        this.prodImg = '';
        this.modalService.dismissAll();
        this.ngOnInit();
      } else {
        this.toastr.error('Enter valid ', r.message);
      }
    });
  }
}
