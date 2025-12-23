import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecepiesComponent } from './recepies.component';
import { RouterModule } from '@angular/router';
import { NgMaterialModule } from '../ng-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { AngularEditorModule } from '@kolkov/angular-editor';

@NgModule({
  declarations: [RecepiesComponent],
  imports: [
    CommonModule,
    AngularEditorModule,
    RouterModule.forChild([
      {
        path: '',
        component: RecepiesComponent,
      },
    ]),
    NgMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    TranslateModule,
  ],
})
export class RecepiesModule {}
