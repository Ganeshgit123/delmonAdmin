import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinWheelSlicesComponent } from './spin-wheel-slices.component';
import { RouterModule } from '@angular/router';
import { NgMaterialModule } from '../../ng-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [
    SpinWheelSlicesComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: "",
        component: SpinWheelSlicesComponent
      }
    ]),
    NgMaterialModule,
    TranslateModule,
    FormsModule, 
    ReactiveFormsModule,
    NgxSpinnerModule
  ]
})
export class SpinWheelSlicesModule { }
