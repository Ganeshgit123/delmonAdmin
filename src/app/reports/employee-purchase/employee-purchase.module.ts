import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeePurchaseComponent } from './employee-purchase.component';
import { RouterModule } from '@angular/router';
import { NgMaterialModule } from '../../ng-material.module';
import { TranslateModule } from '@ngx-translate/core';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [
    EmployeePurchaseComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path:"",
        component: EmployeePurchaseComponent
      }
    ]),
    NgMaterialModule,
    TranslateModule,
    NgxSpinnerModule
  ]
})
export class EmployeePurchaseModule { }
