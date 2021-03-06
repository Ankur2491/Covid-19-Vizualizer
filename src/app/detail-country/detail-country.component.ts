import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { CountryDetails } from '../models/country-details-model';

@Component({
  selector: 'app-detail-country',
  templateUrl: './detail-country.component.html',
  styleUrls: ['./detail-country.component.css']
})
export class DetailCountryComponent implements OnInit {
  @Input() modal_heading;
  // @Input() modal_details;
  country_data: CountryDetails;
  last_updated: string;
  constructor(private activeModal: NgbActiveModal, private http: HttpClient) { }

  ngOnInit(){
    this.http.get(`http://35.224.154.91:5630/countryData/${this.modal_heading}`).subscribe((data: CountryDetails)=>{
      this.country_data = data;
      let lu = this.country_data.updated;
      let date = new Date(0);
      date.setUTCMilliseconds(lu);
      this.last_updated = date.toDateString()+","+date.toLocaleTimeString();
    })
  }
  close() {
    this.activeModal.close();
  }


}
