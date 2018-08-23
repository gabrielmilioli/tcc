import { PlacePage } from './../place/place';
import { PontosProvider } from './../../providers/pontos/pontos';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
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
  pontos:Array<{id: string, nome: string, endereco: string, data_registro: string, imagem: string, favorito: string }>;
  loading:any;
  response:any;
  tab:string="t";

  constructor(public navCtrl: NavController, public navParams: NavParams, public authService: AuthServiceProvider,
    public alertCtrl: AlertController, public loadingCtrl: LoadingController, public ponto: PontosProvider) {
  }

  ionViewDidEnter(){
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
  }

  carregaPontos(){
    this.tab="t";
    var id = this.authService.get_user_id();
    this.ponto.get_pontos(id).then((result) => {
      //console.log(result);
      this.response = result;
      if(this.response.status === 'success'){
        this.pontos = this.response.data;
      }else{ 
        this.alert('Erro', this.response.data);
      }
    }).catch(error=>{
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
        }else{ 
          this.alert('Erro', this.response.data);
        }
      }).catch(error=>{
        this.alert('Erro', error);
      });
    }
  }

  visualizaPonto(id, nome){
    this.navCtrl.push(PlacePage, {"id":id, "nome":nome});
  }

  favoritarPonto(id){
    console.log("favoritar = "+id);
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
