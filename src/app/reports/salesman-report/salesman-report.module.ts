import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalesmanReportComponent } from './salesman-report.component';
import { RouterModule } from '@angular/router';
import { NgMaterialModule } from '../../ng-material.module';
import { TranslateModule } from '@ngx-translate/core';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [
    SalesmanReportComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path:"",
        component: SalesmanReportComponent
      }
    ]),
    NgMaterialModule,
    TranslateModule,
    NgxSpinnerModule
  ]
})
export class SalesmanReportModule { }
