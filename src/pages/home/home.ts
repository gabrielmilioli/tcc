import { Facebook } from '@ionic-native/facebook';
import { Component } from '@angular/core';
import { NavParams, NavController, AlertController, LoadingController } from 'ionic-angular';
import { RegisterPage } from '../register/register';
import { TabsPage } from '../tabs/tabs';
import { AuthServiceProvider } from './../../providers/auth-service/auth-service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  user = {
    "login": "",
    "password": ""
  };
  response: any;
  userLogged: object;
  isLogged: any = false;
  userInfo: any = {};

  constructor(public navParams: NavParams, public navCtrl: NavController, public authService: AuthServiceProvider, 
    public alertCtrl: AlertController, public loadingCtrl: LoadingController, public fb: Facebook) {
      this.authService.set_logged(false);
      this.userLogged = this.authService.get_user();
      if(this.userLogged){
        console.log("this.userLogged", this.userLogged);
        // this.user = JSON.parse(localStorage.getItem('user'));
        // faz login
        this.authService.set_logged(true);
        this.navCtrl.setRoot(TabsPage);
      }

      if(this.navParams.get('sucesso')){
        this.alert('Sucesso', 'Conta criada!');
      }

  }

  loginFb(){
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();

    this.fb.login(["public_profile", "email"]).then(loginRes => {
      this.fb.api('me/?fields=id,email,first_name,picture', ["public_profile", "email"]).then(apiRes => {
        //this.userInfo = apiRes;
        this.isLogged = true;
        //console.log(apiRes);
        this.userInfo = {
          "facebook_id": apiRes.id,
          "email": apiRes.email,
          "first_name": apiRes.first_name,
          "picture": apiRes.picture
        };


        //registrar db
        this.authService.register(this.userInfo).then((result) => {
          console.log(result);
          this.response = result;
          if(this.response.status === 'success'){
            localStorage.setItem('user', JSON.stringify(this.response.data));
            this.authService.set_logged(true);
            this.authService.set_user(this.response.data);
            this.navCtrl.setRoot(TabsPage);
          }else{ 
            loading.dismiss();
            this.alert('Erro', this.response.data);
          }
        }).catch(error=>{
          loading.dismiss();
          this.alert('Erro', error.message);
        });

      }).catch(error=>{
        loading.dismiss();
        this.alert('Erro', error.message);
      });
    }).catch(error=>{
      loading.dismiss();
      this.alert('Erro', error.message);
    });

    
  }

  logoutFb(){
    this.fb.logout().then(logoutRes => {
      this.userInfo = {};
      this.isLogged = false;
    }).catch(error=>{
      this.alert('Erro', error.message);
    });
  }

  login() {
    if(this.user.login.length === 0 || this.user.password.length === 0){
        this.alert('Erro', 'Preencha os campos!'); 
        return false;
    }
    /*
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
*/
    this.authService.login(this.user).then((result) => {
      this.response = result;
      //loading.dismiss();
      if(this.response.status === 'success'){
        localStorage.setItem('user', JSON.stringify(this.response.data));
        
        this.authService.set_logged(true);
        this.authService.set_user(this.response.data);
        this.navCtrl.setRoot(TabsPage);
      }else{ 
        this.alert('Erro', this.response.data);
      }
    }).catch(error=>{
      this.alert('Erro', error.message);
    });

    //loading.dismiss();

  }

  alert(title, subTitle) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subTitle,
      buttons: ['Ok']
    });
    alert.present();
  }

  gotoRegister() {
    this.navCtrl.push(RegisterPage);
  }

}
