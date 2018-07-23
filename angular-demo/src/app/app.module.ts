import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HerosComponent } from './heros/heros.component';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
    HerosComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
