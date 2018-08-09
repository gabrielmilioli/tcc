import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController } from 'ionic-angular';
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

  constructor(public navCtrl: NavController, public authService: AuthServiceProvider, 
    public alertCtrl: AlertController, public loadingCtrl: LoadingController) {
      this.authService.set_logged(false);
      this.userLogged = this.authService.get_user();
      if(this.userLogged){
        console.log("this.userLogged", this.userLogged);
        // this.user = JSON.parse(localStorage.getItem('user'));
        // faz login
        this.authService.set_logged(true);
        this.navCtrl.setRoot(TabsPage);
      }
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
    }, (err) => {
      // Error log
      //loading.dismiss();
      this.alert('Erro', err);
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
