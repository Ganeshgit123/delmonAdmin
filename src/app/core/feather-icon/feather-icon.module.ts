import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeatherIconDirective } from './feather-icon.directive';

@NgModule({
  imports: [
    CommonModule,
    FeatherIconDirective,
  ],
  exports: [FeatherIconDirective]
})
export class FeahterIconModule { }
