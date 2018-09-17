import { LinhasPage } from './../linhas/linhas';
import { ProfilePage } from './../profile/profile';
import { ClassificarPontoPage } from './../classificar-ponto/classificar-ponto';
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
  ponto={id: "", nome: "", endereco: "", data_registro: "", imagem: "", favorito: "", classificou: false,
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

  visualizarPerfil(id){
    //console.log(id);
    this.navCtrl.push(ProfilePage, {"id":id});
  }

  carregaPonto(){
    var id = this.authService.get_user_id();
    this.pontoService.get_ponto(id, this.ponto_id).then((result) => {
      console.log(result);
      this.response = result;
      if(this.response.status === 'success'){
        this.ponto = this.response.data;
      }else{ 
        this.alert('Atenção', this.response.data);
      }
    }).catch(error=>{
      console.log(error);
      this.alert('Atenção', error);
    });
  }

  classificarPonto(ponto_id) {
    this.navCtrl.push(ClassificarPontoPage, {'ponto_id':ponto_id});
  }

  linhas(){
    this.navCtrl.push(LinhasPage, {'ponto_id':this.ponto.id});
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
