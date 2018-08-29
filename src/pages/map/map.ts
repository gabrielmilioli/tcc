import { PlacePage } from './../place/place';
import { Geolocation } from '@ionic-native/geolocation';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { GoogleMaps, GoogleMapsEvent } from '../../../node_modules/@ionic-native/google-maps';

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
  lat:any;
  lon:any;
  response:any;
  places = [];
  loading:any;
  track:boolean=false;
  trackClass:string="primary";

  constructor(public navCtrl: NavController, public navParams: NavParams, public geolocation: Geolocation, public authService: AuthServiceProvider,
  public alertCtrl: AlertController, public loadingCtrl: LoadingController, public map: GoogleMaps) {
    console.log(map);
  }

  ionViewDidLoad() {
    this.loading = this.loadingCtrl.create({
      content: 'Carregando mapa...'
    });
    this.loading.present();
    this.loadPlaces();

    this.lat = -28.684433;
    this.lon = -49.369194;

    this.geolocation.getCurrentPosition().then(pos => {
      this.lat = pos.coords.latitude;
      this.lon = pos.coords.longitude;
    }).catch((error) => {
      this.alert('Erro', error);
    });

    this.displayMap();

    this.loading.dismiss();
  }

  centralizar(){
    if(!this.track){
      this.track=true;
      this.trackClass="lightPrimary";
    }else{
      this.track=false;
      this.trackClass="primary";
    }
    this.geolocation.getCurrentPosition().then(pos => {
      this.lat = pos.coords.latitude;
      this.lon = pos.coords.longitude;

      this.displayMap();
      
    }).catch((error) => {
      this.alert('Erro', error);
    });
  }

  loadPlaces(){
    this.authService.get_places().then((result) => {
      //console.log(result);
      this.response = result;
      if(this.response.status === 'success'){
        this.places = this.response.data;
      }else{ 
        this.alert('Erro', this.response.data);
      }
    }).catch(error=>{
      this.alert('Erro', error);
    });
  }

  displayMap() {
    
    const location = new google.maps.LatLng(this.lat,this.lon);

    const options = {
      center:location,
      zoom:16,
      streetViewControl:false,
      mapTypeId:'roadmap',
      fullscreenControl: false,
      disableDefaultUI: true,
      mapTypeControl: false,
      scaleControl: false,
      scrollwheel: false,
      styles: [
        {
          "featureType": "poi",
          "stylers": [
            { "visibility": "off" }
          ]
        }
      ]
    };

    const map = new google.maps.Map(this.mapRef.nativeElement,options);
    this.authService.get_places().then((result) => {
      //console.log(result);
      this.response = result;
      if(this.response.status === 'success'){
        this.places = this.response.data;
        this.addMarkers(this.places, map);
      }else{ 
        this.alert('Erro', this.response.data);
      }
    }).catch(error=>{
      this.alert('Erro', error);
    });
    
    
    let input = <HTMLInputElement>document.getElementsByClassName('searchbar-input')[0];
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    map.addListener('bounds_changed', function() {
      searchBox.setBounds(map.getBounds());
    });

    searchBox.addListener('places_changed', function() {
      var places = searchBox.getPlaces();
      console.log(places);
    });

  }

  addMarkers(places, map){
    for (var i = 0; i < places.length; i++) {
      var place = places[i];
      //var address = place.address;
      var id = parseInt(place.id);
      var lat = place.lat;
      var lon = place.lon;
      var nome = place.nome;

      var latlon = lat+','+lon;
      var commaPos = latlon.indexOf(',');

      var coordinatesLat = parseFloat(lat.substring(0, commaPos));
      var coordinatesLong = parseFloat(latlon.substring(commaPos + 1, latlon.length));
      //var type = place.type;
      //var register_date = place.register_date;
      
      var marker = new google.maps.Marker({
        position: {lat: coordinatesLat, lng: coordinatesLong},
        map: map,
        title: nome,
        animation: 'DROP',
        zIndex: id,
        id: id
      });

      google.maps.event.addListener(marker, 'click', (function(marker, app) {
        return function() {
          app.loadPlace(marker.get("id"), marker.get("title"));
        }
      })(marker, this));

    }
  }

  loadPlace(id, nome){
    this.navCtrl.push(PlacePage, {"id":id, "nome":nome});
  }

  setMarkerEvent(marker){
    google.maps.event.addListener(marker, 'click', function() {
      this.navCtrl.push(PlacePage, {"id": marker.get('id'), "nome": marker.get('nome')});
    });
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

  alert(title, subTitle) {
    this.loading.dismiss();
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subTitle,
      buttons: ['Ok']
    });
    alert.present();
  }

}