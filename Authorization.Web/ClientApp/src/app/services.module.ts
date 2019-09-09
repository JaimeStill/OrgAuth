import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { Guards } from './guards';
import { Services } from './services';
import { Pipes } from './pipes';

@NgModule({
  providers: [
    [...Guards],
    [...Services]
  ],
  declarations: [
    [...Pipes]
  ],
  imports: [
    HttpClientModule
  ],
  exports: [
    [...Pipes],
    HttpClientModule
  ]
})
export class ServicesModule { }
