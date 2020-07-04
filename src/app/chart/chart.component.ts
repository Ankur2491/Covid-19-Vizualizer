import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DetailCountryComponent } from '../detail-country/detail-country.component';
import * as d3 from "d3";
@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {

  selectedCountry: string;
  casesData: Array<any> = [];
  deathData: Array<any> = [];
  recoveredData: Array<any> = [];
  view: any[] = [1200, 370];
  gradient: boolean = false;
  showXAxis = true;
  showYAxis = true;
  showXAxisLabel = true;
  xAxisLabel = 'Date';
  showYAxisLabel = true;
  yAxisLabel = 'Count';

  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  timeline: boolean = true;
  colorSchemeDeath = {
    //'#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'
    domain: ['#A10A28']
  };
  colorSchemeCombined = {
    //'#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'
    domain: ['#005AFF','#5AA454']
  };
  x = d3.select('body').attr('class', 'body-black-component').append('h1').attr('class', 'header-black').text('Covid-19-Visualiser').attr('align', 'center').style('font-family', 'courier');
  constructor(private router: Router, private activatedRoute: ActivatedRoute, private http: HttpClient, private modalService: NgbModal) {
  }
  historicalData: any[] = [{"name": "Deaths", "series":[]}]; 
  historicalDataCombined: any[] = [{"name": "Cases", "series":[]},{"name": "Recovered", "series":[]}]; 
  ngOnInit(): void {
    this.activatedRoute.params.subscribe((data) => {
      this.selectedCountry = data.country;
      // this.http.get(`http://35.224.154.91:5630/historicalData/${this.selectedCountry}`).subscribe((res) => {
      //   console.log(res);
      //   let cases = res['timeline'].cases;
      //   let deaths = res['timeline'].deaths;
      //   let recovered = res['timeline'].recovered;
      //   for (let key of Object.keys(cases)) {
      //     let obj = {};
      //     obj["name"] = key;
      //     obj["value"] = cases[key];
      //     this.casesData.push(obj);
      //     this.colorSchemeCases.domain.push('#0000ff');
      //   }
      //   for (let key of Object.keys(deaths)) {
      //     let obj = {};
      //     obj["name"] = key;
      //     obj["value"] = deaths[key];
      //     this.deathData.push(obj);
      //     this.colorSchemeDeaths.domain.push('#ff0000');
      //   }
      //   for (let key of Object.keys(recovered)) {
      //     let obj = {};
      //     obj["name"] = key;
      //     obj["value"] = recovered[key];
      //     this.recoveredData.push(obj);
      //     this.colorSchemeRecovered.domain.push('#00ff00');
      //   }
      //   let length = this.casesData.length;
      //   this.casesData = this.casesData.slice(0, length);
      //   this.deathData = this.deathData.slice(0, length);
      //   this.recoveredData = this.recoveredData.slice(0, length);
      // })
      this.http.get(`http://35.224.154.91:5630/historicalData/${this.selectedCountry}`).subscribe((res) => {
        let cases = res['timeline'].cases;
        let deaths = res['timeline'].deaths;
        let recovered = res['timeline'].recovered;
        let dates = Array.from(Object.keys(cases));
        for(let i=1;i<dates.length;i++){
          let differenceCase = Math.abs(cases[dates[i]]-cases[dates[i-1]]);
          let differenceDeath = Math.abs(deaths[dates[i]]-deaths[dates[i-1]]);
          let differenceRecovered = Math.abs(recovered[dates[i]]-recovered[dates[i-1]]);
          let obj1 = {};
          let obj2 = {};
          let obj3 = {};
          obj1["name"] = dates[i];
          obj1["value"] = differenceCase;
          obj2["name"] = dates[i];
          obj2["value"] = differenceDeath;
          obj3["name"] = dates[i];
          obj3["value"] = differenceRecovered;
          this.historicalData[0].series.push(obj2);
          this.historicalDataCombined[0].series.push(obj1);
          this.historicalDataCombined[1].series.push(obj3);
        }
        this.historicalDataCombined = [...this.historicalDataCombined]
        this.historicalData = [...this.historicalData]
      })
    })
  }
  home() {
    this.router.navigate(['/home', { homeVisible: true }], { skipLocationChange: true });
  }

  onSelect(data): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  openDetails() {
    const modelRef = this.modalService.open(DetailCountryComponent, {
      windowClass: "detailModalClass"
    });
    modelRef.componentInstance.modal_heading = this.selectedCountry;
    // modelRef.componentInstance.modal_details = details;
  }
}
