import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HolidayListComponent } from './holiday-list.component';
import { RouterModule } from '@angular/router';
import { NgMaterialModule } from '../../ng-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatCardModule} from '@angular/material/card';

@NgModule({
  declarations: [
    HolidayListComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path:"",
        component: HolidayListComponent
      }
    ]),
    NgMaterialModule,
    FormsModule, 
    ReactiveFormsModule,
    TranslateModule,
    MatDatepickerModule,
    MatCardModule
  ]
})
export class HolidayListModule { }
