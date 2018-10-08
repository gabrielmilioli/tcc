import { PlacePage } from './../place/place';
import { PontosProvider } from './../../providers/pontos/pontos';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, Searchbar, Content } from 'ionic-angular';
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
  @ViewChild(Content) content: Content;
  pontos:Array<{id: string, nome: string, endereco: string, data_registro: string, imagem: string, favorito: string, class: any }>;
  loading:any;
  response:any;
  tab:string="t";
  inputBuscar:string;
  mostrarBuscar:boolean=false;
  todosPontos:Array<{id: string, nome: string, endereco: string, data_registro: string, imagem: string, favorito: string, class: any }>;
  meusPontos:Array<{id: string, nome: string, endereco: string, data_registro: string, imagem: string, favorito: string, class: any }>;
  escolherPontos:string = 't';

  constructor(public navCtrl: NavController, public navParams: NavParams, public authService: AuthServiceProvider,
    public alertCtrl: AlertController, public loadingCtrl: LoadingController, public ponto: PontosProvider) {
      this.escolherPontos = "t";
  }

  ionViewWillEnter(refresher = null){
    this.loading = this.loadingCtrl.create({
      content: 'Carregando pontos...'
    });
    this.loading.present();

    this.carregaPontos();
    
    if(refresher){
      refresher.complete();
    }
  }

  buscar(e){
    let val = e.target.value;
    let results = [];
    var buscarPor = val;
    
    if(this.escolherPontos === "t"){
      for (var i=0 ; i < this.todosPontos.length ; i++)
      {
        var nome = this.todosPontos[i].nome;
        if(nome.indexOf(buscarPor) != -1){
          results.push(this.todosPontos[i]);
        }
      }
    }else{
      for (var i=0 ; i < this.meusPontos.length ; i++)
      {
        var nome = this.meusPontos[i].nome;
        if(nome.indexOf(buscarPor) != -1){
          results.push(this.meusPontos[i]);
        }
      }
    }
    
    this.pontos = results;
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
    var id = this.authService.get_user_id();
    if(this.escolherPontos === "s"){
      if(id){
        this.ponto.get_usuarios_pontos(id).then((result) => {
          this.response = result;
          if(this.response.status === 'success'){
            this.meusPontos = this.response.data;
            let length = 3;
            this.pontos = [];
            for (let i = 0; i < length; i++) {
              if(this.meusPontos[i]){
                this.pontos.push( this.meusPontos[i] );
              }
            }
            this.loading.dismiss();
          }else{ 
            this.alert('Atenção', this.response.data);
          }
        }).catch(error=>{
          console.log(error);
          this.alert('Atenção', error);
        });
      }
    }else{
      this.ponto.get_pontos(id).then((result) => {
        this.response = result;
        if(this.response.status === 'success'){
          this.todosPontos = this.response.data;
          let length = 3;
          this.pontos = [];
          for (let i = 0; i < length; i++) {
            if(this.todosPontos[i]){
              this.pontos.push( this.todosPontos[i] );
            }
          }
          this.loading.dismiss();
        }else{ 
          this.alert('Atenção', this.response.data);
        }
      }).catch(error=>{
        console.log(error);
        this.alert('Atenção', error);
      });
    }
    
  }

  visualizarPonto(id, nome){
    this.navCtrl.push(PlacePage, {"id":id, "nome":nome});
  }

  favoritarPonto(ponto_id, index){
    var id = this.authService.get_user_id();
    if(id){
      this.ponto.set_usuarios_pontos(id, ponto_id).then((result) => {
        this.response = result;
        if(this.response.status === 'success'){
          this.ionViewWillEnter();
          this.scrollTo(index);
        }else{ 
          this.alert('Atenção', this.response.data);
        }
      }).catch(error=>{
        console.log(error);
        this.alert('Atenção', error);
      });
    }
    return false;
  }

  scrollTo(element:string) {
    let yOffset = document.getElementById(element).offsetTop;
    this.content.scrollTo(0, yOffset, 500)
  }

  carregarMais(infiniteScroll){
    setTimeout(() => {
      let length = 3;
      if(this.pontos.length){
        length = this.pontos.length + 3;
      }
      
      for (let i = this.pontos.length; i <= length; i++) {
        if(this.todosPontos[i]){
          this.pontos.push( this.todosPontos[i] );
        }
      }

      infiniteScroll.complete();
    }, 500);
  }

  ionViewDidLoad() {
    
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
