import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'grupos',
    loadChildren: () => import('./grupos/grupos.module').then( m => m.GruposPageModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'personas',
    loadChildren: () => import('./personas/personas.module').then( m => m.PersonasPageModule),
    canActivate:[AuthGuard]
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
