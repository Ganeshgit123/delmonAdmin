import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { RouterModule } from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import { NgApexchartsModule } from "ng-apexcharts";


@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    NgApexchartsModule,
    RouterModule.forChild([
      {
        path:"",
        component:DashboardComponent
      }
    ]),
    TranslateModule.forChild()
  ]
})
export class DashboardModule { }
