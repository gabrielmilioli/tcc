import { ChatPage } from './../chat/chat';
import { ProfilePage } from './../profile/profile';
import { UserProvider } from './../../providers/user/user';
import { AuthServiceProvider } from './../../providers/auth-service/auth-service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ViewController } from 'ionic-angular';

/**
 * Generated class for the AmigosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-amigos',
  templateUrl: 'amigos.html',
})
export class AmigosPage {
  amigos:{aceitos: [{amigo_id: string, amigo_nome: string, amigo_foto: string, aceito_data: string}],
          pendentes: [{amigo_id: string, amigo_nome: string, amigo_foto: string}],
          aceitos_total: 0, pendentes_total: 0};
  todosAmigos:{aceitos: [{amigo_id: string, amigo_nome: string, amigo_foto: string, aceito_data: string}],
          pendentes: [{amigo_id: string, amigo_nome: string, amigo_foto: string}],
          aceitos_total: 0, pendentes_total: 0};
  loading: any;
  response: any;
  usuario_id: any;
  contatos: string = 'a';
  inputBuscar:string;
  mostrarBuscar:boolean=false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public authService: AuthServiceProvider,
    public alertCtrl: AlertController, public loadingCtrl: LoadingController, public viewCtrl: ViewController,
    public userService: UserProvider) {
    //navParams.get("userId");
    this.usuario_id = this.authService.get_user_id();
    this.contatos = "a";
  }

  ionViewDidEnter() {
    this.loading = this.loadingCtrl.create({
      content: 'Carregando contatos...'
    });
    this.loading.present();
    
    this.carregaAmigos();

    this.loading.dismiss();
  }
/*
  buscar(e){
    let val = e.target.value;
    let results = [];
    var buscarPor = val;
    if(this.contatos === "a"){
      for (var i=0 ; i < this.todosAmigos.aceitos.length ; i++)
      {
        var nome = this.todosAmigos.aceitos[i].amigo_nome;
        if(nome.indexOf(buscarPor) != -1){
          results.push(this.todosAmigos.aceitos[i]);
        }
      }
      if(results.length === 0){
        results = this.todosAmigos.aceitos;
      }
      console.log(results);

      this.amigos.aceitos = results;

    }else{
      for (var i=0 ; i < this.todosAmigos.pendentes.length ; i++)
      {
        var nome = this.todosAmigos.pendentes[i].amigo_nome;
        if(nome.indexOf(buscarPor) != -1){
          results.push(this.todosAmigos.pendentes[i]);
        }
      }
      if(results.length === 0){
        results = this.todosAmigos.pendentes;
      }
      console.log(results);

      this.amigos.pendentes = results;
    }
    
    //console.log(this.pontos);
  }

  toggleBusca(){
    if (this.mostrarBuscar) {
      this.mostrarBuscar = false;
    } else {
      this.mostrarBuscar = true;
      //this.searchbarElement.setFocus();
    }
  }*/

  carregaAmigos(){
    this.userService.get_usuarios_amigos(this.usuario_id, null).then((result) => {
      console.log(result);
      this.response = result;
      if(this.response.status === 'success'){
        this.todosAmigos = this.response.data;
        this.amigos = this.response.data;
        
        console.log(this.response.data);
      }else{ 
        this.alert('Atenção', this.response.data);
      }
    }).catch(error=>{
      this.alert('Atenção', error.message);
    });
  }

  aceitarAmizade(id){
    this.userService.set_usuarios_amigos(this.usuario_id, id, 1).then((result) => {
      console.log(result);
      this.response = result;
      if(this.response.status === 'success'){
        this.carregaAmigos();
      }else{ 
        this.alert('Atenção', this.response.data);
      }
    }).catch(error=>{
      this.alert('Atenção', error.message);
    });
  }

  recusarAmizade(id){
    this.userService.set_usuarios_amigos(this.usuario_id, id, 2).then((result) => {
      console.log(result);
      this.response = result;
      if(this.response.status === 'success'){
        this.carregaAmigos();
      }else{ 
        this.alert('Atenção', this.response.data);
      }
    }).catch(error=>{
      this.alert('Atenção', error.message);
    });
  }
  
  visualizarPerfil(id){
    //console.log(id);
    this.navCtrl.push(ProfilePage, {"id":id});
  }

  conversar(id){
    //console.log(id);
    this.navCtrl.push(ChatPage, {"id":id});
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

}
