import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewLandlordPageRoutingModule } from './view-landlord-routing.module';

import { ViewLandlordPage } from './view-landlord.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewLandlordPageRoutingModule
  ],
  declarations: [ViewLandlordPage]
})
export class ViewLandlordPageModule {}
