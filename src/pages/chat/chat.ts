import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ChatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {
  message:string;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  sendMessage(){
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatPage');
  }

}
