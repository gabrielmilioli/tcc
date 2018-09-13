import { NovoPontoPage } from './../novo-ponto/novo-ponto';
import { PlacePage } from './../place/place';
import { Geolocation } from '@ionic-native/geolocation';
import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { GoogleMaps } from '../../../node_modules/@ionic-native/google-maps';


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
  @ViewChild('searchbar') searchbarRef:ElementRef;
  endereco:string;
  lat:any;
  lon:any;
  response:any;
  places = [];
  loading:any;
  mostrarBuscar:boolean=false;
  adicionar:boolean=false;
  adicionarClass:string="primary";
  enderecoCentro:string;
  mapa:any;
  marcadores = [];

  GoogleAutocomplete = new google.maps.places.AutocompleteService();
  enderecos = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public geolocation: Geolocation, public authService: AuthServiceProvider,
  public alertCtrl: AlertController, public loadingCtrl: LoadingController, public map: GoogleMaps, public zone: NgZone) {
    //console.log(map);
  }

  ionViewDidLoad(){
    console.log('ionViewDidLoad');
    this.criarMapa();
  }

  ionViewWillEnter(){
    console.log('ionViewDidEnter');
    this.deletarMarcadores();
    this.carregarPontos();
  }

  updateSearchResults(){
    if (this.endereco == '') {
      this.enderecos = [];
      return;
    }

    var options = {
      input: this.endereco,
      types: ['establishment'],
      componentRestrictions: {country: 'BR', state: 'SC', city: 'Criciúma'}
    };

    this.GoogleAutocomplete.getPlacePredictions(options,
    (predictions, status) => {
      this.enderecos = [];
      this.zone.run(() => {
        predictions.forEach((prediction) => {
          //Criciúma
          console.log(prediction);
          if(prediction.description.indexOf('Criciúma - SC') !== -1){
            this.enderecos.push(prediction);
          }
        });
      });
    });
  }

  criarMapa() {
    this.loading = this.loadingCtrl.create({
      content: 'Carregando mapa...'
    });
    this.loading.present();
    
    this.lat = -28.684433;
    this.lon = -49.369194;

    this.geolocation.getCurrentPosition().then(pos => {
      this.lat = pos.coords.latitude;
      this.lon = pos.coords.longitude;
    }).catch((error) => {
      this.alert('Atenção', error);
    });

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
      clickableIcons: false,
      styles: [
        {
          "featureType": "poi",
          "stylers": [
            { "visibility": "off" }
          ]
        }
      ]
    };

    this.mapa = new google.maps.Map(this.mapRef.nativeElement,options);
    
    google.maps.event.addListener(this.mapa, 'center_changed', () => {
      console.log(this.mapa.getCenter().lat() + ', ' +this.mapa.getCenter().lng());
      this.enderecoCentro = this.mapa.getCenter().lat()+","+this.mapa.getCenter().lng();
    });

    this.carregarPontos();

    if(this.loading){
      this.loading.dismiss();
    }
  }
  
  carregarPontos(){
    this.authService.get_places().then((result) => {
      //console.log(result);
      this.response = result;
      if(this.response.status === 'success'){
        this.places = this.response.data;
        this.adicionarMarcadores(this.places);
      }else{ 
        this.alert('Atenção', this.response.data);
      }
    }).catch(error=>{
      this.alert('Atenção', error.message);
    });
  }

  // Sets the map on all markers in the array.
  setMapOnAll(map) {
    if(!this.marcadores){
      return false;
    }
    for (var i = 0; i < this.marcadores.length; i++) {
      this.marcadores[i].setMap(map);
    }
  }

  // Removes the markers from the map, but keeps them in the array.
  esconderMarcadores() {
    this.setMapOnAll(null);
  }

  // Shows any markers currently in the array.
  mostrarMarcadores() {
    this.setMapOnAll(this.mapa);
  }

  // Deletes all markers in the array by removing references to them.
  deletarMarcadores() {
    this.esconderMarcadores();
    this.marcadores = [];
  }

  adicionarMarcadores(places){
    let map = this.mapa;
    this.marcadores = [];
    for (var i = 0; i < places.length; i++) {
      var place = places[i];
      //var address = place.address;
      var id = parseInt(place.id);
      var lat = place.lat;
      var lon = place.lon;
      var nome = place.nome;
      var imagem = place.imagem;
      //console.log("marcador id = "+id);

      lat = parseFloat(lat);
      lon = parseFloat(lon);

      var image = {
        url: 'http://tcc.pelainternetsistemas.com.br/app/images/marker.png',
        // This marker is 20 pixels wide by 32 pixels high.
        size: new google.maps.Size(32, 32),
        // The origin for this image is (0, 0).
        origin: new google.maps.Point(0, 0),
        // The anchor for this image is the base of the flagpole at (0, 32).
        anchor: new google.maps.Point(0, 32)
      };

      var marker = new google.maps.Marker({
        position: {lat: lat, lng: lon},
        map: map,
        title: nome,
        animation: 'DROP',
        zIndex: id,
        id: id,
        icon: image,
        imagem: imagem
      });

      google.maps.event.addListener(marker, 'click', (function(marker, app) {
        return function() {
          let id = marker.get("id");
          let nome = marker.get("title");
          let imagem = marker.get("imagem");
          console.log("touch id = "+id);
          //console.log("touch nome = "+nome);

          var elementid = 'infobox'+id;
          let infoBox = '<div class="info-box" id="'+elementid+'">'+
          '<div class="info-header">'+
          '<img src="'+imagem+'">'+
          '</div>'+
          '<div class="info-content">'+
          '<h6>'+nome+'</h6>'+
          '</div>'+
          '<div class="info-footer">'+
          '<button ion-button full>'+
          '<span class="button-inner">Visualizar</span>'+
          '</button>'+
          '</div>'+
          '</div>';
    
          let infowindow = new google.maps.InfoWindow({
            content: infoBox,
            maxWidth: 200
          });
    
          infowindow.open(map, marker);
          
          //app.irPonto(marker.get("id"), marker.get("title"));
          google.maps.event.addListenerOnce(infowindow, 'domready', () => {
            document.getElementById(elementid).addEventListener('click', () => {
              console.log("touch = "+id);
              infowindow.close();
              app.navCtrl.push(PlacePage, {"id":id, "nome":nome});
            });
          });
        }
      })(marker, this));

      this.marcadores.push(marker);
    }
    console.log(this.marcadores);
  }

  centralizar(){
    this.loading = this.loadingCtrl.create({
      content: 'Centralizando...'
    });
    this.loading.present();
    this.enderecos = [];
    
    this.geolocation.getCurrentPosition().then(pos => {
      this.lat = pos.coords.latitude;
      this.lon = pos.coords.longitude;

      this.loading.dismiss();
      this.mapa.setCenter(new google.maps.LatLng(this.lat, this.lon));
    }).catch((error) => {
      this.alert('Atenção', error);
    });
    
    if(this.loading){
      this.loading.dismiss();
    }
  }

  toggleCriar(){
    if(!this.adicionar){
      this.adicionar=true;
      this.adicionarClass="lightPrimary";
      this.esconderMarcadores();
    }else{
      this.adicionar=false;
      this.adicionarClass="primary";
      this.mostrarMarcadores();
    }
    this.enderecos = [];
  }
  
  toggleBusca(){
    if (this.mostrarBuscar) {
      this.mostrarBuscar = false;
    } else {
      this.mostrarBuscar = true;
    }
    this.enderecos = [];
  }

  loadPlaces(){
    this.authService.get_places().then((result) => {
      //console.log(result);
      this.response = result;
      if(this.response.status === 'success'){
        this.places = this.response.data;
      }else{ 
        this.alert('Atenção', this.response.data);
      }
    }).catch(error=>{
      this.alert('Atenção', error);
    });
  }

  criarPonto() {
    var geocoder = new google.maps.Geocoder;
    var input = this.enderecoCentro;
    var latlngStr = input.split(',', 2);
    var latlng = {lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1])};
    var app = this;
    geocoder.geocode({'location': latlng}, function(results, status) {
      if (status === 'OK') {
        if (results[0]) {
          //map.setZoom(11);
          let result = results[0];
          let criciuma = false;
          
          let endereco = {
            pais: "",
            estado: "",
            cidade: "",
            bairro: "",
            rua: "",
            numero: "",
            cep: "",
            nome: "",
            lat: latlngStr[0],
            lon: latlngStr[1],
            endereco_completo: "",
            place_id: ""
          };

          result.address_components.forEach(element => {
            let types = element.types;
            let long_name = element.long_name;
            let short_name = element.short_name;
            if(types.includes('country')){
              endereco.pais = short_name;
            }else if(types.includes('administrative_area_level_1')){
              endereco.estado = short_name;
            }else if(types.includes('administrative_area_level_2')){
              endereco.cidade = long_name;
              if(long_name.indexOf('Criciúma') !== -1){
                criciuma = true;
              }
            }else if(types.includes('sublocality')){
              endereco.bairro = long_name;
            }else if(types.includes('route')){
              endereco.rua = long_name;
            }else if(types.includes('street_number')){
              endereco.numero = long_name;
            }else if(types.includes('postal_code')){
              endereco.cep = long_name;
            }else if(types.includes('establishment')){
              endereco.nome = long_name;
            }
            
          });
          endereco.place_id = result.place_id;
          endereco.endereco_completo = result.formatted_address;
          if(!criciuma){
            this.alert('Atenção', 'Escolha um endereço válido em Criciúma');
          }else{
            console.log(result);
            app.navCtrl.push(NovoPontoPage, {"endereco":endereco});
            //.adicionarPonto();
            //this.alert('Informação', 'Localização selecionada: ' + result.formatted_address);
          }

        } else {
          app.alert('Atenção', 'Nenhum endereço encontrado');
        }
      } else {
        app.alert('Atenção', 'Geocoder falhou: ' + status);
      }
    });
    this.toggleCriar();
  }

  irEndereco(place) {       
    console.log('place', place);
    /*
    this.endereco = place['formatted_address'];
    var location = place['geometry']['location'];
    var lat =  location.lat();
    var lng = location.lng();

    var geocoder = new google.maps.Geocoder;
    var latlng = {lat: parseFloat(lat), lng: parseFloat(lng)};
    var app = this;
    geocoder.geocode({'location': latlng}, function(results, status) {
      console.log(results);
      if (status === 'OK') {
        if (results[0]) {
          
        } else {
          app.alert('Atenção', 'Nenhum endereço encontrado');
        }
      } else {
        app.alert('Atenção', 'Geocoder falhou: ' + status);
      }
    });*/
  }

  alert(title, subTitle) {
    if(this.loading){
      this.loading.dismiss();
    }
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subTitle,
      buttons: ['Ok']
    });
    alert.present();
  }

}