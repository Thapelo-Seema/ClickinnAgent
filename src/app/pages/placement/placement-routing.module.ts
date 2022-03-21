import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlacementPage } from './placement.page';

const routes: Routes = [
  {
    path: '',
    component: PlacementPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlacementPageRoutingModule {}
