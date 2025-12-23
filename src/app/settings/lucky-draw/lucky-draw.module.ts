import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LuckyDrawComponent } from './lucky-draw.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgMaterialModule } from '../../ng-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [LuckyDrawComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: LuckyDrawComponent,
      },
    ]),
    TranslateModule,
    NgMaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class LuckyDrawModule {}
