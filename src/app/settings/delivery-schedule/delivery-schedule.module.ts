import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeliveryScheduleComponent } from './delivery-schedule.component';
import { RouterModule } from '@angular/router';
import { NgMaterialModule } from '../../ng-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    DeliveryScheduleComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: "",
        component: DeliveryScheduleComponent
      }
    ]),
    NgMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
  ]
})
export class DeliveryScheduleModule { }
