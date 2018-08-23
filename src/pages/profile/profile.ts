import { AuthServiceProvider } from './../../providers/auth-service/auth-service';
import { UserProvider } from './../../providers/user/user';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';


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
  user:any;
  loading:any;
  response:any;
  loggedUser:boolean=false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public userService: UserProvider,
    public alertCtrl: AlertController, public loadingCtrl: LoadingController, public authService: AuthServiceProvider) {
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
      var user = this.authService.get_user();
      if(user){
        id = user.id;
      }
      this.loggedUser = true;
    }

    this.loadProfile(id);

    this.loading.dismiss();
  }

  loadProfile(id){
    this.userService.get_user(id).then((result) => {
      console.log(result);
      this.response = result;
      if(this.response.status === 'success'){
        //this.user = this.response.data;
      }else{ 
        this.alert('Erro', this.response.data);
      }
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

}
