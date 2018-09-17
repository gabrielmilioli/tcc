import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'Rxjs/rx';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, Content } from 'ionic-angular';
import { AuthServiceProvider } from './../../providers/auth-service/auth-service';
import { UserProvider } from './../../providers/user/user';
import { MensagensProvider } from '../../providers/mensagens/mensagens';

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
  @ViewChild(Content) content: Content;
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
  intervalo:Subscription;

  constructor(public navCtrl: NavController, public navParams: NavParams, public userService: UserProvider,
    public alertCtrl: AlertController, public loadingCtrl: LoadingController, public authService: AuthServiceProvider, 
    public msgService: MensagensProvider) {
    this.usuario_id = this.authService.get_user_id();
    this.amigo_id = this.navParams.get('id');
  }

  fim(mensagem_id){
    if(this.mensagens){
      /*
      console.log('mensagens', this.mensagens);
      let mensagem = this.mensagens[this.mensagens.length - 1];
      console.log(mensagem_id +" - "+mensagem.mensagem_id);
      setTimeout(() => {
        this.content.scrollToBottom(0);
      }, 1000);*/
    }
  }

  enviarMensagem(){
    let mensagem = this.inputMensagem;
    if(mensagem.length === 0){
      return false;
    }

    let today = new Date();
    let nova_mensagem = {
      eu: true, 
      mensagem_id: '', 
      mensagem: mensagem, 
      data_registro: ''+today, 
      visualizado: '', 
      visualizado_data: ''
    };

    this.mensagens.push(nova_mensagem);

    mensagem = btoa(mensagem);
    this.inputMensagem = "";
    this.msgService.set_usuarios_mensagens(this.usuario_id, this.amigo_id, mensagem).then((result) => {
      console.log(result);
      this.response = result;
      if(this.response.status === 'success'){
        this.carregaMensagens(this.amigo_id);
      }else{ 
        this.alert('Atenção', this.response.data);
      }
    }).catch(error=>{
      console.log(error);
      this.alert('Atenção', error.message);
    });
  }

  carregaMensagens(amigo_id){
    console.log('entrou');
    this.msgService.get_usuarios_mensagens(this.usuario_id, amigo_id).then((result) => {
      console.log(result);
      this.response = result;
      if(this.response.status === 'success'){
        this.response.data.mensagens.sort(function (a, b) {
          return a.data_registro.localeCompare(b.data_registro);
        });
        this.mensagens = this.response.data.mensagens;
        this.mensagens_total = this.response.data.mensagens_total;
        //this.fim(null);
      }else{ 
        this.alert('Atenção', this.response.data);
      }
    }).catch(error=>{
      this.alert('Atenção', error.message);
    });
  }

  carregaPerfis(usuario_id, amigo_id){
    this.userService.get_usuario(usuario_id, null).then((result) => {
      this.response = result;
      if(this.response.status === 'success'){
        this.usuario = this.response.data;
      }else{ 
        this.alert('Atenção', this.response.data);
      }
    }).catch(error=>{
      this.alert('Atenção', error);
    });

    this.userService.get_usuario(amigo_id, null).then((result) => {
      this.response = result;
      if(this.response.status === 'success'){
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

    this.msgService.set_usuarios_mensagens_visualizado(this.usuario_id, this.amigo_id).then((result) => {
      console.log(result);
      this.response = result;
      if(this.response.status === 'success'){
        this.carregaMensagens(this.amigo_id);
      }else{ 
        this.alert('Atenção', this.response.data);
      }
    }).catch(error=>{
      console.log(error);
      this.alert('Atenção', error.message);
    });

    this.carregaPerfis(this.usuario_id, this.amigo_id);

    this.carregaMensagens(this.amigo_id);

    this.loading.dismiss();

    this.intervalo = Observable.interval(2000).subscribe(()=>{
      this.carregaMensagens(this.amigo_id);
    });
  }

  ionViewDidLeave(){
    this.intervalo.unsubscribe();
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
