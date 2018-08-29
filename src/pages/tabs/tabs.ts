import { UserProvider } from './../../providers/user/user';
import { AuthServiceProvider } from './../../providers/auth-service/auth-service';
import { Component } from '@angular/core';
import { App, NavController } from 'ionic-angular';

import { MapPage } from '../map/map';
import { MessagesPage } from '../messages/messages';
import { AboutPage } from '../about/about';
import { HomePage } from '../home/home';
import { ProfilePage } from '../profile/profile';
import { PlacesPage } from '../places/places';
import { SettingsPage } from '../settings/settings';


/**
 * Generated class for the TabsPage tabs.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  pages: Array<{title: string, component: any, icon: any }>;
  tabs: Array<{title: string, root: any, icon: any }>;
  
  tabPage1 = AboutPage;
  tabPage2 = MapPage;
  tabPage3 = MessagesPage;
  rootPage:any = MapPage;

  name:string;
  user:{
    "id":"",
    "name":"",
    "email":"",
    "login":"",
    "password":"",
    "registration_date":"",
  };


  constructor(public app: App, public navCtrl: NavController, public authService: AuthServiceProvider,
    public userService: UserProvider) {
    //this.navCtrl.parent.select(2);
    this.user = this.authService.get_user();
    if(this.user){
      this.name = this.user.name;
    }
    this.pages = [
      { title: 'Perfil', component: ProfilePage, icon: 'contact' },
      { title: 'Meus pontos', component: PlacesPage, icon: 'heart' }
      /*{ title: 'Reportar Bug', component: null, icon: 'bug' },
      { title: 'Configurações', component: SettingsPage, icon: 'cog' },
      { title: 'Sobre', component: AboutPage, icon: 'information-circle' },*/
      ];
    this.tabs = [
      { title: 'Pontos', root: PlacesPage, icon: 'bus' },
      { title: 'Mapa', root: MapPage, icon: 'compass' }
      /*{ title: 'Mensagens', root: MessagesPage, icon: 'chatbubbles' }*/
      ];
  }
  
  openPage(p){
    if(p.component){
      this.navCtrl.push(p.component);
    }
  }

  logout(){
    this.authService.set_logged(false);
    this.authService.set_user(null);
    this.app.getRootNav().setRoot(HomePage);
  }

}
