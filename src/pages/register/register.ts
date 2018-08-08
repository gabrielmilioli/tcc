import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, LoadingController } from 'ionic-angular';
import { AuthServiceProvider } from './../../providers/auth-service/auth-service';

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  response:any;
  user = {
        "name": "",
        "email": "",
        "password": "", 
        "repassword": ""
      };

  constructor(public navCtrl: NavController, 
    public authService:AuthServiceProvider, public alertCtrl: AlertController, 
    public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  register(){
    if(this.user.name.length === 0 || this.user.email.length === 0 ||
      this.user.password.length === 0 || this.user.repassword.length === 0){
        this.alert("Fill the form"); 
        return false;
    }
    /*
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
*/
    this.authService.register(this.user).then((result) => {
      console.log(result);
      this.response = result;
      if(this.response.status === 'success'){
        localStorage.setItem('user', JSON.stringify(this.response.data));
        this.alert(this.response.data);
        //this.navCtrl.push(TabsPage);
      }else{ 
        this.alert(this.response.data); 
      }
    }, (err) => {
      // Error log
      this.alert("Error: "+err);
    });

    //loading.dismiss();
  }

  alert(subTitle) {
    let alert = this.alertCtrl.create({
      title: 'Info!',
      subTitle: subTitle,
      buttons: ['Dismiss']
    });
    alert.present();
  }

}
