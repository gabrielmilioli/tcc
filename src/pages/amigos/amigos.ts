import { UserProvider } from './../../providers/user/user';
import { AuthServiceProvider } from './../../providers/auth-service/auth-service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ViewController } from 'ionic-angular';

/**
 * Generated class for the AmigosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-amigos',
  templateUrl: 'amigos.html',
})
export class AmigosPage {
  amigos:{aceitos: [{amigo_id: string, amigo_nome: string, amigo_foto: string, aceito_data: string}],
          pendentes: [{amigo_id: string, amigo_nome: string, amigo_foto: string}],
          aceitos_total: any, pendentes_total: any};
  loading: any;
  response: any;
  usuario_id: any;
  contatos: string = 'a';

  constructor(public navCtrl: NavController, public navParams: NavParams, public authService: AuthServiceProvider,
    public alertCtrl: AlertController, public loadingCtrl: LoadingController, public viewCtrl: ViewController,
    public userService: UserProvider) {
    //navParams.get("userId");
    this.usuario_id = this.authService.get_user_id();
  }

  ionViewDidEnter() {
    this.loading = this.loadingCtrl.create({
      content: 'Carregando contatos...'
    });
    this.loading.present();
    
    this.carregaAmigos();

    this.loading.dismiss();
  }

  carregaAmigos(){
    this.userService.get_usuarios_amigos(this.usuario_id, null).then((result) => {
      console.log(result);
      this.response = result;
      if(this.response.status === 'success'){
        this.amigos = this.response.data;
        console.log(this.response.data);
      }else{ 
        this.alert('Erro', this.response.data);
      }
    }).catch(error=>{
      this.alert('Erro', error.message);
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

  openChat(friend_id){
    //this.navCtrl.push();
    let data = { 'friend_id': friend_id };
    this.viewCtrl.dismiss(data);
  }

  back(){
    this.navCtrl.pop();
  }

}
