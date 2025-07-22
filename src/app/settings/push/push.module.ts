import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PushComponent } from './push.component';
import { RouterModule } from '@angular/router';
import { NgMaterialModule } from '../../ng-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
  declarations: [
    PushComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path:"",
        component: PushComponent
      }
    ]),
    NgMaterialModule,
    FormsModule, 
    ReactiveFormsModule,
    TranslateModule,
    NgMultiSelectDropDownModule
  ]
})
export class PushModule { }
