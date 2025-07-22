import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CanelledOrdersComponent } from './canelled-orders.component';
import { RouterModule } from '@angular/router';
import { NgMaterialModule } from '../../ng-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    CanelledOrdersComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path:"",
        component: CanelledOrdersComponent
      }
    ]),
    NgMaterialModule,
    TranslateModule,
    FormsModule, 
    ReactiveFormsModule,
  ]
})
export class CanelledOrdersModule { }
