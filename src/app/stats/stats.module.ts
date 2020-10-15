import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatsComponent } from './stats/stats.component';
import { ComponentsModule } from './components/components.module';
import { PagesModule } from './pages/pages.module';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from '../app-routing.module';
import { LeaderboardsComponent } from './pages/leaderboards/leaderboards.component';
import { ServerComponent } from './pages/server/server.component';
import { ChartsModule } from 'ng2-charts';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [StatsComponent],
  imports: [
    CommonModule,
    ComponentsModule,
    PagesModule,
    RouterModule,
    AppRoutingModule,
    ChartsModule,
    SharedModule
  ],
  exports: [
    StatsComponent,
    LeaderboardsComponent,
    ServerComponent
  ]
})
export class StatsModule { }
