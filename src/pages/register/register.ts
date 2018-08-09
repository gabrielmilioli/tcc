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
        "login": "",
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
        this.alert('Erro', 'Preencha os campos!'); 
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
        this.alert('Sucesso', 'Conta criada!');
        //this.navCtrl.push(TabsPage);
      }else{ 
        this.alert('Erro', this.response.data);
      }
    }, (err) => {
      // Error log
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

  keyPressChecker(event, field) {
    if(field === 'name'){
      var regex = new RegExp("^[A-zÀ-ÿçÇ ]+$");
      var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
      if (!regex.test(key)) {
        event.preventDefault();
        return false;
      }
    }
    if(field === 'login'){
      var regex = new RegExp("^[a-zA-Z0-9]+$");
      var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
      if (!regex.test(key)) {
        event.preventDefault();
        return false;
      }

      let object = {
        "login": key
      };

      this.authService.check_login(object).then((result) => {
        this.response = result;
        if(this.response.status === 'success'){
          this.alert('Erro', this.response.data);
        }else{ 
          this.alert('Erro', this.response.data);
        }
      }, (err) => {
        // Error log
        this.alert('Erro', err);
      });

    }
    if(field === 'email'){
      var regex = new RegExp("^[a-zA-Z0-9@_.]+$");
      var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
      if (!regex.test(key)) {
        event.preventDefault();
        return false;
      }
    }
  }
}
