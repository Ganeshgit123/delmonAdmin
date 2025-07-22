import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TotalOrdersComponent } from './total-orders.component';
import { RouterModule } from '@angular/router';
import { NgMaterialModule } from '../../ng-material.module';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    TotalOrdersComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path:"",
        component: TotalOrdersComponent
      }
    ]),
    NgMaterialModule,
    TranslateModule,
  ]
})
export class TotalOrdersModule { }
