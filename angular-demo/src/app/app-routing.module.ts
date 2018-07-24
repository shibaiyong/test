import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { HerosComponent } from './heros/heros.component'
const routes: Routes = [
  { path: 'heroes',component: HerosComponent }
]


@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  // declarations: []
  exports:[RouterModule]
})
export class AppRoutingModule { }
