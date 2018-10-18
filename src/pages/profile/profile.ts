import { ReportarPage } from './../reportar/reportar';
import { AuthServiceProvider } from './../../providers/auth-service/auth-service';
import { UserProvider } from './../../providers/user/user';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ActionSheetController, Events, Content } from 'ionic-angular';
import { FileTransfer } from '@ionic-native/file-transfer';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ChatPage } from '../chat/chat';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  @ViewChild(Content) content: Content;
  usuario:any;
  att_usuario:any;
  loading:any;
  response:any;
  usuarioLogado:boolean=false;
  editando:boolean=false;
  imageURI:any;
  imageFileName:any;
  usuarioLogadoId:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public userService: UserProvider,
    public alertCtrl: AlertController, public loadingCtrl: LoadingController, public authService: AuthServiceProvider,
    private transfer: FileTransfer, private camera: Camera, public actionSheetCtrl: ActionSheetController,
    public events: Events) {
      this.usuarioLogadoId = this.authService.get_user_id();
  }

  ionViewDidEnter(){
    this.loading = this.loadingCtrl.create({
      content: 'Carregando perfil...'
    });
    this.loading.present();

    var usuario_id = this.authService.get_user_id();
    this.usuarioLogado = false;
    var id = null;
    if(this.navParams.get('id')){
      id = this.navParams.get('id');
    }else{
      id = usuario_id;
    }

    if(usuario_id === id){
      this.usuarioLogado = true;
    }

    this.loadProfile(id, usuario_id);

    this.loading.dismiss();
  }

  reportar(){
    
    let alert = this.alertCtrl.create({
      subTitle: 'Deseja reportar '+this.usuario.nome+'?',
      buttons: [
        {
          text: 'Não',
          role: 'cancel',
          handler: data => {
            
          }
        },
        {
          text: 'Sim',
          handler: data => {
            this.navCtrl.push(ReportarPage, {"id":this.usuario.id, "nome":this.usuario.nome});
          }
        }
      ]
    });
    alert.present();
  }

  editarFoto(){
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Escolher foto de',
      buttons: [
        {
          text: 'Galeria',
          handler: () => {
            this.carregarFoto(0);
          }
        },
        {
          text: 'Câmera',
          handler: () => {
            this.carregarFoto(1);
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            
          }
        }
      ]
    });
    actionSheet.present();
  }

  carregarFoto(sourceType:number) {
    this.loading = this.loadingCtrl.create({
      content: 'Carregando foto...'
    });
    this.loading.present();
    
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType:sourceType,
    }

    this.camera.getPicture(options).then((imageData) => {
      this.userService.set_usuario_foto(this.usuario.id, imageData).then((result) => {
        this.response = result;
        if(this.response.status === 'success'){
          this.loading.dismiss();
          this.loadProfile(this.usuarioLogadoId, this.usuario.id);
        }else{ 
          this.alert('Atenção', this.response.data);
        }
      }).catch(error=>{
        this.alert('Atenção', error);
      });
      
    }).catch(error=>{
      this.alert('Atenção', error);
    });
  }

  editar(){
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Alterar',
      buttons: [
        {
          text: 'Foto',
          handler: () => {
            this.editarFoto();
          }
        },
        {
          text: 'Perfil',
          handler: () => {
            this.editarPerfil();
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            
          }
        }
      ]
    });
    actionSheet.present();
  }

  editarPerfil(){
    if(this.usuario.id != this.usuarioLogadoId){
      return false;
    }

    let alert = this.alertCtrl.create({
      title: 'Editar perfil',
      inputs: [
        {
          name: 'nome',
          placeholder: 'Nome',
          value: this.usuario.nome
        },
        {
          name: 'email',
          placeholder: 'E-mail',
          type: 'email',
          value: this.usuario.email
        },
        {
          name: 'senha',
          placeholder: 'Senha',
          type: 'password'
        },
        {
          name: 'repetir_senha',
          placeholder: 'Repita a senha',
          type: 'password'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: data => {
            
          }
        },
        {
          text: 'Salvar',
          handler: data => {
            this.loading = this.loadingCtrl.create({
              content: 'Atualizando perfil...'
            });
            this.loading.present();
            
            if(data.nome.length < 1){
              this.alert('Atenção', 'Insira um nome válido');
              return false;
            }
            if(data.email.length < 1){
              this.alert('Atenção', 'Insira um e-mail válido');
              return false;
            }else if(data.email.indexOf('@') === -1){
              this.alert('Atenção', 'Insira um e-mail válido');
              return false;
            }
            if(data.senha.length != 0){
              if(data.senha != data.repetir_senha){
                this.alert('Atenção', 'Senhas incompatíveis');
                return false;
              }else if(data.senha.length <= 4){
                this.alert('Atenção', 'A senha deve conter no mínimo 4 caracteres');
                return false;
              }
            }

            this.salvarUsuario(this.usuario.id, data);
            
            this.loading.dismiss();
          }
        }
      ]
    });
    alert.present();
  }

  salvarUsuario(id, dados){
    this.userService.set_usuario(id, dados).then((result) => {
      this.response = result;
      if(this.response.status === 'success'){
        //this.usuario = this.response.data;
        this.editando = false;
        this.events.publish('usuario:changed', this.usuario);
        this.ionViewDidEnter();
      }else{ 
        this.alert('Atenção', this.response.data);
      }
    }).catch(error=>{
      this.alert('Atenção', error);
    });
  }

  loadProfile(id, usuario_id){
    this.userService.get_usuario(id, usuario_id).then((result) => {
      this.response = result;
      if(this.response.status === 'success'){
        this.usuario = this.response.data;
        setTimeout(() => {
          let div = document.getElementById('usuario-foto');
          div.style.backgroundImage='url("'+this.usuario.foto+'")';
        }, 100);
        
      }else{ 
        this.alert('Atenção', this.response.data);
      }
    }).catch(error=>{
      this.alert('Atenção', error);
    });
  }

  solicitarAmizade(id){
    if(id == this.usuarioLogadoId){
      return false;
    }
    this.userService.set_usuarios_amigos(this.usuarioLogadoId, id, null).then((result) => {
      this.response = result;
      if(this.response.status === 'success'){
        //this.usuario = this.response.data;
        this.usuario.solicitou_amizade = true;
        this.ionViewDidEnter();
      }else{ 
        this.alert('Atenção', this.response.data);
      }
    }).catch(error=>{
      this.alert('Atenção', error);
    });
  }

  aceitarAmizade(id){
    if(id == this.usuarioLogadoId){
      return false;
    }
    this.userService.set_usuarios_amigos(this.usuarioLogadoId, id, 1).then((result) => {
      this.response = result;
      if(this.response.status === 'success'){
        //this.usuario = this.response.data;
        this.usuario.solicitou_amizade = true;
        this.ionViewDidEnter();
      }else{ 
        this.alert('Atenção', this.response.data);
      }
    }).catch(error=>{
      this.alert('Atenção', error);
    });
  }

  recusarAmizade(id){
    if(id == this.usuarioLogadoId){
      return false;
    }
    this.userService.set_usuarios_amigos(this.usuarioLogadoId, id, 2).then((result) => {
      this.response = result;
      if(this.response.status === 'success'){
        //this.usuario = this.response.data;
        this.usuario.solicitou_amizade = true;
        this.ionViewDidEnter();
      }else{ 
        this.alert('Atenção', this.response.data);
      }
    }).catch(error=>{
      this.alert('Atenção', error);
    });
  }
  
  desfazerAmizade(id){
    if(id == this.usuarioLogadoId){
      return false;
    }
    this.userService.set_usuarios_amigos(this.usuarioLogadoId, id, 3).then((result) => {
      this.response = result;
      if(this.response.status === 'success'){
        //this.usuario = this.response.data;
        this.usuario.solicitou_amizade = true;
        this.ionViewDidEnter();
      }else{ 
        this.alert('Atenção', this.response.data);
      }
    }).catch(error=>{
      this.alert('Atenção', error);
    });
  }

  cancelarSolicitacao(id){
    if(id == this.usuarioLogadoId){
      return false;
    }
    this.userService.set_usuarios_amigos(this.usuarioLogadoId, id, 4).then((result) => {
      this.response = result;
      if(this.response.status === 'success'){
        //this.usuario = this.response.data;
        this.usuario.solicitou_amizade = true;
        this.ionViewDidEnter();
      }else{ 
        this.alert('Atenção', this.response.data);
      }
    }).catch(error=>{
      this.alert('Atenção', error);
    });
  }
  
  conversar(id){
    if(id == this.usuarioLogadoId){
      return false;
    }
    this.navCtrl.push(ChatPage, {"id": id});
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

  ionViewDidLoad() {
    
  }

}
