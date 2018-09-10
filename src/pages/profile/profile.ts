import { AuthServiceProvider } from './../../providers/auth-service/auth-service';
import { UserProvider } from './../../providers/user/user';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ActionSheetController } from 'ionic-angular';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { Camera, CameraOptions } from '@ionic-native/camera';

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
  usuario:{id: string, nome: string, email: string, foto: string, register_date: string};
  loading:any;
  response:any;
  loggedUser:boolean=false;
  editando:boolean=false;
  imageURI:any;
  imageFileName:any;
  userLogged:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public userService: UserProvider,
    public alertCtrl: AlertController, public loadingCtrl: LoadingController, public authService: AuthServiceProvider,
    private transfer: FileTransfer, private camera: Camera, public actionSheetCtrl: ActionSheetController) {
      this.userLogged = this.authService.get_user_id();
  }

  ionViewDidEnter(){
    this.loading = this.loadingCtrl.create({
      content: 'Carregando perfil...'
    });
    this.loading.present();

    this.loggedUser = false;
    var id = null;
    if(this.navParams.get('id')){
      id = this.navParams.get('id');
    }else{
      var user = this.authService.get_user_id();
      if(user){
        id = user.id;
      }
      this.loggedUser = true;
    }

    this.loadProfile(id);

    this.loading.dismiss();
  }

  escolherUpload(){
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
            console.log('Cancel clicked');
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
      this.loading.dismiss();
      this.usuario.foto = 'data:image/jpeg;base64,' + imageData;
    }).catch(error=>{
      this.alert('Erro', error);
    });
  }

  editar(){
    if(this.usuario.id == this.userLogged){
      return false;
    }
    if(!this.editando){
      this.editando=true;
    }else{
      this.editando=false;
    }
  }

  confirmarEdicao(id){
    this.userService.set_usuario(id, this.usuario).then((result) => {
      console.log(result);
      this.response = result;
      if(this.response.status === 'success'){
        //this.usuario = this.response.data;
        if(!this.editando){
          this.editando=true;
        }else{
          this.editando=false;
        }
        this.ionViewDidEnter();
      }else{ 
        this.alert('Erro', this.response.data);
      }
    }).catch(error=>{
      this.alert('Erro', error);
    });
  }

  loadProfile(id){
    this.userService.get_user(id).then((result) => {
      console.log(result);
      this.response = result;
      if(this.response.status === 'success'){
        console.log(this.response.data);
        this.usuario = this.response.data;
      }else{ 
        this.alert('Erro', this.response.data);
      }
    }).catch(error=>{
      this.alert('Erro', error);
    });
  }

  adicionarAmigo(id){
    console.log(id+" = "+this.userLogged);
    if(id == this.userLogged){
      return false;
    }
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

}
