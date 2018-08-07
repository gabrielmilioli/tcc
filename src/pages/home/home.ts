import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController } from 'ionic-angular';
import { RegisterPage } from '../register/register';
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
        //localStorage.setItem('user', JSON.stringify(this.response.data));
        console.log(this.response.data);
        //this.navCtrl.push(TabsPage);
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
