import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MostWantedProductsComponent } from './most-wanted-products.component';
import { RouterModule } from '@angular/router';
import { NgMaterialModule } from '../../ng-material.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [MostWantedProductsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: MostWantedProductsComponent,
      },
    ]),
    NgMaterialModule,
    TranslateModule,
  ],
})
export class MostWantedProductsModule {}
