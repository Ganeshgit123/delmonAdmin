import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnavailableComponent } from './unavailable.component';
import { RouterModule } from '@angular/router';
import { NgMaterialModule } from '../../ng-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [UnavailableComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: UnavailableComponent,
      },
    ]),
    NgMaterialModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class UnavailableModule {}
