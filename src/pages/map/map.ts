import { PontosProvider } from './../../providers/pontos/pontos';
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
  pontos = [];
  loading:any;
  mostrarBuscar:boolean=false;
  adicionar:boolean=false;
  adicionarClass:string="primary";
  enderecoCentro:string;
  mapa:any;
  marcadores = [];
  mostrarInfo:boolean=false;
  infoPonto:any;
  linhas:any;

  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;
  GoogleAutocomplete = new google.maps.places.AutocompleteService();
  enderecos = [];
  autocomplete:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public geolocation: Geolocation, public authService: AuthServiceProvider,
  public alertCtrl: AlertController, public loadingCtrl: LoadingController, public map: GoogleMaps, public zone: NgZone, public pontoService: PontosProvider) {
    //console.log(map);
  }

  ionViewDidLoad(){
    this.criarMapa();
    this.carregarLinhas();
  }

  ionViewWillEnter(){
    this.deletarMarcadores();
    this.carregarPontos();
  }

  resetarLinhas(){
    var myDiv = document.getElementById('linhas');
    myDiv.scrollLeft = 0;
    this.ionViewWillEnter();
    this.limparPercurso();
  }

  mostrarPontoLinhas(linha_id){
    this.pontos = [];
    this.pontoService.get_linha_pontos(linha_id).then((result) => {
      console.log("get_linha_pontos", result);
      this.response = result;
      if(this.response.status === 'success'){
        this.pontos = this.response.data;
        this.deletarMarcadores();
        this.carregarPontos();
        this.mostrarRota(linha_id);
      }else{ 
        this.alert('Atenção', this.response.data);
      }
    }).catch(error=>{
      this.alert('Atenção', error.message);
    });
  }

  carregarLinhas(){
    this.pontoService.get_linhas(null).then((result) => {
      this.response = result;
      if(this.response.status === 'success'){
        this.linhas = this.response.data;
      }else{ 
        this.alert('Atenção', this.response.data);
      }
    }).catch(error=>{
      this.alert('Atenção', error.message);
    });
  }

  updateSearchResults(){
    if (this.endereco == '') {
      this.enderecos = [];
      return;
    }

    var options = {
      input: this.endereco,
      types: ['establishment'],
      componentRestrictions: {country: 'BR'}
    };

    this.GoogleAutocomplete.getPlacePredictions(options,
    (predictions, status) => {
      this.enderecos = [];
      console.log(predictions);
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
    
    this.lat = -28.6728;
    this.lon = -49.3734;

    this.geolocation.getCurrentPosition().then(pos => {
      this.lat = pos.coords.latitude;
      this.lon = pos.coords.longitude;
    }).catch((error) => {
      this.alert('Atenção', error);
    });

    const location = new google.maps.LatLng(this.lat,this.lon);

    const options = {
      center:location,
      zoom:14,
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
      //console.log(this.mapa.getCenter().lat() + ', ' +this.mapa.getCenter().lng());
      this.enderecoCentro = this.mapa.getCenter().lat()+","+this.mapa.getCenter().lng();
    });

    var defaultBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(this.lat, this.lon)
    );

    const complete_options = {
      types: ['establishment'],/*
      componentRestrictions: {country: 'BR', state: 'SC', city: 'Criciúma'},*/
      bounds: defaultBounds
    };

    let elem = <HTMLInputElement>document.getElementsByClassName('searchbar-input')[0];
    let elem1 = <HTMLInputElement>document.getElementsByClassName('searchbar-input')[1];
    this.autocomplete = new google.maps.places.Autocomplete(elem, complete_options);
    this.autocomplete = new google.maps.places.Autocomplete(elem1, complete_options);

    google.maps.event.addListener(this.autocomplete, 'place_changed', () => {
      let place = this.autocomplete.getPlace();
      let latitude = place.geometry.location.lat();
      let longitude = place.geometry.location.lng();
      console.log(latitude + ", " + longitude);
      this.centralizar(latitude, longitude);
    });

    this.carregarPontos();

    if(this.loading){
      this.loading.dismiss();
    }
  }
  
  limparPercurso(){
    console.log(this.directionsDisplay);
    this.directionsDisplay.set('directions', null);
    this.directionsDisplay = null;
  }
    
  adicionarDirecao(itinerarios){
    this.loading = this.loadingCtrl.create({
      content: 'Carregando rota...'
    });
    this.loading.present();
    
    this.directionsDisplay.setMap(this.mapa);
    var interval = 8; // upper bound for usage limits in google directions API is 8
    var startIndex = 0;
    var maxmimumIndex = itinerarios.length - 1; // Total number of waypoints in this route
    var partialEndIndex = interval - 1; // end waypoint at start
    var iteration = 0; // loop controler
    var resultSet = new Array();
    var directionsDisplayList = new Array();
    var resultsCached = 0;
    var bounds = new google.maps.LatLngBounds();
  
    do { //do...while to iterate over multiple requests
      iteration++;
      if (iteration > 1) {
        startIndex = startIndex + interval;
        partialEndIndex = startIndex + interval;
      }
  
      this.directionsDisplay = new google.maps.DirectionsRenderer({
        preserveViewport: true,
        markerOptions: {
          visible: false
        }
      });
      directionsDisplayList.push(
        this.directionsDisplay
      );
  
      directionsDisplayList[iteration - 1].setMap(this.mapa);
  
      var origin = itinerarios[startIndex];
      var destination = partialEndIndex < maxmimumIndex ? itinerarios[partialEndIndex] : itinerarios[maxmimumIndex];
      let waypoints = new Array();
  
      for (var i = startIndex + 1; i < partialEndIndex; i++) {
        if (i > maxmimumIndex) {
          break;
        }
  
        waypoints.push({
          location: itinerarios[i],
          stopover: true
        });          
      }
  
      var request = {
        origin: origin,
        destination: destination,
        waypoints: waypoints,
        provideRouteAlternatives: false,
        travelMode: google.maps.TravelMode.WALKING,
        unitSystem: google.maps.UnitSystem.METRIC
      }
      var mapa = this.mapa;
      this.directionsService.route(request, function(result, status) {
        if (status == google.maps.DirectionsStatus.OK) {
          //Cashe the results to render directions//
          
          resultSet.push(result);
          if (resultSet.length == iteration) {
            var bounds = new google.maps.LatLngBounds();
            for (var i = 0; i < iteration; i++) {
              directionsDisplayList[i].setDirections(resultSet[i]);
              if (i == 0) {
                bounds = resultSet[i].routes[0].bounds;
              } else {
                bounds.union(resultSet[i].routes[0].bounds);
              }
            }
            mapa.fitBounds(bounds);
          }
        }
      });
  
    } while (partialEndIndex <= maxmimumIndex);
    
    this.loading.dismiss();
  }

  mostrarRota(id) {
    let itinerarios = [];
    this.pontoService.get_linhas_itinerario(id).then((result) => {
      console.log("get_linhas_itinerario", result);
      this.response = result;
      if(this.response.status === 'success'){
        itinerarios = this.response.data;
        this.adicionarDirecao(itinerarios);
      }else{ 
        this.alert('Atenção', this.response.data);
      }
    }).catch(error=>{
      this.alert('Atenção', error.message);
    });
  }

  carregarPontos(){
    this.authService.get_places().then((result) => {
      //console.log(result);
      this.response = result;
      if(this.response.status === 'success'){
        this.pontos = this.response.data;
        this.adicionarMarcadores(this.pontos);
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

  adicionarMarcadores(pontos){
    let map = this.mapa;
    this.marcadores = [];
    for (var i = 0; i < pontos.length; i++) {
      var ponto = pontos[i];
      //var address = ponto.address;
      var id = parseInt(ponto.id);
      var lat = ponto.lat;
      var lon = ponto.lon;
      var nome = ponto.nome;
      var imagem = ponto.imagem;
      //console.log("marcador id = "+id);

      lat = parseFloat(lat);
      lon = parseFloat(lon);

      var image = {
        //url: 'http://tcc.pelainternetsistemas.com.br/app/images/marker.png?1123123123',
        url: 'http://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi2_hdpi.png',
        // This marker is 20 pixels wide by 32 pixels high.
        //size: new google.maps.Size(9, 14.5),
        size: new google.maps.Size(20, 32),
        //scaledSize: new google.maps.Size(20, 32),
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(0, 32) // anchor
      };

      var marker = new google.maps.Marker({
        position: {lat: lat, lng: lon},
        map: map,
        title: nome,
        animation: 'DROP',
        zIndex: id,
        id: id,
        //icon: image,
        imagem: imagem
      });

      google.maps.event.addListener(marker, 'click', (function(marker, app) {
        return function() {
          let id = marker.get("id");
          let nome = marker.get("title");
          let imagem = marker.get("imagem");
          let position = marker.get("position");
          let lat = position.lat;
          let lng = position.lng;
          app.mostrarInformacoes(id, nome, imagem);
          app.centralizar(lat, lng);
        }
      })(marker, this));

      this.marcadores.push(marker);
    }
  }

  irPonto(id, nome){
    this.navCtrl.push(PlacePage, {"id":id, "nome":nome});
  }

  mostrarInformacoes(id, nome, imagem){
    this.infoPonto = {
      "id": id,
      "nome": nome,
      "imagem": imagem
    };
    this.mostrarInfo = true;
  }

  esconderInformacoes(){
    this.mostrarInfo = false;
    this.infoPonto = {};
    this.limparPercurso();
  }

  centralizar(lat = null, lon = null){
    this.loading = this.loadingCtrl.create({
      content: 'Buscando localização...'
    });
    this.loading.present();
    this.enderecos = [];
    
    if(!lat && !lon){
      this.geolocation.getCurrentPosition().then(pos => {
        this.lat = pos.coords.latitude;
        this.lon = pos.coords.longitude;

        this.loading.dismiss();
        this.mapa.setCenter(new google.maps.LatLng(this.lat, this.lon));
        this.mapa.setZoom(16);
      }).catch((error) => {
        this.alert('Atenção', error);
      });
    }else{
      this.loading.dismiss();
      this.mapa.setCenter(new google.maps.LatLng(lat, lon));
      this.mapa.setZoom(16);
    }
    
    setTimeout(() => {
      if(this.loading){
        this.loading.dismiss();
      }
    }, 10000);
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

  carregaPontos(){
    var id = this.authService.get_user_id();
    this.pontoService.get_pontos(id).then((result) => {
      //console.log(result);
      this.response = result;
      if(this.response.status === 'success'){
        this.pontos = this.response.data;
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
            app.navCtrl.push(NovoPontoPage, {"endereco":endereco});
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