import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MostWantedAddressComponent } from './most-wanted-address.component';
import { RouterModule } from '@angular/router';
import { NgMaterialModule } from '../../ng-material.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    MostWantedAddressComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: "",
        component: MostWantedAddressComponent
      }
    ]),
    NgMaterialModule,
    TranslateModule,
  ]
})
export class MostWantedAddressModule { }
