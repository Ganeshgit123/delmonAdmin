import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OneDayOrdersComponent } from './one-day-orders.component';
import { RouterModule } from '@angular/router';
import { NgMaterialModule } from '../../ng-material.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [OneDayOrdersComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: OneDayOrdersComponent,
      },
    ]),
    NgMaterialModule,
    TranslateModule,
  ],
})
export class OneDayOrdersModule {}
