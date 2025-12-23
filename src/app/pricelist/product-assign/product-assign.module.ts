import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgMaterialModule } from '../../ng-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { ProductAssignComponent } from '../product-assign/product-assign.component';

@NgModule({
  declarations: [ProductAssignComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: ProductAssignComponent,
      },
    ]),
    NgMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    TranslateModule,
  ],
})
export class ProductAssignModule {}
