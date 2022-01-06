import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UploadListingPageRoutingModule } from './upload-listing-routing.module';

import { UploadListingPage } from './upload-listing.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UploadListingPageRoutingModule
  ],
  declarations: [UploadListingPage]
})
export class UploadListingPageModule {}
