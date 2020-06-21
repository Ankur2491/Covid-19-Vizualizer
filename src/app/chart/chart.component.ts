import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DetailCountryComponent } from '../detail-country/detail-country.component';

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
  colorSchemeCases = {
    domain: []
  };
  colorSchemeDeaths = {
    domain: []
  };
  colorSchemeRecovered = {
    domain: []
  };
  constructor(private router: Router, private activatedRoute: ActivatedRoute, private http: HttpClient, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((data) => {
      this.selectedCountry = data.country;
      this.http.get(`http://35.224.154.91:5630/historicalData/${this.selectedCountry}`).subscribe((res) => {
        console.log(res);
        let cases = res['timeline'].cases;
        let deaths = res['timeline'].deaths;
        let recovered = res['timeline'].recovered;
        for (let key of Object.keys(cases)) {
          let obj = {};
          obj["name"] = key;
          obj["value"] = cases[key];
          this.casesData.push(obj);
          this.colorSchemeCases.domain.push('#0000ff');
        }
        for (let key of Object.keys(deaths)) {
          let obj = {};
          obj["name"] = key;
          obj["value"] = deaths[key];
          this.deathData.push(obj);
          this.colorSchemeDeaths.domain.push('#ff0000');
        }
        for (let key of Object.keys(recovered)) {
          let obj = {};
          obj["name"] = key;
          obj["value"] = recovered[key];
          this.recoveredData.push(obj);
          this.colorSchemeRecovered.domain.push('#00ff00');
        }
        // Object.keys(deaths).forEach(key=>{
        //   this.deathData.push({"name":key,"value":deaths[key]});
        // })
        // Object.keys(recovered).forEach(key=>{
        //   this.recoveredData.push({"name":key,"value":recovered[key]});
        // })
        // })
        //console.log("Before:",this.casesData);
        //this.casesData = [ { "name": "Maharashtra", "value": 0 }, { "name": "Tamil Nadu", "value": 0 }, { "name": "Delhi", "value": 0 }, { "name": "State Unassigned", "value": 0 }, { "name": "Gujarat", "value": 6396 }, { "name": "Uttar Pradesh", "value": 6237 }, { "name": "West Bengal", "value": 5126 }, { "name": "Haryana", "value": 4946 }, { "name": "Andhra Pradesh", "value": 4240 }, { "name": "Telangana", "value": 3363 }, { "name": "Karnataka", "value": 3169 }, { "name": "Rajasthan", "value": 2955 }, { "name": "Jammu and Kashmir", "value": 2417 }, { "name": "Madhya Pradesh", "value": 2343 }, { "name": "Bihar", "value": 2087 }, { "name": "Assam", "value": 2025 }, { "name": "Kerala", "value": 1450 }, { "name": "Odisha", "value": 1307 }, { "name": "Punjab", "value": 1176 }, { "name": "Uttarakhand", "value": 809 }, { "name": "Chhattisgarh", "value": 755 }, { "name": "Ladakh", "value": 718 }, { "name": "Goa", "value": 625 }, { "name": "Jharkhand", "value": 609 }, { "name": "Manipur", "value": 545 }, { "name": "Tripura", "value": 508 }, { "name": "Himachal Pradesh", "value": 231 }, { "name": "Puducherry", "value": 200 }, { "name": "Mizoram", "value": 132 }, { "name": "Arunachal Pradesh", "value": 120 }, { "name": "Chandigarh", "value": 82 }, { "name": "Nagaland", "value": 73 }, { "name": "Dadra and Nagar Haveli and Daman and Diu", "value": 62 }, { "name": "Sikkim", "value": 49 }, { "name": "Andaman and Nicobar Islands", "value": 12 }, { "name": "Meghalaya", "value": 5 }, { "name": "Lakshadweep", "value": 0 } ];
        let length = this.casesData.length;
        this.casesData = this.casesData.slice(0, length);
        this.deathData = this.deathData.slice(0, length);
        this.recoveredData = this.recoveredData.slice(0, length);
        //Object.assign(this, new Object(this.casesData));
        // console.log("deaths:",this.deathData);
        // console.log("recovered",this.recoveredData);
        // console.log(this.colorScheme);
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
