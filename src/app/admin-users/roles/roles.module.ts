import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RolesComponent } from './roles.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgMaterialModule } from '../../ng-material.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NgMaterialModule,
    RouterModule.forChild([
      {
        path: '',
        component: RolesComponent,
      },
    ]),
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    RolesComponent,
  ],
})
export class RolesModule {}
