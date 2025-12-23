import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AcceptedOrdersComponent } from './accepted-orders.component';
import { RouterModule } from '@angular/router';
import { NgMaterialModule } from '../../ng-material.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [AcceptedOrdersComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: AcceptedOrdersComponent,
      },
    ]),
    NgMaterialModule,
    TranslateModule,
  ],
})
export class AcceptedOrdersModule {}
