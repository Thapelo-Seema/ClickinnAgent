import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyLandlordsPage } from './my-landlords.page';

const routes: Routes = [
  {
    path: '',
    component: MyLandlordsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyLandlordsPageRoutingModule {}
