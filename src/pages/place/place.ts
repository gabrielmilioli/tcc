import { Geolocation } from '@ionic-native/geolocation';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { PontosProvider } from '../../providers/pontos/pontos';

/**
 * Generated class for the PlacePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-place',
  templateUrl: 'place.html',
})
export class PlacePage {
  ponto={id: "", nome: "", endereco: "", data_registro: "", imagem: "", favorito: "", 
  class: [{icon:""}], totalClass: "",
  comentarios: [{usuario_id:"", usuario_foto:"", usuario_nome:"", comentario:"", data_registro:""}] };

  loading:any;
  response:any;
  position:any;
  classificacao:any;
  ponto_id:string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public authService: AuthServiceProvider,
    public alertCtrl: AlertController, public loadingCtrl: LoadingController, public pontoService: PontosProvider,
    public geo: Geolocation) {
      console.log(geo);
  }

  ionViewDidEnter(){
    this.ponto_id = this.navParams.get('id');
    this.ponto.id = this.ponto_id;

    this.position = this.geo.getCurrentPosition();

    console.log(this.ponto);
    this.loading = this.loadingCtrl.create({
      content: 'Carregando ponto...'
    });
    this.loading.present();

    this.carregaPonto();

    this.loading.dismiss();
  }

  carregaPonto(){
    var id = this.authService.get_user_id();
    this.pontoService.get_ponto(id, this.ponto_id).then((result) => {
      console.log(result);
      this.response = result;
      if(this.response.status === 'success'){
        this.ponto = this.response.data;
      }else{ 
        this.alert('Erro', this.response.data);
      }
    }).catch(error=>{
      console.log(error);
      this.alert('Erro', error);
    });
  }

  classificarPonto(ponto_id) {
    let alert = this.alertCtrl.create();
    alert.setTitle('Quantas estrelas esse ponto merece?');

    alert.addInput({
      type: 'radio',
      label: 'Uma',
      value: '1'
    });
    alert.addInput({
      type: 'radio',
      label: 'Duas',
      value: '2'
    });
    alert.addInput({
      type: 'radio',
      label: 'Três',
      value: '3'
    });
    alert.addInput({
      type: 'radio',
      label: 'Quatro',
      value: '4'
    });
    alert.addInput({
      type: 'radio',
      label: 'Cinco',
      value: '5'
    });

    alert.addButton('Cancelar');
    alert.addButton({
      text: 'Classificar',
      handler: data => {
        
        var id = this.authService.get_user_id();
        this.pontoService.set_pontos_classificacoes(id, this.ponto_id, data).then((result) => {
          console.log(result);
          this.response = result;
          if(this.response.status === 'success'){
            this.carregaPonto();
          }else{ 
            this.alert('Erro', this.response.data);
          }
        }).catch(error=>{
          console.log(error);
          this.alert('Erro', error);
        });

      }
    });
    alert.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PlacePage');
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
