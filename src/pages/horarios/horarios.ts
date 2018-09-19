import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { PontosProvider } from '../../providers/pontos/pontos';

/**
 * Generated class for the HorariosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-horarios',
  templateUrl: 'horarios.html',
})
export class HorariosPage {
  linha_id:any;
  response:any;
  loading:any;
  horarios:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public pontosProvider: PontosProvider,
    public alertCtrl: AlertController, public loadingCtrl: LoadingController) {
    this.linha_id = this.navParams.get("linha_id");
  }

  ionViewDidEnter() {
    this.loading = this.loadingCtrl.create({
      content: 'Carregando linhas...'
    });
    this.loading.present();
    this.horarios = [];
    this.pontosProvider.get_linhas(this.linha_id).then((result) => {
      console.log(result);
      this.response = result;
      if(this.response.status === 'success'){
        this.horarios = this.response.data;
      }else{ 
        this.alert('Atenção', this.response.data);
      }
    }).catch(error=>{
      console.log(error);
      this.alert('Atenção', error);
    });

    this.loading.dismiss();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HorariosPage');
  }

  abrirHorarios(linha_id){

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
