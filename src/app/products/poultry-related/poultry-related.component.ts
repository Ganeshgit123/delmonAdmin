import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/shared/auth.service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgMaterialModule } from '../../ng-material.module';
import { NgxSpinnerModule } from 'ngx-spinner';

@Component({
  selector: 'app-poultry-related',
  templateUrl: './poultry-related.component.html',
  styleUrls: ['./poultry-related.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    NgMaterialModule,
    NgxSpinnerModule,
    NgbModalModule,
  ],
})
export class PoultryRelatedComponent implements OnInit {
  pieceForm: FormGroup;
  cartonForm: FormGroup;
  oldValue: FormGroup;
  getvalue: any;
  getCategory: any[] = [];
  prodParamsId: number | string;
  pieceRelatedArray: any[] = [];
  cartonRelatedArray: any[] = [];
  cartonActive: number;
  piecesActive: number;
  isEdit = false;
  showAccept = true;
  superAdminRole = false;

  constructor(
    private modalService: NgbModal,
    public fb: FormBuilder,
    public authService: AuthService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
  ) {
    this.pieceForm = this.fb.group({
      product: this.fb.array(this.pieceRelatedArray),
    });
    this.cartonForm = this.fb.group({
      product: this.fb.array(this.cartonRelatedArray),
    });

    // this form is for only show the main product values
    this.oldValue = this.fb.group({
      categoryId: [''],
      enProductName: [''],
      arProductName: [''],
    });
  }

  ngOnInit(): void {
    this.callRolePermission();
    if (sessionStorage.getItem('roleName') === 'superAdmin') {
      this.superAdminRole = true;
    } else {
      this.superAdminRole = false;
    }

    this.route.params.subscribe((params) => {
      this.prodParamsId = params['id'];
    });
    this.authService.getProductsDetails('POULTRY', this.prodParamsId).subscribe((res: any) => {
      this.getvalue = res.data[0];
      this.cartonActive = this.getvalue.cartonActive;
      this.piecesActive = this.getvalue.piecesActive;
      // this form builder is used only show the main product values
      this.oldValue = this.fb.group({
        categoryId: [this.getvalue['categoryId']],
        enProductName: [this.getvalue['enProductName']],
        arProductName: [this.getvalue['arProductName']],
      });

      // delete the firstobject because firstobject is a main product object
      // remove main product object
      res.data.shift();

      // filter the old related product with soldType = 1 for piece
      this.pieceRelatedArray = res.data.filter((element: any) => {
        return element.soldType === 1;
      });

      // for pass old values to new formbuilder
      const dropDownValue = this.pieceRelatedArray;
      const dropDownArray = [];

      if (dropDownValue.length > 0) {
        for (const item of dropDownValue) {
          dropDownArray.push(this.getPiecesValue(item));
        }
      }
      this.pieceForm = this.fb.group({
        product: this.fb.array(dropDownArray),
      });

      // filter the old related product with soldType = 2 for carton
      this.cartonRelatedArray = res.data.filter((element: any) => {
        return element.soldType === 2;
      });

      // for pass old values to new formbuilder
      const cartonDropdown = this.cartonRelatedArray;
      const cartonArray = [];

      if (cartonDropdown.length > 0) {
        for (const item of cartonDropdown) {
          cartonArray.push(this.getCartonsValue(item));
        }
      }
      this.cartonForm = this.fb.group({
        product: this.fb.array(cartonArray),
      });
    });

    // Used for list the category
    this.authService.getCategory('POULTRY').subscribe((res: any) => {
      this.getCategory = res.data;
    });
  }

  callRolePermission() {
    if (sessionStorage.getItem('roleName') !== 'superAdmin') {
      const perm = sessionStorage.getItem('permission');
      const settingPermssion: any[] | null = perm ? JSON.parse(perm) : null;
      const orderPermission = settingPermssion?.find((ele) => ele.area === 'products')?.write === 1;
      // console.log("fef",orderPermission)
      this.showAccept = orderPermission;
    }
  }

  getPiecesValue(obj: any): FormGroup {
    return this.fb.group({
      id: [obj.id],
      categoryId: [obj.categoryId],
      enProductName: [obj.enProductName],
      arProductName: [obj.arProductName],
      soldType: 1,
      piecesActive: [obj.piecesActive],
      cartonActive: [obj.cartonActive],
      type: [obj.type],
      weight: [obj.weight],
      isStock: [obj.isStock],
      noOfPieces: [obj.noOfPieces],
      description: [obj.description],
      arDescription: [obj.arDescription],
      image: [JSON.stringify(obj.image)],
      active: [obj.active],
      isEdit: true,
    });
  }

