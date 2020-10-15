import { Component, OnInit, AfterViewInit, AfterContentInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from 'src/app/shared/data.service';
import { RestService } from 'src/app/shared/rest.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterContentInit {

  public errorMessage: string;

  public accessForm: FormGroup;

  private gradientStep: number = 0;

  backgroundGradient = {
    'background': `linear-gradient(90deg, rgba(32,34,37,1) 0%, rgba(32,34,37,1) 20%, rgba(54,57,63,1) 20%, rgba(54,57,63,1) 100%)`
    // 'background': `radial-gradient(circle, rgba(32,34,37,1) ${this.gradientStep}%, rgba(54,57,63,1) 100%)`
  }

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private data: DataService,
    private rest: RestService
  ) { }

  ngOnInit(): void {
    this.accessForm = this.formBuilder.group({
      accessCode: ''
    })
  }

  async ngAfterContentInit(): Promise<void> {

    let inc = 5;
    let seg = 0;

    while(seg != 2){
      await new Promise( (resolve) => {
        setTimeout( () => {

          if(seg == 0){
            this.gradientStep += 1;
            this.backgroundGradient.background = `linear-gradient(90deg, rgba(47,49,54,1) 0%, rgba(47,49,54,1) ${this.gradientStep}%, rgba(54,57,63,1) ${this.gradientStep+1}%, rgba(54,57,63,1) 100%)`;  
            if(this.gradientStep >= 100){
              seg = 1;
              this.gradientStep = 1;
            }
          }

          if(seg == 1){
            this.gradientStep = 0 + inc;
            inc = inc * 1.02;
            this.backgroundGradient.background = `radial-gradient(at top right, rgba(32,34,37,1) 0%, rgba(32,34,37,1) ${this.gradientStep}%, rgba(47,49,54,1) ${this.gradientStep+1}%, rgba(47,49,54,1) 100%)`;
            seg = this.gradientStep >= 100 ? 2 : 1;
          }

          resolve();
        }, 1);
        
      });
    }
  }

  onSubmit(): void {
    const code: string = this.accessForm.value.accessCode;

    if(code.length < 5) {
      this.errorMessage = "This is not a valid access code!";
      return;
    }

    this.rest.getRequest('').then( res => {
      if(res){

        this.data.setDetails(code).then( success => {

          if(success){
            this.router.navigateByUrl('/stats');
          } else {
            this.errorMessage = "No server uses this access code!";
          }

        });

      } else {

        this.errorMessage = "Uh oh! Our servers can not be reached right now. Please try again later.";
      
      }
    });

  }

}
