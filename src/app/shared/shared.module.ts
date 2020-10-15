import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer/footer.component';
import { HttpClientModule } from '@angular/common/http';
import { RemoveSpacePipe } from './remove-space.pipe';

@NgModule({
  declarations: [FooterComponent, RemoveSpacePipe],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  exports: [
    FooterComponent,
    RemoveSpacePipe
  ]
})
export class SharedModule { }
