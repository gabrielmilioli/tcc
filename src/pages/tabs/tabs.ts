import { UserProvider } from './../../providers/user/user';
import { AuthServiceProvider } from './../../providers/auth-service/auth-service';
import { Component } from '@angular/core';
import { App, NavController, Events } from 'ionic-angular';

import { MapPage } from '../map/map';
import { HomePage } from '../home/home';
import { ProfilePage } from '../profile/profile';
import { PlacesPage } from '../places/places';
import { AmigosPage } from '../amigos/amigos';


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
  pages: Array<{title: string, component: any, icon: any, badge: string }>;
  tabs: Array<{title: string, root: any, icon: any }>;
  
  rootPage:any = MapPage;
  usuario:{id: string, nome: string, email: string, foto: string, register_date: string, 
    amizade_aceita:boolean, solicitou_amizade:boolean};
  response:any;
  badge:any;

  constructor(public app: App, public navCtrl: NavController, public authService: AuthServiceProvider,
    public userService: UserProvider, public events: Events) {
    //this.navCtrl.parent.select(2);
    this.carregaUsuario();
    this.carregaPendentes();
    if(!this.badge){
      this.badge = false;
    }
    this.pages = [
      { title: 'Perfil', component: ProfilePage, icon: 'contact', badge: '' },
      { title: 'Contatos', component: AmigosPage, icon: 'people', badge: this.badge }
      ];
    this.tabs = [
      { title: 'Pontos', root: PlacesPage, icon: 'bus' },
      { title: 'Mapa', root: MapPage, icon: 'compass' }
      ];
    events.subscribe('usuario:changed', usuario => {
        if(usuario !== undefined && usuario !== ""){
          this.usuario = usuario;
        }
     })
  }

  carregaPendentes(){
    this.usuario = this.authService.get_user();
    this.userService.get_usuarios_amigos(this.usuario.id, 2).then((result) => {
      this.response = result;
      if(this.response.status === 'success'){
        this.badge = this.response.data.pendentes_total;
      }else{ 
        console.log(this.response.data);
      }
    }).catch(error=>{
      console.log(error);
    });
  }
  
  carregaUsuario(){
    this.usuario = this.authService.get_user();
    this.userService.get_usuario(this.usuario.id, null).then((result) => {
      this.response = result;
      if(this.response.status === 'success'){
        this.usuario = this.response.data;
      }else{ 
        console.log(this.response.data);
      }
    }).catch(error=>{
      console.log(error);
    });
  }
  
  openPage(p){
    if(p.component){
      this.navCtrl.push(p.component);
    }
  }

  logout(){
    this.authService.signOut();
    this.authService.set_logged(false);
    this.authService.set_user(null);
    this.app.getRootNav().setRoot(HomePage);
  }

}
