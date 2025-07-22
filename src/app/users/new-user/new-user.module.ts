import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewUserComponent } from './new-user.component';
import { RouterModule } from '@angular/router';
import { NgMaterialModule } from '../../ng-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    NewUserComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path:"",
        component: NewUserComponent
      }
    ]),
    NgMaterialModule,
    TranslateModule,
    FormsModule, 
    ReactiveFormsModule,
    NgxSpinnerModule,
  ]
})
export class NewUserModule { }
