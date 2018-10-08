import { AmigosPage } from './../amigos/amigos';
import { ChatPage } from './../chat/chat';
import { Component } from '@angular/core';
import { ModalController, IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { AuthServiceProvider } from './../../providers/auth-service/auth-service';
import { Observable } from 'Rxjs/rx';
import { Subscription } from "rxjs/Subscription";

/**
 * Generated class for the MessagesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-messages',
  templateUrl: 'messages.html',
})
export class MessagesPage {
  messages:any=[{}];
  loading: any;
  response: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public authService: AuthServiceProvider, 
    public alertCtrl: AlertController, public loadingCtrl: LoadingController, public modalCtrl: ModalController) {
    
  }

  ionViewDidLoad() {
    this.loading = this.loadingCtrl.create({
      content: 'Carregando mensagens...'
    });
    this.loading.present();
    
    this.loadMessages();
    Observable.interval(2000).subscribe(()=>{
      this.loadMessages();
    });

    this.loading.dismiss();
  }

  loadMessages(){
    
    this.authService.get_messages().then((result) => {
      this.response = result;
      if(this.response.status === 'success'){
        this.messages = this.response.data;
      }else{ 
        this.alert('Atenção', this.response.data);
      }
    }).catch(error=>{
      this.alert('Atenção', error.message);
    });
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

  openChat(amigo_id){
    this.navCtrl.push(ChatPage);
  }

  newChat(){
    let AmigosModal = this.modalCtrl.create(AmigosPage, { userId: this.authService.get_user_id() });
    AmigosModal.onDidDismiss(data => {
      if(data.amigo_id){
        //this.alert("Informações", "onDidDismiss : "+data.friend_id);
        this.openChat(data.amigo_id);
      }
    });
    AmigosModal.present();
  }

}
