import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';




import { HerosComponent } from './heros/heros.component';
import { AppComponent } from './app.component';
import { HeroesDetailComponent } from './heroes-details/heroes-details';
import { MessageComponent } from './messages/message.component';
import { AppRoutingModule } from './/app-routing.module'
@NgModule({
  declarations: [
    AppComponent,
    HerosComponent,
    HeroesDetailComponent,
    MessageComponent
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
