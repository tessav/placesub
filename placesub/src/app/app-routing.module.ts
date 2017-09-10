import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard/dashboard.component';
import { VideostreamComponent } from './dashboard/videostream/videostream.component';
import { AnalyticsComponent } from './dashboard/analytics/analytics.component';
import { QueueComponent } from './dashboard/queue/queue.component';
import { CrowdComponent } from './crowd/crowd.component';


const appRoutes: Routes = [
  { path: 'dashboard', component: DashboardComponent, children: [
    { path: 'videostream', component: VideostreamComponent},
    { path: 'analytics', component: AnalyticsComponent},
    { path: 'queue', component: QueueComponent},
  ]},
  {
    path: 'crowd', component: CrowdComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
