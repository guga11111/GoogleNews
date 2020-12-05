import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewComponent } from './new/new.component';
import { PrincipalComponent } from './principal/principal.component';

const routes: Routes = [
  { path: 'principal', component: PrincipalComponent },
  { path: 'new/:NewId', component: NewComponent },
  { path: ':NewId', component: NewComponent },

  { path: '**', redirectTo: 'principal' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewsRoutingModule { }
