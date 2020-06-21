import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DetailCountryComponent } from './detail-country/detail-country.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatIconModule} from '@angular/material/icon';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import {HttpClientModule} from '@angular/common/http';
import { ChartComponent } from './chart/chart.component';
@NgModule({
  declarations: [
    AppComponent,
    DetailCountryComponent,
    ChartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgxChartsModule,
    BrowserAnimationsModule,
    MatIconModule,
    NgbModule
  ],
  providers: [],
  //entryComponents:[DetailCountryComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
