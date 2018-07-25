import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './/app-routing.module'



import { HerosComponent } from './heros/heros.component';
import { AppComponent } from './app.component';
import { HeroesDetailComponent } from './heroes-details/heroes-details';
import { MessageComponent } from './messages/message.component';
import { DashBoardComponent } from './dashboard/dashboard.component'
@NgModule({
  declarations: [
    AppComponent,
    HerosComponent,
    HeroesDetailComponent,
    MessageComponent,
    DashBoardComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
