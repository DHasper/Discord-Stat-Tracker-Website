import { Injectable } from '@angular/core';
import { RestService } from './rest.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    private rest: RestService,
    private router: Router
  ) {}

  setDetails(code: string): Promise<boolean> {
    return new Promise( resolve => {
      this.rest.getRequest(`/guild/code/${code}`).then( guild => {

        if(guild && guild.id){

          const payload =  {
            id: guild.id,
            name: guild.name,
            icon: guild.iconURL,
            code: guild.accessCode
          }

          sessionStorage.setItem('guild', JSON.stringify(payload));
          resolve(true);
        } else {
          resolve(false);
        }

      });
    });
  }

  getDetails() {
    // check if guild is in session storage, otherwise route back to home screen
    if(!sessionStorage.guild){
      this.router.navigateByUrl("");
      return;
    }

    return sessionStorage.guild;
  }
}
