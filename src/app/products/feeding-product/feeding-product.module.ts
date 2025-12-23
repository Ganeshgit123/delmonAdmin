import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeedingProductComponent } from './feeding-product.component';
import { RouterModule } from '@angular/router';
import { NgMaterialModule } from '../../ng-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [FeedingProductComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: FeedingProductComponent,
      },
    ]),
    NgMaterialModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
  ],
})
export class FeedingProductModule {}
