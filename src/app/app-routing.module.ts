import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home/home.component';
import { StatsComponent } from './stats/stats/stats.component';
import { LeaderboardsComponent } from './stats/pages/leaderboards/leaderboards.component';
import { ServerComponent } from './stats/pages/server/server.component';
import { UsersComponent } from './stats/pages/users/users.component';
import { PresenceComponent } from './stats/pages/presence/presence.component';
import { VoicechatComponent } from './stats/pages/voicechat/voicechat.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'stats', component: StatsComponent,
    children: [
      { path: '', redirectTo: 'messages', pathMatch: 'full' },
      { path: 'leaderboards', component: LeaderboardsComponent },
      { path: 'messages', component: ServerComponent },
      { path: 'voicechat', component: VoicechatComponent },
      { path: 'presence', component: PresenceComponent },
      { path: 'users', component: UsersComponent }
    ] 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
