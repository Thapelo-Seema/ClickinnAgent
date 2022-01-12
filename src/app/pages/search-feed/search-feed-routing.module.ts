import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SearchFeedPage } from './search-feed.page';

const routes: Routes = [
  {
    path: '',
    component: SearchFeedPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SearchFeedPageRoutingModule {}
