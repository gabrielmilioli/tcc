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
  usuario_id:any;
  loading:any;
  response:any;
  amigo_id:any;
  mensagens_total = 0;
  mensagens:Array<{eu: boolean, mensagem_id: string, mensagem: string, data_registro: string, visualizado: string, visualizado_data: string }>;
  usuario:{id: string, nome: string, email: string, foto: string, register_date: string, 
    amizade_aceita:boolean, solicitou_amizade:boolean};
  amigo:{id: string, nome: string, email: string, foto: string, register_date: string, 
    amizade_aceita:boolean, solicitou_amizade:boolean};

  constructor(public navCtrl: NavController, public navParams: NavParams, public userService: UserProvider,
    public alertCtrl: AlertController, public loadingCtrl: LoadingController, public authService: AuthServiceProvider) {
    this.usuario_id = this.authService.get_user_id();
    this.amigo_id = this.navParams.get('id');
  }

  enviarMensagem(){
    let mensagem = this.inputMensagem;
    mensagem = btoa(mensagem);
    this.userService.set_usuarios_mensagens(this.usuario_id, this.amigo_id, mensagem).then((result) => {
      console.log(result);
      this.response = result;
      if(this.response.status === 'success'){
        this.carregaMensagens(this.amigo_id);
      }else{ 
        this.alert('Atenção', this.response.data);
      }
    }).catch(error=>{
      this.alert('Atenção', error.message);
    });
  }

  carregaMensagens(amigo_id){
    this.userService.get_usuarios_mensagens(this.usuario_id, amigo_id).then((result) => {
      console.log(result);
      this.response = result;
      if(this.response.status === 'success'){
        this.mensagens = this.response.data.mensagens;
        this.mensagens_total = this.response.data.mensagens_total;
      }else{ 
        this.alert('Atenção', this.response.data);
      }
    }).catch(error=>{
      this.alert('Atenção', error.message);
    });
  }

  carregaPerfis(usuario_id, amigo_id){
    this.userService.get_usuario(usuario_id, null).then((result) => {
      console.log(result);
      this.response = result;
      if(this.response.status === 'success'){
        console.log(this.response.data);
        this.usuario = this.response.data;
      }else{ 
        this.alert('Atenção', this.response.data);
      }
    }).catch(error=>{
      this.alert('Atenção', error);
    });

    this.userService.get_usuario(amigo_id, null).then((result) => {
      console.log(result);
      this.response = result;
      if(this.response.status === 'success'){
        console.log(this.response.data);
        this.amigo = this.response.data;
      }else{ 
        this.alert('Atenção', this.response.data);
      }
    }).catch(error=>{
      this.alert('Atenção', error);
    });
  }

  ionViewDidEnter(){
    this.loading = this.loadingCtrl.create({
      content: 'Carregando conversa...'
    });
    this.loading.present();

    this.carregaPerfis(this.usuario_id, this.amigo_id);

    this.carregaMensagens(this.amigo_id);

    this.loading.dismiss();
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
