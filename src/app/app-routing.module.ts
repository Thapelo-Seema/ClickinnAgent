import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule),
    canLoad: [AuthGuard], canActivate: [AuthGuard]
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'signin',
    loadChildren: () => import('./pages/signin/signin.module').then( m => m.SigninPageModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./pages/signup/signup.module').then( m => m.SignupPageModule)
  },
  {
    path: 'upload-listing',
    loadChildren: () => import('./pages/upload-listing/upload-listing.module').then( m => m.UploadListingPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile.module').then( m => m.ProfilePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'room',
    loadChildren: () => import('./pages/room/room.module').then( m => m.RoomPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'my-uploads',
    loadChildren: () => import('./pages/my-uploads/my-uploads.module').then( m => m.MyUploadsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'job',
    loadChildren: () => import('./pages/job/job.module').then( m => m.JobPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'add-landlord',
    loadChildren: () => import('./pages/add-landlord/add-landlord.module').then( m => m.AddLandlordPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'search-feed',
    loadChildren: () => import('./pages/search-feed/search-feed.module').then( m => m.SearchFeedPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'my-landlords',
    loadChildren: () => import('./pages/my-landlords/my-landlords.module').then( m => m.MyLandlordsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'view-landlord',
    loadChildren: () => import('./pages/view-landlord/view-landlord.module').then( m => m.ViewLandlordPageModule),
     canActivate: [AuthGuard]
  },
  {
    path: 'appointment',
    loadChildren: () => import('./pages/appointment/appointment.module').then( m => m.AppointmentPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./pages/forgot-password/forgot-password.module').then( m => m.ForgotPasswordPageModule)
  },
  {
    path: 'available',
    loadChildren: () => import('./pages/available/available.module').then( m => m.AvailablePageModule)
  },
  {
    path: 'placement',
    loadChildren: () => import('./pages/placement/placement.module').then( m => m.PlacementPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }