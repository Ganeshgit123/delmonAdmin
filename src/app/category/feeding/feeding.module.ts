import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeedingComponent } from './feeding.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgMaterialModule } from '../../ng-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [FeedingComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: FeedingComponent,
      },
    ]),
    NgMaterialModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
  ],
})
export class FeedingModule {}
