import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import AuthProvider = firebase.auth.AuthProvider;

let restUrl = "http://tcc3.pelocelular.com.br/rest.php";
let restClass = "apiUsuarios";

/*
  Generated class for the UserProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserProvider {
  user:{id:any, name:string, email:string, register_date:string};
  private fbuser: firebase.User;

  constructor(public http: HttpClient, public afAuth: AngularFireAuth) {
    console.log('Hello UserProvider Provider');
  }

  get_usuario(id, usuario_id) {
    let credentials = {
      "class": restClass,
      "method": "get_usuario",
      "id": id,
      "usuario_id": usuario_id
    };
    return new Promise((resolve, reject) => {
      this.http.post(restUrl, JSON.stringify(credentials), {headers: this.getHeaders()})
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  set_usuario_senha(id, senha){
    let credentials = {
      "class": restClass,
      "method": "set_usuario_senha",
      "id": id,
      "senha": senha
    };
    return new Promise((resolve, reject) => {
      this.http.post(restUrl, JSON.stringify(credentials), {headers: this.getHeaders()})
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  set_usuario(id, dados){
    let credentials = {
      "class": restClass,
      "method": "set_usuario",
      "id": id,
      "dados": dados
    };
    
    if(id){
      if(dados.senha.length !== 0){
        var user = firebase.auth().currentUser;
  
        user.updatePassword(dados.senha).then(function() {
          // Update successful.
        }).catch(function(error) {
          return error;
        });
      }
    }
    
    return new Promise((resolve, reject) => {
      this.http.post(restUrl, JSON.stringify(credentials), {headers: this.getHeaders()})
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  set_usuario_foto(id, foto){
    let credentials = {
      "class": restClass,
      "method": "set_usuario_foto",
      "id": id,
      "foto": foto
    };

    return new Promise((resolve, reject) => {
      this.http.post(restUrl, JSON.stringify(credentials), {headers: this.getHeaders()})
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  set_reportar(id, dados){
    let credentials = {
      "class": restClass,
      "method": "set_reportar",
      "id": id,
      "dados": dados
    };
    
    return new Promise((resolve, reject) => {
      this.http.post(restUrl, JSON.stringify(credentials), {headers: this.getHeaders()})
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  set_usuarios_amigos(id, amigo_id, aceitar){
    let credentials = {
      "class": restClass,
      "method": "set_usuarios_amigos",
      "id": id,
      "amigo_id": amigo_id,
      "aceitar": aceitar
    };
    return new Promise((resolve, reject) => {
      this.http.post(restUrl, JSON.stringify(credentials), {headers: this.getHeaders()})
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  get_usuarios_amigos(id, tipo) {
    let credentials = {
      "class": restClass,
      "method": "get_usuarios_amigos",
      "id": id,
      "tipo": tipo
    };

    return new Promise((resolve, reject) => {
      this.http.post(restUrl, JSON.stringify(credentials), {headers: this.getHeaders()})
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
    
  }

  get_usuarios(nome, usuario_id) {
    let credentials = {
      "class": restClass,
      "method": "get_usuarios",
      "nome": nome,
      "usuario_id": usuario_id
    };

    return new Promise((resolve, reject) => {
      this.http.post(restUrl, JSON.stringify(credentials), {headers: this.getHeaders()})
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
    
  }

  get_estados_cidades() {
    let credentials = {
      "class": restClass,
      "method": "get_estados_cidades"
    };

    return new Promise((resolve, reject) => {
      this.http.post(restUrl, JSON.stringify(credentials), {headers: this.getHeaders()})
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
    
  }

  buscar_usuarios(id, buscar) {
    let credentials = {
      "class": restClass,
      "method": "buscar_usuarios",
      "id": id,
      "buscar": buscar
    };

    return new Promise((resolve, reject) => {
      this.http.post(restUrl, JSON.stringify(credentials), {headers: this.getHeaders()})
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
    
  }

  getHeaders(){
   
    return new HttpHeaders(
      {'Content-Type':'application/json',
      'Access-Control-Allow-Origin':'*',
      'Access-Control-Allow-Headers':'*',
      'Accept':'*',
      'Token':'Basic' + btoa('talkingbus' + ":" + 'zx96@28#')
      });
  }


}
