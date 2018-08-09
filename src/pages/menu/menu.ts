import { AuthServiceProvider } from './../../providers/auth-service/auth-service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, App } from 'ionic-angular';
import { Observable } from 'rxjs';

import { HomePage } from './../home/home';
/**
 * Generated class for the MenuPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {
  user$: Observable<object>;
  userData: any;
  isLogged$: Observable<boolean>;
  name:string;
  email:string;

  pages: Array<{title: string, component: any, icon: any }>;
  

  constructor(public app: App, public navCtrl: NavController, public navParams: NavParams,
    public authService: AuthServiceProvider, public loadingCtrl: LoadingController) {
      if( this.userData ){
        this.name = this.userData.name;
        this.email = this.userData.email;
      }

      this.pages = [
        { title: 'Perfil', component: null, icon: 'contact' },
        { title: 'Meus pontos', component: null, icon: 'heart' },
        { title: 'Reportar Bug', component: null, icon: 'bug' },
        { title: 'Sobre', component: null, icon: 'information-circle' },
        ];
  }

  openPage(p){
    if(p.component){
      this.navCtrl.setRoot(p.component);
    }
  }

  logout(){
    this.app.getRootNav().setRoot(HomePage);
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad MenuPage');
    this.userData = this.authService.get_user();
    this.isLogged$ = this.authService.get_logged;
    if( this.userData ){
      this.name = this.userData.name;
      this.email = this.userData.email;
    }
    
    console.log(this.userData);
  }

}
