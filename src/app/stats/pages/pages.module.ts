import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaderboardsComponent } from './leaderboards/leaderboards.component';
import { ServerComponent } from './server/server.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ChartsModule } from 'ng2-charts';
import { ComponentsModule } from '../components/components.module';
import { PresenceComponent } from './presence/presence.component';
import { UsersComponent } from './users/users.component';
import { VoicechatComponent } from './voicechat/voicechat.component';



@NgModule({
  declarations: [LeaderboardsComponent, ServerComponent, PresenceComponent, UsersComponent, VoicechatComponent],
  imports: [
    CommonModule,
    SharedModule,
    ChartsModule,
    ComponentsModule
  ],
  exports: [
    LeaderboardsComponent,
    ServerComponent
  ]
})
export class PagesModule { }
