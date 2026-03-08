import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WalletReportComponent } from './wallet-report.component';
import { RouterModule } from '@angular/router';
import { NgMaterialModule } from '../../ng-material.module';
import { TranslateModule } from '@ngx-translate/core';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [
    WalletReportComponent
  ],
  imports: [
    CommonModule,
     RouterModule.forChild([
          {
            path:"",
            component: WalletReportComponent
          }
        ]),
        NgMaterialModule,
        TranslateModule,
        NgxSpinnerModule
  ]
})
export class WalletReportModule { }
