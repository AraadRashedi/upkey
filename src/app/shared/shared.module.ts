import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FeedComponent } from './components/feed/feed.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { UserComponent } from './components/user/user.component';
import { INTERCEPTOR_PROVIDERS } from './interceptors';



@NgModule({
  declarations: [
    SidebarComponent,
    FeedComponent,
    UserComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
  ],
  exports: [
    BrowserModule,
    SidebarComponent,
    FeedComponent,
    UserComponent,
  ],
  providers: [
    INTERCEPTOR_PROVIDERS,
  ]
})
export class SharedModule { }
