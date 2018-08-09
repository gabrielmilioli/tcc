import { Component } from '@angular/core';
import { App, NavController } from 'ionic-angular';

import { MapPage } from '../map/map';
import { MessagesPage } from '../messages/messages';
import { AboutPage } from '../about/about';
import { HomePage } from '../home/home';

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
  rootPage:any = AboutPage;



  constructor(public app: App, public navCtrl: NavController) {
    this.pages = [
      { title: 'Perfil', component: null, icon: 'contact' },
      { title: 'Meus pontos', component: null, icon: 'heart' },
      { title: 'Reportar Bug', component: null, icon: 'bug' },
      { title: 'Sobre', component: null, icon: 'information-circle' },
      ];
    this.tabs = [
      { title: 'Sobre', root: AboutPage, icon: 'information-circle' },
      { title: 'Mapa', root: MapPage, icon: 'map' },
      { title: 'Mensagens', root: MessagesPage, icon: 'chatbubbles' }
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

}
