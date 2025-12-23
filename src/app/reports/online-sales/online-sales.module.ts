import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnlineSalesComponent } from './online-sales.component';
import { RouterModule } from '@angular/router';
import { NgMaterialModule } from '../../ng-material.module';
import { TranslateModule } from '@ngx-translate/core';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [OnlineSalesComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: OnlineSalesComponent,
      },
    ]),
    NgMaterialModule,
    TranslateModule,
    NgxSpinnerModule,
  ],
})
export class OnlineSalesModule {}
