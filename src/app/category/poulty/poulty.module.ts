import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PoultyComponent } from './poulty.component';
import { RouterModule } from '@angular/router';
import { NgMaterialModule } from '../../ng-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [PoultyComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: PoultyComponent,
      },
    ]),
    NgMaterialModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
  ],
})
export class PoultyModule {}
