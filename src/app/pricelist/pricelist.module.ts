import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PricelistComponent } from './pricelist.component';
import { RouterModule } from '@angular/router';
import { NgMaterialModule } from '../ng-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    PricelistComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path:"",
        component: PricelistComponent
      }
    ]),
    NgMaterialModule,
    FormsModule, 
    ReactiveFormsModule,
    NgxSpinnerModule,
    TranslateModule,
  ]
})
export class PricelistModule { }
