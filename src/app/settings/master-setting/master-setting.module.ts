import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MasterSettingComponent } from './master-setting.component';
import { RouterModule } from '@angular/router';
import { NgMaterialModule } from '../../ng-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [MasterSettingComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: MasterSettingComponent,
      },
    ]),
    NgMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
})
export class MasterSettingModule {}
