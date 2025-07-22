import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NormalComponent } from './normal.component';
import { RouterModule } from '@angular/router';
import { NgMaterialModule } from '../../ng-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [NormalComponent],
  imports: [
    CommonModule,
    NgMaterialModule,
    TranslateModule,
    FormsModule, 
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: "",
        component: NormalComponent
      },
    ])
  ]
})
export class NormalModule { }
