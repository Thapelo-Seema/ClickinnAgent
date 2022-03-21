import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlacementPageRoutingModule } from './placement-routing.module';

import { PlacementPage } from './placement.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    PlacementPageRoutingModule
  ],
  declarations: [PlacementPage]
})
export class PlacementPageModule {}
