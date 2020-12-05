import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {path: 'news', loadChildren: () => import('../app/news/news.module').then((m) => m.NewsModule) },
  {path: '**', redirectTo: 'news/principal'}
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
