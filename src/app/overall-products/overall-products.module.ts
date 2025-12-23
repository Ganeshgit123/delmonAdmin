import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverallProductsComponent } from './overall-products.component';
import { RouterModule } from '@angular/router';
import { NgMaterialModule } from '../ng-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [OverallProductsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: OverallProductsComponent,
      },
    ]),
    NgMaterialModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
  ],
})
export class OverallProductsModule {}
