import { HorariosSalvosPage } from './../horarios-salvos/horarios-salvos';
import { UserProvider } from './../../providers/user/user';
import { GooglePlus } from '@ionic-native/google-plus';
import { Facebook } from '@ionic-native/facebook';
import { Component } from '@angular/core';
import { NavParams, NavController, AlertController, LoadingController, Platform } from 'ionic-angular';
import { RegistrarPage } from '../registrar/registrar';
import { TabsPage } from '../tabs/tabs';
import { AuthServiceProvider } from './../../providers/auth-service/auth-service';
import { Network } from '@ionic-native/network';
import * as firebase from 'Firebase';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  user = {
    "email": "",
    "senha": ""
  };
  response: any;
  userLogged: object;
  isLogged: any = false;
  userInfo: any = {};
  loading: any;
  online: boolean = true;

  constructor(public navParams: NavParams, public navCtrl: NavController, public platform: Platform, public authService: AuthServiceProvider, 
    public alertCtrl: AlertController, public loadingCtrl: LoadingController, public fb: Facebook, public gp: GooglePlus,
     public userService: UserProvider, public network: Network) {
      this.authService.set_logged(false);
      this.userLogged = this.authService.get_user();
      if(this.userLogged){
        // this.user = JSON.parse(localStorage.getItem('user'));
        // faz login
        this.authService.set_logged(true);
        this.navCtrl.setRoot(TabsPage);
      }

      if(this.navParams.get('sucesso')){
        this.alert('Sucesso', 'Conta criada!');
      }

  }

  login() {
    if(this.user.email.length === 0 || this.user.senha.length === 0){
        this.alert('Atenção', 'Preencha os campos!'); 
        return false;
    }

    this.loading = this.loadingCtrl.create({
      content: 'Acessando...'
    });
    this.loading.present();

    this.authService.signInWithEmail(this.user).then(() => {
      this.authService.login(this.user).then((result) => {
        this.response = result;
        if(this.response.status === 'success'){
          localStorage.setItem('user', JSON.stringify(this.response.data));
          
          this.authService.set_logged(true);
          this.authService.set_user(this.response.data);
          this.loading.dismiss();
          this.navCtrl.setRoot(TabsPage);
        }else{ 
          this.alert('Atenção', this.response.data);
        }
      }).catch(error=>{
        this.alert('Atenção', error.message);
      });

    }).catch(error=>{
      console.log(error);
      if(error.code == 'auth/wrong-password'){
        this.alert('Atenção', 'Senha incorreta');
      }else if(error.code == 'auth/user-not-found'){
        let alert = this.alertCtrl.create({
          title: 'Atenção',
          subTitle: 'Usuário não encontrado. Deseja registrar-se?',
          buttons: [
            {
              text: 'Não',
              role: 'cancel',
              handler: data => {
              }
            },
            {
              text: 'Sim',
              handler: data => {
                this.registrar();
              }
            }
          ]
        });
        alert.present();
      }
    });
    
  }

  ionViewDidEnter() {
    this.network.onConnect().subscribe(data => {
      this.online = true;
      //this.alert('Sucesso', 'Online!');
    }, error => console.error(error));
   
    this.network.onDisconnect().subscribe(data => {
      this.online = false;
      //this.alert('Atenção', 'Offline!');
    }, error => console.error(error));
  }

  loginGp(){
    this.loading = this.loadingCtrl.create({
      content: 'Acessando...'
    });
    this.loading.present();
    
    this.authService.signInWithGoogle().then(result => {
      this.response = result;
      let credentials = {
        "accessToken": this.response.credential.accessToken,
        "displayName": this.response.additionalUserInfo.profile.name,
        "email": this.response.additionalUserInfo.profile.email,
        "familyName": this.response.additionalUserInfo.profile.family_name,
        "givenName": this.response.additionalUserInfo.profile.given_name,
        "idToken": this.response.credential.id,
        "imageUrl": this.response.additionalUserInfo.profile.picture,
        "userId": this.response.additionalUserInfo.profile.id,
        "login": "googleplus"
      };

      //registrar / logar
      this.authService.login(credentials).then((result) => {
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
          this.alert('Atenção', this.response.data);
        }
      }).catch(error=>{
        this.alert('Atenção', error.message);
      });
    }).catch(err => console.log(err));
  }

  setSenha(id){
    this.navCtrl.push(RegistrarPage, {id: id});
  }

  gotoTabs(){
    this.navCtrl.setRoot(TabsPage);
  }

  horarios(){
    this.navCtrl.push(HorariosSalvosPage);
  }

  loginFb(){
    this.loading = this.loadingCtrl.create({
      content: 'Acessando...'
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
          this.response = result;
          if(this.response.status === 'success'){
            localStorage.setItem('user', JSON.stringify(this.response.data));

            this.isLogged = true;
            this.authService.set_logged(true);
            this.authService.set_user(this.response.data);
            this.loading.dismiss();
            this.navCtrl.setRoot(TabsPage);
          }else{ 
            this.alert('Atenção', this.response.data);
          }
        }).catch(error=>{
          this.alert('Atenção', error.message);
        });

      }).catch(error=>{
        this.alert('Atenção', error.message);
      });
    }).catch(error=>{
      this.alert('Atenção', error.message);
    });
    
  }

  logoutFb(){
    this.fb.logout().then(logoutRes => {
      this.userInfo = {};
      this.isLogged = false;
    }).catch(error=>{
      this.alert('Atenção', error.message);
    });
  }

  alert(title, subTitle) {
    if(this.loading){
      this.loading.dismiss();
    }
    
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subTitle,
      buttons: ['Ok']
    });
    alert.present();
  }

  registrar() {
    this.navCtrl.push(RegistrarPage);
  }

}
