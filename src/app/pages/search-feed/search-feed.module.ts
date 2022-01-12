import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SearchFeedPageRoutingModule } from './search-feed-routing.module';

import { SearchFeedPage } from './search-feed.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SearchFeedPageRoutingModule
  ],
  declarations: [SearchFeedPage]
})
export class SearchFeedPageModule {}
