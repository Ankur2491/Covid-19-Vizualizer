import { Component, AfterContentInit, OnInit } from '@angular/core';
import * as d3 from "d3";
import * as topojson from "topojson-client";
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DetailCountryComponent } from './detail-country/detail-country.component';
import { HttpClient } from '@angular/common/http';

export interface IWindow extends Window {
  webkitSpeechRecognition: any;
  webkitAudioContext: any;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterContentInit, OnInit {
  title = 'd3-choropleth';
  width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  isWorldMapVisible = true;
  covidData: any;
  x = d3.select('body').attr('class','body-blue-component').append('h1').attr('class','header-black').text('Covid-19-Visualiser').attr('align','center').style('font-family','courier');
  svg = d3.select("body")
    .append("svg")
    .style("cursor", "move");
  map = this.svg.append("g").attr("class", "map");
  zoom = d3.zoom().on("zoom", () => {
    let transform = d3.zoomTransform(this);
    this.map.attr("transform", transform);
  });
  

  constructor(private router: Router, private modalService: NgbModal, private http: HttpClient, private activatedRoute: ActivatedRoute) { }
  ngOnInit() {
    this.activatedRoute.params.subscribe((data)=>{
      if(data.homeVisible){
      this.isWorldMapVisible = data.homeVisible;
      d3.selectAll('g').style('visibility','visible');
      }
    })
  }

  toggleSpeechRecognition() {
    if ('webkitSpeechRecognition' in window) {
      const { webkitSpeechRecognition }: IWindow = <IWindow>(window as unknown);
      const recognition = new webkitSpeechRecognition();

      recognition.continuous = true;
      recognition.onresult = (event) => {
        const voiceCommand = event.results[event.results.length - 1][0].transcript;

        this.handleVoiceCommand(voiceCommand);
      }

      recognition.start();
    }
  }

  handleVoiceCommand(command) {
    if(command){
      for(let element of this.covidData){
        if(element.country_region == command){
          let details = {"confirmed":"","deaths":"","recovered":""};
          const modelRef = this.modalService.open(DetailCountryComponent, {
            windowClass: "detailModalClass"
          });
          details.confirmed = element.confirmed;
          details.deaths = element.deaths;
          details.recovered = element.recovered;
          modelRef.componentInstance.modal_heading=command; 
          modelRef.componentInstance.modal_details = details;
        }

    }
  }
}
  ngAfterContentInit() {
    this.svg.attr("viewBox", "50 10 " + this.width + " " + this.height)
      .attr("preserveAspectRatio", "xMinYMin");
    this.svg.call(this.zoom);
    Promise.all([
      d3.json("assets/data/50m.json"),
      this.http.get("http://35.224.154.91:5630/worldData").toPromise(),
      //d3.json("assets/data/covid-cases.json"),
    ]).then(([world,data]) => {
      let covData = data['results'];
      this.covidData = covData;
      this.drawMap(world, covData);
    })
  }
  drawMap(world, data) {
    // geoMercator projection
    var projection = d3.geoMercator() //d3.geoOrthographic()
      .scale(130)
      .translate([this.width / 2, this.height / 1.5]);

    // geoPath projection
    var path = d3.geoPath().projection(projection);

    //colors for population metrics
    var color = d3.scaleThreshold()
      .domain([0, 10000, 100000, 500000, 1000000, 5000000, 10000000, 50000000, 100000000, 500000000, 1500000000])
      .range(['#00ff00', '#fff7ec', '#fee8c8', '#fdd49e', '#fdbb84', '#fc8d59', '#ef6548', '#d7301f', '#b30000', '#7f0000']);

    var features = topojson.feature(world, world.objects.countries)["features"];
    var casesByCountry = {};

    data.forEach(function (d) {
      if(d.country_region == 'USA'){
        d.country_region = "United States";
      }
      if(d.country_region == 'UK'){
        d.country_region = "United Kingdom";
      }
      casesByCountry[d.country_region] = {
        confirmed: +d.confirmed,
        deaths: +d.deaths,
        recovered: +d.recovered
      }
    });
    features.forEach(function (d) {
      d.details = casesByCountry[d.properties.name] ? casesByCountry[d.properties.name] : {};
    });

    this.map.append("g")
      .selectAll("path")
      .data(features)
      .enter().append("path")
      .attr("name", function (d) {
        return d.properties.name;
      })
      .attr("id", function (d) {
        return d.id;
      })
      .attr("d", path)
      .style("fill", function (d) {
        return d.details && d.details.confirmed ? color(d.details.confirmed) : undefined;
      })
      .on('mouseover', function (d) {
        d3.select(this)
          .style("stroke", "white")
          .style("stroke-width", 1)
          .style("cursor", "pointer");

        d3.select(".country_region")
          .text(d.properties.name);

        d3.select(".confirmed")
          .text(d.details && d.details.confirmed && "Confirmed: " + d.details.confirmed || "Confirmed 0");

        d3.select(".deaths")
          .text(d.details && d.details.deaths && "Deaths: " + d.details.deaths || "Deaths: 0");

        d3.select(".recovered")
          .text(d.details && d.details.recovered && "Recovered: " + d.details.recovered || "Recovered: 0");

        d3.select('.details')
          .style('visibility', "visible")
      })
      .on('mouseout', function (d) {
        d3.select(this)
          .style("stroke", null)
          .style("stroke-width", 0.25);

        d3.select('.details')
          .style('visibility', "hidden");
      })
      .on('click', (event) => {
        let selectedCountry = event.properties.name
        // let details = event.details
        // const modelRef = this.modalService.open(DetailCountryComponent, {
        //   windowClass: "detailModalClass"
        // });
        // modelRef.componentInstance.modal_heading = selectedCountry;
        // modelRef.componentInstance.modal_details = details;
        //this.router.navigate([`/detail/${selectedCountry}`])
        this.isWorldMapVisible = false;
        d3.selectAll('g').style('visibility','hidden');
        this.router.navigate([`/chart/${selectedCountry}`],{skipLocationChange:true});

      })
  }



}
