import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompletedOrdersComponent } from './completed-orders.component';
import { RouterModule } from '@angular/router';
import { NgMaterialModule } from '../../ng-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    CompletedOrdersComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path:"",
        component: CompletedOrdersComponent
      }
    ]),
    NgMaterialModule,
    TranslateModule,
    FormsModule, 
    ReactiveFormsModule,
  ]
})
export class CompletedOrdersModule { }
