import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeebacksComponent } from './feebacks.component';
import { RouterModule } from '@angular/router';
import { NgMaterialModule } from '../ng-material.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: FeebacksComponent,
      },
    ]),
    FeebacksComponent,
    NgMaterialModule,
    TranslateModule,
  ],
})
export class FeebacksModule {}
