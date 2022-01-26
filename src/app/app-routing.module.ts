import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'chats',
    loadChildren: () => import('./pages/chats/chats.module').then( m => m.ChatsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'chat',
    loadChildren: () => import('./pages/chat/chat.module').then( m => m.ChatPageModule),
    canActivate: [AuthGuard]
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
    path: 'image-gallery-view',
    loadChildren: () => import('./pages/image-gallery-view/image-gallery-view.module').then( m => m.ImageGalleryViewPageModule),
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
    path: 'appointments',
    loadChildren: () => import('./pages/appointments/appointments.module').then( m => m.AppointmentsPageModule),
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
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }