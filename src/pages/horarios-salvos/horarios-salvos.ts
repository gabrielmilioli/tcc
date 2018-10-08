import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

/**
 * Generated class for the HorariosSalvosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-horarios-salvos',
  templateUrl: 'horarios-salvos.html',
})
export class HorariosSalvosPage {
  horarios:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private sqlite: SQLite) {
  }

  ionViewDidEnter(){
    this.carregaHorarios();
  }

  ionViewDidLoad() {
    
  }

  carregaHorarios(){
    this.sqlite.create({
      name: 'talkingbus.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('CREATE TABLE IF NOT EXISTS horarios(id INTEGER PRIMARY KEY, ponto_id INTEGER, horario TEXT)', [])
      .then(res => console.log('Executed SQL'))
      .catch(e => console.log(e));

      db.executeSql('SELECT * FROM horarios', [])
        .then(res => {
          if(res.rows.length > 0) {
            console.log(res.rows);
          }
        })
        .catch(e => {
          console.log(e);
        });
    }).catch(e => {
      console.log(e);
    });
  }

}
