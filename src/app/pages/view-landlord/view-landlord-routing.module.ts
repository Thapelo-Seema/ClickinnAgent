import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewLandlordPage } from './view-landlord.page';

const routes: Routes = [
  {
    path: '',
    component: ViewLandlordPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewLandlordPageRoutingModule {}
