import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PickupOrdersComponent } from './pickup-orders.component';
import { RouterModule } from '@angular/router';
import { NgMaterialModule } from '../../ng-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: PickupOrdersComponent,
      },
    ]),
    PickupOrdersComponent,
    NgMaterialModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class PickupOrdersModule {}
