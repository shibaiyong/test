import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { HerosComponent } from './heros/heros.component';
import { DashBoardComponent } from './dashboard/dashboard.component';
import { HeroesDetailComponent } from './heroes-details/heroes-details'
const routes: Routes = [
  { path: 'heroes',component: HerosComponent },
  { path: 'dashboard',component: DashBoardComponent },
  { path: 'herodetail/:id', component: HeroesDetailComponent }
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  // declarations: []
  exports:[RouterModule]
})
export class AppRoutingModule { }
