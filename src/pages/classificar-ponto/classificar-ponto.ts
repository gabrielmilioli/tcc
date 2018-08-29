import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ClassificarPontoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-classificar-ponto',
  templateUrl: 'classificar-ponto.html',
})
export class ClassificarPontoPage {
  ponto_id:any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.ponto_id = this.navParams.get("ponto_id");
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter ClassificarPontoPage');

    // carregar classificacoes

  }

}
