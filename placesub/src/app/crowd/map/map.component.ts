import { Component, OnInit, Input, Output, OnChanges, ElementRef, EventEmitter } from '@angular/core';
import * as L from 'leaflet';
import * as $ from 'jquery';
import { PushNotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnChanges {
  options: any = {};
  layers: any = {};
  @Input() locations = [];
  @Output() subscribeUp: EventEmitter<string> = new EventEmitter<string>();

  constructor(private elementRef: ElementRef, private _pushNotifications: PushNotificationsService) { }

  ngOnInit() {
    console.log(this.locations);
    this.options = {
      layers: [
        L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 20, attribution: '...' })
      ],
      zoom: 15,
      center: L.latLng([ 37.7735263, -122.4180948 ])
    };

    this.layers = [
      L.circle([ 37.7735263, -122.4180948 ], { radius: 50 }),
      // L.polygon([[ 46.8, -121.85 ], [ 46.92, -121.92 ], [ 46.87, -121.8 ]]),

    ];
  }

  ngOnChanges() {

    for (let i = 0; i < this.locations.length; i++) {
      let iconUrl = '../../../assets/red.png';
      if (+this.locations[i]['occupancy'] / +this.locations[i]['capacity'] * 100 <= 50) {
        iconUrl = '../../../assets/green.png';
      } else if (+this.locations[i]['occupancy'] / +this.locations[i]['capacity'] * 100 <= 70) {
        iconUrl = '../../../assets/yellow.png';
      }

      const POPUP_HTML = '<div style="height: 130px; width: 200px; font-family: Metropolis;"><br><b style="font-size: 20px;">'
         + this.locations[i]['loc'] + '</b><h5 style="padding-top: 0px; margin-top: 0px;">Occupancy: ' + this.locations[i]['occupancy'] + '/' + this.locations[i]['capacity'] + '</h5>'
         + `<br><a class="btn btn-primary btn-sm subscribe-btn" onClick="(function() { $('.pseudobtn').click(); $('.leaflet-popup-close-button')[0].click(); })()">Subscribe</a> <button class="btn btn-success btn-sm">Queue</button>` + '</div>';
      // this.layers[+this.locations[i]['id']] = L.circle([+this.locations[i]['lat'], +this.locations[i]['lon']], { radius: 20 });
      this.layers[+this.locations[i]['id']] = L.marker([ +this.locations[i]['lat'], +this.locations[i]['lon'] ], {
        icon: L.icon({
          iconSize: [40, 40],
          iconAnchor: [20, 0],
          iconUrl: iconUrl
        })
      }).bindPopup(POPUP_HTML).openPopup();
    }
    console.log(this.layers);

  }

  onSubscribe() {
    console.log('subscribe');
    this.subscribeUp.emit('s!');
    this._pushNotifications.create('Subscription successful!', {body: 'You will receive a notification when place is less crowded.'}).subscribe(
      res => console.log(res),
      err => console.log(err)
    );

  }

  onMapReady(event) {
    console.log("ready", event);
  }

}

