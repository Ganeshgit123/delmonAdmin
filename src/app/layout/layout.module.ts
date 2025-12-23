import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BaseComponent } from './base/base.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterComponent } from './footer/footer.component';

import { ContentAnimateDirective } from '../core/content-animate/content-animate.directive';

import { NgbDropdownModule, NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

import { FeahterIconModule } from '../core/feather-icon/feather-icon.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    TranslateModule,
    ReactiveFormsModule,
    NgbDropdownModule,
    NgbCollapseModule,
    FeahterIconModule,
    BaseComponent,
    NavbarComponent,
    SidebarComponent,
    FooterComponent,
    ContentAnimateDirective
  ]
})
export class LayoutModule { }
