import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ClarityModule } from 'clarity-angular';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeaderComponent } from './header/header.component';
import { AnalyticsComponent } from './dashboard/analytics/analytics.component';
import { VideostreamComponent } from './dashboard/videostream/videostream.component';
import { CrowdComponent } from './crowd/crowd.component';
import { MapComponent } from './crowd/map/map.component';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { SimpleNotificationsModule, PushNotificationsModule } from 'angular2-notifications';
import { QueueComponent } from './dashboard/queue/queue.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    HeaderComponent,
    AnalyticsComponent,
    VideostreamComponent,
    CrowdComponent,
    MapComponent,
    QueueComponent
  ],
  imports: [
    BrowserModule,
    ClarityModule.forRoot(),
    LeafletModule.forRoot(),
    FormsModule,
    HttpModule,
    AppRoutingModule,
    ReactiveFormsModule,
    SimpleNotificationsModule.forRoot(),
    PushNotificationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
