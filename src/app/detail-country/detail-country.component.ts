import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { CountryInfo } from '../models/country-info-model';
import { CountryDetails } from '../models/country-details-model';

@Component({
  selector: 'app-detail-country',
  templateUrl: './detail-country.component.html',
  styleUrls: ['./detail-country.component.css']
})
export class DetailCountryComponent implements OnInit {
  @Input() modal_heading;
  @Input() modal_details;
  country_data: CountryDetails;
  constructor(private activeModal: NgbActiveModal, private http: HttpClient) { }

  ngOnInit(){
    this.http.get(`http://35.224.154.91:5632/countryData/${this.modal_heading}`).subscribe((data: CountryDetails)=>{
      this.country_data = data;
    })
  }
  close() {
    this.activeModal.close();
  }


}
