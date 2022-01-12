import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyLandlordsPageRoutingModule } from './my-landlords-routing.module';

import { MyLandlordsPage } from './my-landlords.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyLandlordsPageRoutingModule
  ],
  declarations: [MyLandlordsPage]
})
export class MyLandlordsPageModule {}
