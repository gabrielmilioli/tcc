import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, LoadingController } from 'ionic-angular';
import { AuthServiceProvider } from './../../providers/auth-service/auth-service';
import { HomePage } from '../home/home';
import { FormBuilder, Validators } from '@angular/forms';

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
  public registerForm: any;
  messageError = ""
  error = false;

  constructor(public formBuilder: FormBuilder, public navCtrl: NavController, 
    public authService:AuthServiceProvider, public alertCtrl: AlertController, 
    public loadingCtrl: LoadingController) {
      console.log(formBuilder);

      this.registerForm = formBuilder.group({
        email: ['', Validators.required],
        password: ['', Validators.compose([Validators.minLength(6), Validators.maxLength(20), Validators.required])],
      });

  }

  keypress(){
    let { email, password } = this.registerForm.controls;
 
    if (!this.registerForm.valid) {
      if (!email.valid) {
        this.error = true;
        this.messageError = "Ops! Email inválido";
      } else {
        this.messageError = "";
      }
 
      if (!password.valid) {
        this.error = true;
        this.messageError ="A senha precisa ter de 6 a 20 caracteres"
      } else {
        this.messageError = "";
      }
    }else {
      console.log("Login Realizado");
    }
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
        this.navCtrl.setRoot(HomePage, {"success":"Conta criada!"});
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

  onChangeName(event) {
    var regex = new RegExp("^[A-zÀ-ÿçÇ ]+$");
    let value = event._value;
    if (!regex.test(value)) {
      value = value.replace(/[^A-Za-z]/g, '');
      console.log("nao tem string permitida");
      this.user.name = value;
      event._value = value;
      this.onChangeName(event);
    }
    event.setFocus();
    console.log(value);
  }
  onChangeLogin(event) {
    let value = event._value;
    value = value.replace(/[a-z0-9]/gi,'');
    console.log(value);
    this.user.login=value;
  }
  onChangeEmail(event) {
    let value = event._value;
    value = value.replace(/[a-z0-9.@]/gi,'');
    console.log(value);
    this.user.email=value;
  }
    /*
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
          //this.alert('Erro', this.response.data);
        }else{ 
          //this.alert('Erro', this.response.data);
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
    }*/
  
}
