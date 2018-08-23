import { UserProvider } from './../../providers/user/user';
import { GooglePlus } from '@ionic-native/google-plus';
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
    "email": "",
    "password": ""
  };
  response: any;
  userLogged: object;
  isLogged: any = false;
  userInfo: any = {};
  loading: any;

  constructor(public navParams: NavParams, public navCtrl: NavController, public authService: AuthServiceProvider, 
    public alertCtrl: AlertController, public loadingCtrl: LoadingController, public fb: Facebook, public gp: GooglePlus,
     public userService: UserProvider) {
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

  loginGp(){
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loading.present();
    
    this.gp.login({}).then(res => {
      let credentials = {
        "accessToken": res.accessToken,
        "displayName": res.displayName,
        "email": res.email,
        "expires": res.expires,
        "expires_in": res.expires_in,
        "familyName": res.familyName,
        "givenName": res.givenName,
        "idToken": res.idToken,
        "imageUrl": res.imageUrl,
        "serverAuthCode": res.serverAuthCode,
        "userId": res.userId,
        "login": "googleplus"
      };

      //registrar / logar
      this.authService.login(credentials).then((result) => {
        console.log(result);
        this.response = result;
        if(this.response.status === 'success'){
          localStorage.setItem('user', JSON.stringify(this.response.data));

          this.isLogged = true;
          this.authService.set_logged(true);
          this.authService.set_user(this.response.data);
          this.loading.dismiss();
          if(this.response.data.concluirCadastro){
            this.setSenha(this.response.data.id);
          }else{
            this.gotoTabs();
          }
        }else{ 
          this.alert('Erro', this.response.data);
        }
      }).catch(error=>{
        this.alert('Erro', error.message);
      });
    })
    .catch(err => console.error(err));
  }

  setSenha(id){
      let alert = this.alertCtrl.create({
        title: 'Defina uma senha',
        inputs: [
          {
            name: 'senha',
            placeholder: 'Senha',
            type: 'password'
          },
          {
            name: 'repetir_senha',
            placeholder: 'Repita a senha',
            type: 'password'
          }
        ],
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: data => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Salvar',
            handler: data => {
              if(data.senha != data.repetir_senha){
                this.alert('Erro', 'Senhas incompatíveis');
                return false;
              }else if(data.senha.length < 4){
                this.alert('Erro', 'Defina uma senha com no mínimo 4 dígitos');
                return false;
              }
              //salvar senha
              this.userService.set_usuario_senha(id, data.senha);
              this.gotoTabs();
            }
          }
        ]
      });
      alert.present();
  }

  gotoTabs(){
    this.navCtrl.setRoot(TabsPage);
  }

  loginFb(){
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loading.present();
    
    this.fb.login(["public_profile", "email"]).then(loginRes => {
      this.fb.api('me/?fields=id,email,first_name,picture', ["public_profile", "email"]).then(apiRes => {
        //this.userInfo = apiRes;
        this.userInfo = {
          "facebook_id": apiRes.id,
          "email": apiRes.email,
          "first_name": apiRes.first_name,
          "picture": apiRes.picture,
          "login": "facebook"
        };

        //registrar / logar
        this.authService.login(this.userInfo).then((result) => {
          console.log(result);
          this.response = result;
          if(this.response.status === 'success'){
            localStorage.setItem('user', JSON.stringify(this.response.data));

            this.isLogged = true;
            this.authService.set_logged(true);
            this.authService.set_user(this.response.data);
            this.loading.dismiss();
            this.navCtrl.setRoot(TabsPage);
          }else{ 
            this.alert('Erro', this.response.data);
          }
        }).catch(error=>{
          this.alert('Erro', error.message);
        });

      }).catch(error=>{
        this.alert('Erro', error.message);
      });
    }).catch(error=>{
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
    if(this.user.email.length === 0 || this.user.password.length === 0){
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
    this.loading.dismiss();
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
