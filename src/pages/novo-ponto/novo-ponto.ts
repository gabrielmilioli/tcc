import { PontosProvider } from './../../providers/pontos/pontos';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

/**
 * Generated class for the NovoPontoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-novo-ponto',
  templateUrl: 'novo-ponto.html',
})
export class NovoPontoPage {
  endereco:any;
  response:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public pontosProvider: PontosProvider, 
    public authService: AuthServiceProvider) {
    this.endereco = this.navParams.get("endereco");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NovoPontoPage');
  }

  adicionarPonto(endereco) {
    var id = this.authService.get_user_id();
    this.pontosProvider.set_place(id, endereco).then((result) => {
      //console.log(result);
      this.response = result;
      if(this.response.status === 'success'){
        console.log(this.response.data);
      }else{ 
        //this.alert('Erro', this.response.data);
      }
    }).catch(error=>{
      //this.alert('Erro', error);
    });
  }

}