  addPieces() {
    const control = this.pieceForm.controls.product as FormArray;
    control.push(
      this.fb.group({
        categoryId: [this.getvalue.categoryId],
        enProductName: [this.getvalue.enProductName],
        arProductName: [this.getvalue.arProductName],
        soldType: 1,
        piecesActive: 1,
        cartonActive: 0,
        type: [this.getvalue.type],
        weight: [''],
        isStock: [this.getvalue.isStock],
        noOfPieces: [''],
        description: [this.getvalue.description],
        arDescription: [this.getvalue.arDescription],
        image: [JSON.stringify(this.getvalue.image)],
        parentId: Number(this.prodParamsId),
      }),
    );
  }

  getCartonsValue(obj: any): FormGroup {
    return this.fb.group({
      id: [obj.id],
      categoryId: [obj.categoryId],
      enProductName: [obj.enProductName],
      arProductName: [obj.arProductName],
      soldType: 2,
      type: [obj.type],
      piecesActive: [obj.piecesActive],
      cartonActive: [obj.cartonActive],
      weight: [obj.weight],
      isStock: [obj.isStock],
      description: [obj.description],
      arDescription: [obj.arDescription],
      noOfPieces: [obj.noOfPieces],
      image: [JSON.stringify(obj.image)],
      active: [obj.active],
      isEdit: true,
    });
  }

  addCartons() {
    const control = this.cartonForm.controls.product as FormArray;
    control.push(
      this.fb.group({
        categoryId: [this.getvalue.categoryId],
        enProductName: [this.getvalue.enProductName],
        arProductName: [this.getvalue.arProductName],
        soldType: 2,
        piecesActive: 0,
        cartonActive: 1,
        type: [this.getvalue.type],
        weight: [''],
        isStock: [this.getvalue.isStock],
        noOfPieces: [''],
        description: [this.getvalue.description],
        arDescription: [this.getvalue.arDescription],
        image: [JSON.stringify(this.getvalue.image)],
        parentId: Number(this.prodParamsId),
      }),
    );
  }

  onSubmitData() {
    // Compare the old product value to new product value and remove the old product value for piece flow
    this.pieceForm.value.product = this.pieceForm.value.product.filter((val: any) => {
      return !this.pieceRelatedArray.find((val2: any) => {
        return val.id === val2.id;
      });
    });

    // Compare the old product value to new product value and remove the old product value for carton flow
    this.cartonForm.value.product = this.cartonForm.value.product.filter((val: any) => {
      return !this.cartonRelatedArray.find((val2: any) => {
        return val.id === val2.id;
      });
    });

    //  merge the two piece form value and carton form value
    const arr3 = [...this.pieceForm.value.product, ...this.cartonForm.value.product];

    // send the value inside product key
    const object = { product: arr3 };

    // console.log("merge", object)
    this.authService.addReletedProduct(object).subscribe((res: any) => {
      if (res.error === false) {
        this.toastr.success('Success ', res.message);
        this.modalService.dismissAll();
        this.ngOnInit();
      } else {
        this.toastr.error('Enter valid ', res.message);
      }
    });
  }

  changePieceStatus(value: any) {
    const visible = value.piecesActive === 1 ? 0 : 1;
    const object = { piecesActive: visible };
    // console.log("fef",object,value.id)

    this.authService.editProduct(object, value.id).subscribe((res: any) => {
      if (res.error === false) {
        this.toastr.success('Success ', res.message);
        this.ngOnInit();
      } else {
        this.toastr.error('Enter valid ', res.message);
      }
    });
  }

  changeCartonStatus(value: any) {
    const visible = value.cartonActive === 1 ? 0 : 1;
    const object = { cartonActive: visible };
    // console.log("fef",object,value.id)

    this.authService.editProduct(object, value.id).subscribe((res: any) => {
      if (res.error === false) {
        this.toastr.success('Success ', res.message);
        this.ngOnInit();
      } else {
        this.toastr.error('Enter valid ', res.message);
      }
    });
  }

  updateProduct(data: any) {
    // console.log("edit,data", data)
    const editArray = [];
    editArray.push(data);

    const keyToRemove = 'isEdit';
    // Remove the specified key from all objects in the array
    const newArray = editArray.map((obj) => {
      const { [keyToRemove]: _removedKey, ...rest } = obj;
      return rest;
    });
    const object = { product: newArray };
    // console.log("fdswef", object)
    this.authService.editReletedProduct(object).subscribe((res: any) => {
      if (res.error === false) {
        this.toastr.success('Success ', res.message);
        this.modalService.dismissAll();
        this.ngOnInit();
      } else {
        this.toastr.error('Enter valid ', res.message);
      }
    });
  }

  changeProdStatus(value: any) {
    const visible = value.active === 1 ? 0 : 1;
    const object = { active: visible };
    // console.log("fef",object,value.id)

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
