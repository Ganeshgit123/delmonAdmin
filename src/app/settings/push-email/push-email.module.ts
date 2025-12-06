import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PushEmailComponent } from './push-email.component';
import { RouterModule } from '@angular/router';
import { NgMaterialModule } from '../../ng-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';


@NgModule({
  declarations: [
    PushEmailComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: "",
        component: PushEmailComponent
      }
    ]),
    NgMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    NgMultiSelectDropDownModule
  ]
})
export class PushEmailModule { }
