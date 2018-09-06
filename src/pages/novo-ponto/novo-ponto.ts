import { Camera, CameraOptions } from '@ionic-native/camera';
import { PontosProvider } from './../../providers/pontos/pontos';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, LoadingController, AlertController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';

/**
 * Generated class for the NovoPontoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-novo-ponto',
  templateUrl: 'novo-ponto.html',
})
export class NovoPontoPage {
  endereco:any;
  response:any;
  loading:any;
  imagem:string="assets/imgs/amarelinho-onibus.jpg";
  constructor(public navCtrl: NavController, public navParams: NavParams, public pontosProvider: PontosProvider, 
    public authService: AuthServiceProvider, private camera: Camera, public actionSheetCtrl: ActionSheetController,
    public alertCtrl: AlertController, public loadingCtrl: LoadingController, private transfer: FileTransfer) {
    this.endereco = this.navParams.get("endereco");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NovoPontoPage');
  }

  adicionarPonto(endereco) {
    this.loading = this.loadingCtrl.create({
      content: 'Criando ponto...'
    });
    this.loading.present();
    this.endereco.imagem = this.imagem;

    var id = this.authService.get_user_id();
    this.pontosProvider.set_ponto(id, this.endereco).then((result) => {
      //console.log(result);
      this.response = result;
      if(this.response.status === 'success'){
        console.log(this.response);
        let alert = this.alertCtrl.create({
          title: 'Sucesso',
          subTitle: this.response.data,
          buttons: [
            {
              text: 'Ok',
              handler: data => {
                this.navCtrl.pop();
              }
            }
          ]
        });
        alert.present();
      }else{ 
        this.alert('Erro', this.response.data);
      }
    }).catch(error=>{
      this.alert('Erro', error);
    });
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
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType:sourceType,
    }

    this.camera.getPicture(options).then((imageData) => {
      this.imagem = 'data:image/jpeg;base64,' + imageData;
    }).catch(error=>{
      this.alert('Erro', error);
    });
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