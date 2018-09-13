import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { PontosProvider } from '../../providers/pontos/pontos';

/**
 * Generated class for the LinhasPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-linhas',
  templateUrl: 'linhas.html',
})
export class LinhasPage {
  ponto_id:any;
  ponto_nome:string;
  response:any;
  loading:any;
  linhas:Array<{id: string, nome: string, numero: string, data_ultima_alt: string, itinetarios: any }>;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public pontosProvider: PontosProvider,
    public alertCtrl: AlertController, public loadingCtrl: LoadingController) {
    this.ponto_id = this.navParams.get("id");
    this.ponto_nome = this.navParams.get("nome");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LinhasPage');
  }

  ionViewDidEnter() {
    this.pontosProvider.get_pontos_linhas(this.ponto_id).then((result) => {
      //console.log(result);
      this.response = result;
      if(this.response.status === 'success'){
        this.linhas = this.response.data;
        console.log(this.linhas);
      }else{ 
        this.alert('Atenção', this.response.data);
      }
    }).catch(error=>{
      this.alert('Atenção', error);
    });
  }

  buscarItinetario(itinetario){
    console.log(itinetario);
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
