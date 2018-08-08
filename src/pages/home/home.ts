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

  constructor(public navCtrl: NavController, public authService: AuthServiceProvider, 
    public alertCtrl: AlertController, public loadingCtrl: LoadingController) {
      console.log(localStorage.getItem('user'));
      if(localStorage.getItem('user')){
        // this.user = JSON.parse(localStorage.getItem('user'));
        // faz login
      }
  }

  login() {
    
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();

    this.authService.login(this.user).then((result) => {
      console.log(result);
      this.response = result;
      if(this.response.status === 'success'){
        localStorage.setItem('user', JSON.stringify(this.response.data));
        console.log(JSON.stringify(this.response.data));
        this.navCtrl.setRoot(TabsPage);
      }else{ 
        console.log(this.response.data); 
      }
    }, (err) => {
      // Error log
      console.log("Error: "+err);
    });

    loading.dismiss();

  }

  gotoRegister() {
    this.navCtrl.push(RegisterPage);
  }

}
