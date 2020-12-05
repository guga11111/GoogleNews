import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrincipalComponent } from './principal/principal.component';
import { NewComponent } from './new/new.component';
import { NewsRoutingModule } from './news-routing.module'
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [PrincipalComponent, NewComponent],
  imports: [
    CommonModule,
    NewsRoutingModule,
    ReactiveFormsModule
  ],
  exports: []
})
export class NewsModule { }
