import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavouritProductsComponent } from './favourit-products.component';
import { RouterModule } from '@angular/router';
import { NgMaterialModule } from '../../ng-material.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: FavouritProductsComponent,
      },
    ]),
    NgMaterialModule,
    TranslateModule,
    FavouritProductsComponent,
  ],
})
export class FavouritProductsModule {}
