import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
declare var google:any;
/**
 * Generated class for the MapPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {
  @ViewChild('map') mapRef:ElementRef;
  @ViewChild('address') addressRef:ElementRef;
  address:string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.DisplayMap();
  }

  DisplayMap() {
    
    const location = new google.maps.LatLng(-28.6852903,-49.3693356);

    const options = {
      center:location,
      zoom:10,
      streetViewControl:false,
      mapTypeId:'roadmap',
      fullscreenControl: false
    };

    const map = new google.maps.Map(this.mapRef.nativeElement,options);
    this.addMarker(location,map);

    let input = <HTMLInputElement>document.getElementsByClassName('searchbar-input')[0];
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    console.log(searchBox);
    /*
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
      searchBox.setBounds(map.getBounds());
    });

    searchBox.addListener('places_changed', function() {
      var places = searchBox.getPlaces();
      console.log(places);
    });
    */
  }

  addMarker(position,map) {
    return new google.maps.Marker({
      position,
      map
    });
  }

  getAddress(place: Object) {       
    this.address = place['formatted_address'];
    var location = place['geometry']['location'];
    var lat =  location.lat();
    var lng = location.lng();
    console.log('Address Object', place);
  }
}
