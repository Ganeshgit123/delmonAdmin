import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentEditorComponent } from './content-editor.component';
import { TermsComponent } from './terms/terms.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { AboutusComponent } from './aboutus/aboutus.component';
import { RouterModule } from '@angular/router';
import { NgMaterialModule } from '../ng-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularEditorModule } from '@kolkov/angular-editor';

@NgModule({
  declarations: [
    ContentEditorComponent,
    TermsComponent,
    PrivacyComponent,
    AboutusComponent
  ],
  imports: [
    CommonModule,
    NgMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    AngularEditorModule,
    RouterModule.forChild([
      {
        path: "",
        component: ContentEditorComponent
      },
      {
        path: "",
        component: TermsComponent
      },
      {
        path: "",
        component: PrivacyComponent
      },
      {
        path: "",
        component: AboutusComponent
      }
    ]),
  ]
})
export class ContentEditorModule { }
