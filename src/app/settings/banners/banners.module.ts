import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BannersComponent } from './banners.component';
import { RouterModule } from '@angular/router';
import { NgMaterialModule } from '../../ng-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [BannersComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: BannersComponent,
      },
    ]),
    NgMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    TranslateModule,
  ],
})
export class BannersModule {}
