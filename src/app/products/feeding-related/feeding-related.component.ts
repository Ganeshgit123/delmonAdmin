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
  selector: 'app-feeding-related',
  templateUrl: './feeding-related.component.html',
  styleUrls: ['./feeding-related.component.scss'],
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
export class FeedingRelatedComponent implements OnInit {
  pieceForm: FormGroup;
  oldValue: FormGroup;
  getvalue: any;
  getCategory = [];
  prodParamsId: any;
  pieceRelatedArray = [];
  cartonActive: any;
  piecesActive: any;
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

    // this form is for only show the main product values
    this.oldValue = this.fb.group({
      categoryId: [''],
      enProductName: [''],
      arProductName: [''],
    });
  }

  ngOnInit(): void {
    this.callRolePermission();
    if (sessionStorage.getItem('roleName') == 'superAdmin') {
      this.superAdminRole = true;
    } else {
      this.superAdminRole = false;
    }

    this.route.params.subscribe((params) => {
      this.prodParamsId = params['id'];
    });
    this.authService.getProductsDetails('FEEDING', this.prodParamsId).subscribe((res: any) => {
      this.getvalue = res.data[0];
      this.cartonActive = this.getvalue.cartonActive;
      this.piecesActive = this.getvalue.piecesActive;
      // this form builder is used only show the main product values
      this.oldValue = this.fb.group({
        categoryId: [this.getvalue['categoryId']],
        enProductName: [this.getvalue['enProductName']],
        arProductName: [this.getvalue['arProductName']],
      });

      // delete the first object because first object is a main product object
      res.data.shift();

      // filter the old related product with soldType = 1 for piece
      this.pieceRelatedArray = res.data.filter((element: any) => {
        return element.soldType == 1;
      });

      // for pass old values to new formbuilder
      const dropDownValue = this.pieceRelatedArray;
      const dropDownArray = [];

      if (dropDownValue.length > 0) {
        for (let i = 0; i < dropDownValue.length; i++) {
          dropDownArray.push(this.getPiecesValue(dropDownValue[i]));
        }
      }
      this.pieceForm = this.fb.group({
        product: this.fb.array(dropDownArray),
      });
    });

    // Used for list the category
    this.authService.getCategory('FEEDING').subscribe((res: any) => {
      this.getCategory = res.data;
    });
  }

  callRolePermission() {
    if (sessionStorage.getItem('roleName') !== 'superAdmin') {
      const perm = sessionStorage.getItem('permission');
      const settingPermssion: any[] | null = perm ? JSON.parse(perm) : null;
      const orderPermission = settingPermssion?.find((ele: any) => ele.area == 'products')?.write == 1;
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
      image: [JSON.stringify(obj.image)],
      soldType: 1,
      type: [obj.type],
      weight: [obj.weight],
      isStock: [obj.isStock],
      noOfPieces: [obj.noOfPieces],
      description: [obj.description],
      arDescription: [obj.arDescription],
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
        image: [JSON.stringify(this.getvalue.image)],
        soldType: 1,
        type: [this.getvalue.type],
        weight: [''],
        isStock: [this.getvalue.isStock],
        noOfPieces: [''],
        description: [this.getvalue.description],
        arDescription: [this.getvalue.arDescription],
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

    //  merge the two piece form value and carton form value
    const arr3 = [...this.pieceForm.value.product];

    // send the value inside product key
    const object = { product: arr3 };

    // console.log("merge", object)
    this.authService.addReletedProduct(object).subscribe((res: any) => {
      if (res.error == false) {
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
      if (res.error == false) {
        this.toastr.success('Success ', res.message);
        this.ngOnInit();
      } else {
        this.toastr.error('Enter valid ', res.message);
      }
    });
  }

  updateProduct(data: any) {
    const editArray = [];
    editArray.push(data);
    const keyToRemove = 'isEdit';
    // Remove the specified key from all objects in the array
    const newArray = editArray.map((obj: any) => {
      const { [keyToRemove]: removedKey, ...rest } = obj;
      return rest;
    });
    const object = { product: newArray };
    // console.log("fdswef", object)
    this.authService.editReletedProduct(object).subscribe((res: any) => {
      if (res.error == false) {
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
      if (res.error == false) {
        this.toastr.success('Success ', res.message);
        this.ngOnInit();
      } else {
        this.toastr.error('Enter valid ', res.message);
      }
    });
  }
}
