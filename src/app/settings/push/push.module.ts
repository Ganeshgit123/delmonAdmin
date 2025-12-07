import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PushComponent } from './push.component';
import { RouterModule } from '@angular/router';
import { NgMaterialModule } from '../../ng-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [
    PushComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: "",
        component: PushComponent
      }
    ]),
    NgMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    MatChipsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule
  ]
})
export class PushModule { }
