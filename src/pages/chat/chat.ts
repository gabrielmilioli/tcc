import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { AuthServiceProvider } from './../../providers/auth-service/auth-service';
import { UserProvider } from './../../providers/user/user';

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
  inputMensagem:string;
  usuarioLogadoId:any;
  loading:any;
  response:any;
  amigo_id:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public userService: UserProvider,
    public alertCtrl: AlertController, public loadingCtrl: LoadingController, public authService: AuthServiceProvider) {
    this.usuarioLogadoId = this.authService.get_user_id();
    this.amigo_id = this.navParams.get('id');
  }

  enviarMensagem(){
    console.log(this.inputMensagem);
  }

  carregaMensagens(amigo_id, usuario_id){
    
  }

  
  
  ionViewDidEnter(){
    this.loading = this.loadingCtrl.create({
      content: 'Carregando conversa...'
    });
    this.loading.present();

    var usuario_id = this.authService.get_user_id();
    
    this.carregaMensagens(this.amigo_id, usuario_id);

    this.loading.dismiss();
  }


}
