import { PlacePage } from './../place/place';
import { Geolocation } from '@ionic-native/geolocation';
import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ModalController } from 'ionic-angular';
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
  address:string;
  lat:any;
  lon:any;
  response:any;
  places = [];
  loading:any;
  track:boolean=false;
  trackClass:string="primary";
  mostrarBuscar:boolean=false;
  adicionar:boolean=false;
  adicionarClass:string="primary";
  enderecoCentro:string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public geolocation: Geolocation, public authService: AuthServiceProvider,
  public alertCtrl: AlertController, public loadingCtrl: LoadingController, public map: GoogleMaps, public zone: NgZone, public modalCtrl: ModalController) {
    //console.log(map);
    (window as any).angularComponent = { GoDetail: this.GoDetail, zone: zone };
  }

  GoDetail = (id: any, nome: any) => { 
    this.zone.run(() => { 
      this.navCtrl.push(PlacePage, {"id":id, "nome":nome});
    }); 
  }

  ionViewDidEnter(){
    this.ionViewDidLoad();
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

  adicionarPonto(){
    if(!this.adicionar){
      this.adicionar=true;
      this.adicionarClass="lightPrimary";
    }else{
      this.adicionar=false;
      this.adicionarClass="primary";
    }
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

  toggleBusca(){
    if (this.mostrarBuscar) {
      this.mostrarBuscar = false;
    } else {
      this.mostrarBuscar = true;
    }
  }

  displayMap() {
    this.mostrarBuscar = false;
    this.adicionar=false;
    this.adicionarClass="primary";
    this.track=false;
    this.trackClass="primary";

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
      //scrollwheel: false,
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
    
    
    let input = <HTMLInputElement>document.getElementById('searchbar');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    map.addListener('bounds_changed', function() {
      searchBox.setBounds(map.getBounds());
    });

    google.maps.event.addListener(map, 'center_changed', () => {
      //console.log(map.getCenter().lat());
      //console.log(map.getCenter().lng());
      this.enderecoCentro = map.getCenter().lat()+","+map.getCenter().lng();
    });

    searchBox.addListener('places_changed', function() {
      var places = searchBox.getPlaces();
      console.log(places);
    });

  }

  criarPonto() {
    var geocoder = new google.maps.Geocoder;
    var input = this.enderecoCentro;
    var latlngStr = input.split(',', 2);
    var latlng = {lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1])};
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
            estabelecimento: "",
            lat: latlngStr[0],
            lon: latlngStr[1]
          };

          result.address_components.forEach(element => {
            let types = element.types;
            let long_name = element.long_name;
            //let short_name = element.short_name;
            if(types.includes('country')){
              endereco.pais = long_name;
            }else if(types.includes('administrative_area_level_1')){
              endereco.estado = long_name;
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
              endereco.estabelecimento = long_name;
            }
            
          });

          if(!criciuma){
            this.alert('Erro', 'Escolha um endereço válido em Criciúma');
          }else{
            console.log(endereco);
            this.alert('Informação', 'Localização selecionada: ' + result.formatted_address);
          }

        } else {
          this.alert('Erro', 'Nenhum endereço encontrado');
        }
      } else {
        this.alert('Erro', 'Geocoder falhou: ' + status);
      }
    });
    this.adicionarPonto();
  }

  addMarkers(places, map){
    for (var i = 0; i < places.length; i++) {
      var place = places[i];
      //var address = place.address;
      var id = parseInt(place.id);
      var lat = place.lat;
      var lon = place.lon;
      var nome = place.nome;
      var imagem = place.imagem;

      var latlon = lat+','+lon;
      var commaPos = latlon.indexOf(',');

      var coordinatesLat = parseFloat(lat.substring(0, commaPos));
      var coordinatesLong = parseFloat(latlon.substring(commaPos + 1, latlon.length));
      //var type = place.type;
      //var register_date = place.register_date;
      

      var infoBox = '<div class="info-box">'+
      '<div class="info-header">'+
      '<img src="'+imagem+'">'+
      '</div>'+
      '<div class="info-content">'+
      '<h6>'+nome+'</h6>'+
      '<div class="info-content-plus">'+
      '<p>9 linhas</p>'+
      '<p>10 comentários</p>'+
      '<p>6 favoritos</p>'+
      '</div>'+
      '</div>'+
      '<div class="info-footer">'+
      '<button ion-button full onclick="window.angularComponent.GoDetail('+id+', \''+nome+'\');">'+
      '<span class="button-inner">Visualizar</span>'+
      '</button>'+
      '</div>'+
      '</div>';

      var infowindow = new google.maps.InfoWindow({
        content: infoBox,
        maxWidth: 200
      });

      var image = {
        url: 'http://tcc.pelainternetsistemas.com.br/app/images/marker-20.png',
        // This marker is 20 pixels wide by 32 pixels high.
        size: new google.maps.Size(20, 28),
        // The origin for this image is (0, 0).
        origin: new google.maps.Point(0, 0),
        // The anchor for this image is the base of the flagpole at (0, 32).
        anchor: new google.maps.Point(0, 28)
      };

      var marker = new google.maps.Marker({
        position: {lat: coordinatesLat, lng: coordinatesLong},
        map: map,
        title: nome,
        animation: 'DROP',
        zIndex: id,
        id: id,
        icon: image
      });

      google.maps.event.addListener(marker, 'click', (function(marker, app) {
        return function() {
          //app.irPonto(marker.get("id"), marker.get("title"));
          infowindow.open(map, marker);
        }
      })(marker, this));

    }
  }

  irPonto(id, nome){
    let alert = this.alertCtrl.create();
    alert.setTitle(nome);
    alert.setMessage('Message <strong>text</strong><br>'+
    '<p>3<ion-icon name="bus"></ion-icon></p>'+
    '<p>8 <ion-icon name="text"></ion-icon></p>'+
    '<p>9 <ion-icon name="heart"></ion-icon></p>'
    );
    alert.addButton({
      text: 'Voltar',
      role: 'cancel',
      handler: () => {
        console.log('Confirm Cancel');
      }
    });
    alert.addButton({
      text: 'Ver',
      handler: () => {
        this.navCtrl.push(PlacePage, {"id":id, "nome":nome});
      }
    });

    alert.present();  
  }

  loadPlace(id, nome){
    this.navCtrl.push(PlacePage, {"id":id, "nome":nome});
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