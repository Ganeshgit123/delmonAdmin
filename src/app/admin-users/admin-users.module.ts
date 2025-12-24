import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminUsersComponent } from './admin-users.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgMaterialModule } from '../ng-material.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NgMaterialModule,
    RouterModule.forChild([
      {
        path: '',
        component: AdminUsersComponent,
      },
    ]),
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    AdminUsersComponent,
  ],
})
export class AdminUsersModule {}
