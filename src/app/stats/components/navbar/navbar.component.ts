import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/shared/data.service';
import { RestService } from 'src/app/shared/rest.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  // guild variables
  public guildIconURL: string = 'https://cdn.discordapp.com/icons/284295909867520000/8864766ead4a1f7744b3a847dfa9fe39.png';
  public guildName: string = 'A Totally Democratic Discord Server';

  public dashboards = ['Messages', 'Leaderboards', 'Voice chat', 'Presence', 'Users'];
  public selectedDashboard = '';

  constructor (
    private rest: RestService,
    private router: Router,
    private data: DataService
  ) { }

  ngOnInit(): void {

    // update selected menu item
    const path = window.location.pathname.toLowerCase();
    this.onClick(path.split('/').pop());

    // refresh details
    const code = JSON.parse(this.data.getDetails()).code;
    this.data.setDetails(code);

    // get details from session storage
    const guild = JSON.parse(this.data.getDetails());

    this.guildName = guild.name;
    this.guildIconURL = guild.icon != 'null' 
      ? guild.icon 
      : '/assets/next.png';

    // // check api connection
    // this.rest.getRequest('').then( res => {
    //   if(res){
    //     console.log();
    //     // do request that gets basic information like icon and name
    //   } else {
    //     // UH OH page
    //   }
    // });
  }

  onClick(dashboard): void {
    dashboard = dashboard.toLowerCase();
    if(this.selectedDashboard != dashboard){
      this.selectedDashboard = dashboard;
    }
  }
}
