import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InternalSalesComponent } from './internal-sales.component';
import { RouterModule } from '@angular/router';
import { NgMaterialModule } from '../../ng-material.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    InternalSalesComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path:"",
        component: InternalSalesComponent
      }
    ]),
    NgMaterialModule,
    TranslateModule,
  ]
})
export class InternalSalesModule { }
