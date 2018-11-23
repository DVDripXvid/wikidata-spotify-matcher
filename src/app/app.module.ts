import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { OAuthModule } from 'angular-oauth2-oidc';
import { MaterialModule } from './material/material.module';
import { LibraryTreeComponent } from './components/library-tree/library-tree.component';
import { HomeComponent } from './components/home/home.component';
import { VirtualScrollerModule } from 'ngx-virtual-scroller';

@NgModule({
  declarations: [
    AppComponent,
    LibraryTreeComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    VirtualScrollerModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    OAuthModule.forRoot(),
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
