import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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
  pontos:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private sqlite: SQLite) {
    
  }

  ionViewDidEnter() {
    console.log('ionViewDidLoad HorariosPage');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HorariosPage');
  }

  abrirHorarios(ponto_id){

  }
}
