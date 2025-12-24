import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeComponent } from './employee.component';
import { RouterModule } from '@angular/router';
import { NgMaterialModule } from '../../ng-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NgMaterialModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    EmployeeComponent,
    RouterModule.forChild([
      {
        path: '',
        component: EmployeeComponent,
      },
    ]),
  ],
})
export class EmployeeModule {}
