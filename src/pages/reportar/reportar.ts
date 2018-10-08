import { Camera, CameraOptions } from '@ionic-native/camera';
import { AuthServiceProvider } from './../../providers/auth-service/auth-service';
import { UserProvider } from './../../providers/user/user';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';

/**
 * Generated class for the ReportarPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-reportar',
  templateUrl: 'reportar.html',
})
export class ReportarPage {
  usuario_id:any;
  usuario_nome:any;
  loading:any;
  print:boolean=false;
  motivo = "";
  anexo:any;
  response:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public userService: UserProvider,
    public alertCtrl: AlertController, public loadingCtrl: LoadingController, public authService: AuthServiceProvider, private camera: Camera) {
      //this.usuarioLogadoId = this.authService.get_user_id();
      this.usuario_id = this.navParams.get('id');
      this.usuario_nome = this.navParams.get('nome');
      this.print = false;
  }

  ionViewDidLoad() {
    
  }

  reportar(){
    this.loading = this.loadingCtrl.create({
      content: 'Enviando...'
    });
    this.loading.present();
    
    if(this.motivo.length === 0){
      this.alert("Atenção", "Insira o motivo");
      return false;
    }

    let dados = {
      "motivo": this.motivo,
      "tipo": 0,
      "anexo": this.anexo,
      "reportado_id": this.usuario_id
    };

    let id = this.authService.get_user_id();

    this.userService.set_reportar(id, dados).then((result) => {
      this.response = result;
      this.loading.dismiss();
      if(this.response.status === 'success'){
        let alert = this.alertCtrl.create({
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
        this.alert('Atenção', this.response.data);
      }
    }).catch(error=>{
      this.alert('Atenção', error);
    });

  }

  carregarFoto() {
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
      sourceType:0,
    }

    this.camera.getPicture(options).then((imageData) => {
      this.print = imageData;
      this.anexo = true;
      this.loading.dismiss();
    }).catch(error=>{
      this.alert('Atenção', error);
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


}
