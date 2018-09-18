import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'Rxjs/rx';
import { Component, ViewChild, ElementRef } from '@angular/core';
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
  @ViewChild('input') input: ElementRef;
  inputMensagem:string;
  usuario_id:any;
  loading:any;
  response:any;
  amigo_id:any;
  mensagens_total = 0;
  mensagens:Array<{eu: boolean, mensagem_id: string, mensagem: string, data_registro: string, hora_registro: string, visualizado: string, visualizado_data: string }>;
  todasMensagens:Array<{eu: boolean, mensagem_id: string, mensagem: string, data_registro: string, hora_registro: string, visualizado: string, visualizado_data: string }>;
  usuario:{id: string, nome: string, email: string, foto: string, register_date: string, 
    amizade_aceita:boolean, solicitou_amizade:boolean};
  amigo:{id: string, nome: string, email: string, foto: string, register_date: string, 
    amizade_aceita:boolean, solicitou_amizade:boolean};
  intervalo:Subscription;
  offset = 0;
  limit = 10;
  scrollInicial = false;
  infinite = true;

  constructor(public navCtrl: NavController, public navParams: NavParams, public userService: UserProvider,
    public alertCtrl: AlertController, public loadingCtrl: LoadingController, public authService: AuthServiceProvider, 
    public msgService: MensagensProvider, public element: ElementRef) {
    this.usuario_id = this.authService.get_user_id();
    this.amigo_id = this.navParams.get('id');
  }

  resize(resetar = null) {
    let textArea = this.element.nativeElement.getElementsByTagName('textarea')[0];
    textArea.style.height = 'auto';
    if(resetar){
      return false;
    }
    if (textArea.scrollHeight < 100) {
      textArea.style.height = textArea.scrollHeight + "px";
      textArea.style.overflowY = 'hidden';
    } else {
      textArea.style.height = "100px";
      textArea.style.overflowY = 'auto';
    }
    this.scrollToBottom();
  }

  scrollToBottom(last = null) {
    if(last === 1 && !this.scrollInicial){
      this.scrollInicial = true;
      this.content.resize();
      if (this.content.scrollToBottom) {
        this.content.scrollToBottom();
      }
    }else if (!last){
      this.content.resize();
      if (this.content.scrollToBottom) {
        this.content.scrollToBottom();
      }
    }
  }

  enviarMensagem(){
    let mensagem = this.inputMensagem;
    if(mensagem.length === 0){
      return false;
    }

    let today = new Date();

    let ano = today.getFullYear();
    let mes = today.getMonth(); // beware: January = 0; February = 1, etc.
    let dia = today.getDate();

    let minuto = today.getMinutes();
    let hora = today.getHours();

    let nova_mensagem = {
      eu: true, 
      mensagem_id: '', 
      mensagem: mensagem, 
      data_registro: ''+ano+'-'+mes+'-'+dia, 
      hora_registro: ''+hora+':'+minuto, 
      visualizado: '', 
      visualizado_data: ''
    };

    this.mensagens.push(nova_mensagem);
    this.resize(true);
    this.scrollToBottom();

    mensagem = btoa(mensagem);
    this.inputMensagem = "";
    this.msgService.set_usuarios_mensagens(this.usuario_id, this.amigo_id, mensagem).then((result) => {
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
      this.response = result;
      if(this.response.status === 'success'){
        if(this.mensagens_total != this.response.data.mensagens_total){
          this.response.data.mensagens.sort(function (a, b) {
            let data_a = a.data_registro + " " + a.hora_registro;
            let data_b = b.data_registro + " " + b.hora_registro;
            return data_a.localeCompare(data_b);
          });
          
          this.todasMensagens = this.response.data.mensagens;

          this.limit = 10;
          if(this.mensagens){
            this.limit = this.mensagens.length;
          }
          this.mensagens = [];
          this.mensagens = this.todasMensagens.slice(Math.max(this.todasMensagens.length - this.limit));
          this.mensagens_total = this.response.data.mensagens_total;
          this.scrollToBottom();
        }
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

  ionViewWillEnter(){
    this.loading = this.loadingCtrl.create({
      content: 'Carregando conversa...'
    });
    this.loading.present();

    this.msgService.set_usuarios_mensagens_visualizado(this.usuario_id, this.amigo_id).then((result) => {
      this.response = result;
      if(this.response.status === 'success'){
        
      }else{ 
        this.alert('Atenção', this.response.data);
      }
    }).catch(error=>{
      console.log(error);
      this.alert('Atenção', error.message);
    });

    this.carregaPerfis(this.usuario_id, this.amigo_id);
    this.carregaMensagens(this.amigo_id);

    this.intervalo = Observable.interval(2000).subscribe(()=>{
      this.carregaMensagens(this.amigo_id);
    });

    this.loading.dismiss();

  }

  carregarMais(infinite){
    setTimeout(() => {
      this.limit = this.limit + 10;
      if(this.limit > this.todasMensagens.length){
        this.limit = this.todasMensagens.length;
      }
      this.mensagens = this.todasMensagens.slice(Math.max(this.todasMensagens.length - this.limit));
      
      infinite.complete();

      if(this.todasMensagens.length === this.limit){
        this.infinite = false;
      }else{
        this.infinite = true;
      }
    }, 500);
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
