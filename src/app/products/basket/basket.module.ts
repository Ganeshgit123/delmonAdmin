import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasketComponent } from './basket.component';
import { RouterModule } from '@angular/router';
import { NgMaterialModule } from '../../ng-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [BasketComponent],
  imports: [
    CommonModule,
    MatSelectModule,
    RouterModule.forChild([
      {
        path: '',
        component: BasketComponent,
      },
    ]),
    NgMaterialModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
  ],
})
export class BasketModule {}
