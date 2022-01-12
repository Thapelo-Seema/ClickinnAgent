import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddLandlordPageRoutingModule } from './add-landlord-routing.module';

import { AddLandlordPage } from './add-landlord.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddLandlordPageRoutingModule
  ],
  declarations: [AddLandlordPage]
})
export class AddLandlordPageModule {}
