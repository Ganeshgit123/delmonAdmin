import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinWheelWinnerComponent } from './spin-wheel-winner.component';
import { RouterModule } from '@angular/router';
import { NgMaterialModule } from '../../ng-material.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    SpinWheelWinnerComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: "",
        component: SpinWheelWinnerComponent
      }
    ]),
    NgMaterialModule,
    TranslateModule
  ]
})
export class SpinWheelWinnerModule { }
