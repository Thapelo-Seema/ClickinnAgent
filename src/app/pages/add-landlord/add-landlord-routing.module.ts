import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddLandlordPage } from './add-landlord.page';

const routes: Routes = [
  {
    path: '',
    component: AddLandlordPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddLandlordPageRoutingModule {}
