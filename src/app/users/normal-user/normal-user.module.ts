import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NormalUserComponent } from './normal-user.component';
import { RouterModule } from '@angular/router';
import { NgMaterialModule } from '../../ng-material.module';
import { TranslateModule } from '@ngx-translate/core';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    NormalUserComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path:"",
        component: NormalUserComponent
      }
    ]),
    NgMaterialModule,
    TranslateModule,
    FormsModule, 
    ReactiveFormsModule,
    NgxSpinnerModule,
  ]
})
export class NormalUserModule { }
