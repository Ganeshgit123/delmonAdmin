import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PinComponent } from './pin.component';
import { RouterModule } from '@angular/router';
import { NgMaterialModule } from '../../ng-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [PinComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: PinComponent,
      },
    ]),
    NgMaterialModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class PinModule {}
