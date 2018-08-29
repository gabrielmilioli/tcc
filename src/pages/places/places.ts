import { PlacePage } from './../place/place';
import { PontosProvider } from './../../providers/pontos/pontos';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, Searchbar } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';


/**
 * Generated class for the PlacesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-places',
  templateUrl: 'places.html',
})
export class PlacesPage {
  @ViewChild('searchbar', { read: ElementRef }) searchbarRef: ElementRef;
  @ViewChild('searchbar') searchbarElement: Searchbar;
  pontos:Array<{id: string, nome: string, endereco: string, data_registro: string, imagem: string, favorito: string, class: Array<{}> }>;
  loading:any;
  response:any;
  tab:string="t";
  inputBuscar:string;
  mostrarBuscar:boolean=false;
  todosPontos:Array<{id: string, nome: string, endereco: string, data_registro: string, imagem: string, favorito: string, class: Array<{}> }>;

  constructor(public navCtrl: NavController, public navParams: NavParams, public authService: AuthServiceProvider,
    public alertCtrl: AlertController, public loadingCtrl: LoadingController, public ponto: PontosProvider) {
  }

  ionViewDidEnter(refresher = null){
    this.loading = this.loadingCtrl.create({
      content: 'Carregando pontos...'
    });
    this.loading.present();

    if(this.tab==="t"){
      this.carregaPontos();
    }else{
      this.carregaMeusPontos();
    }
    
    this.loading.dismiss();
    if(refresher){
      refresher.complete();
    }
  }

  buscar(e){
    let val = e.target.value;
    let results = [];
    var buscarEm = "nome";
    var buscarPor = val;
    this.pontos = this.todosPontos;
    for (var i=0 ; i < this.todosPontos.length ; i++)
    {
      var nome = this.todosPontos[i].nome;
      console.log("nome: " + nome);
      console.log("buscarPor: " + buscarPor);
      console.log("indexOf: " + nome.indexOf(buscarPor));
      if(nome.indexOf(buscarPor) != -1){
        results.push(this.todosPontos[i]);
      }
    }
    
    this.pontos = results;

    //console.log(this.pontos);
  }

  toggleBusca(){
    if (this.mostrarBuscar) {
      this.mostrarBuscar = false;
    } else {
      this.mostrarBuscar = true;
      this.searchbarElement.setFocus();
    }
  }

  carregaPontos(){
    this.tab="t";
    var id = this.authService.get_user_id();
    this.ponto.get_pontos(id).then((result) => {
      //console.log(result);
      this.response = result;
      if(this.response.status === 'success'){
        this.pontos = this.response.data;
        this.todosPontos = this.pontos;
      }else{ 
        this.alert('Erro', this.response.data);
      }
    }).catch(error=>{
      console.log(error);
      this.alert('Erro', error);
    });
  }

  carregaMeusPontos(){
    this.tab="m";

    var id = this.authService.get_user_id();
    if(id){
      this.ponto.get_usuarios_pontos(id).then((result) => {
        //console.log(result);
        this.response = result;
        if(this.response.status === 'success'){
          this.pontos = this.response.data;
          this.todosPontos = this.pontos;
        }else{ 
          this.alert('Erro', this.response.data);
        }
      }).catch(error=>{
        console.log(error);
        this.alert('Erro', error);
      });
    }
  }

  visualizaPonto(id, nome){
    this.navCtrl.push(PlacePage, {"id":id, "nome":nome});
  }

  favoritarPonto(ponto_id){
    //console.log("favoritar = "+ponto_id);
    var id = this.authService.get_user_id();
    if(id){
      this.ponto.set_usuarios_pontos(id, ponto_id).then((result) => {
        //console.log(result);
        this.response = result;
        if(this.response.status === 'success'){
          let input = <HTMLInputElement>document.getElementById(ponto_id);
          console.log(input);
          this.ionViewDidEnter();
        }else{ 
          this.alert('Erro', this.response.data);
        }
      }).catch(error=>{
        console.log(error);
        this.alert('Erro', error);
      });
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PlacesPage');
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
