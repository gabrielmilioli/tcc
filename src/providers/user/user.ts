import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

let restUrl = "http://tcc.pelainternetsistemas.com.br/rest.php";
let restClass = "apiUsuarios";

/*
  Generated class for the UserProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserProvider {
  user:{id:any, name:string, email:string, Registrar_date:string};

  constructor(public http: HttpClient) {
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

  set_usuarios_mensagens(id, amigo_id, mensagem) {
    let credentials = {
      "class": restClass,
      "method": "set_usuarios_mensagens",
      "id": id,
      "amigo_id": amigo_id,
      "mensagem": mensagem
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

  get_usuarios_mensagens(id, amigo_id) {
    let credentials = {
      "class": restClass,
      "method": "get_usuarios_mensagens",
      "id": id,
      "amigo_id": amigo_id
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

  getHeaders(){
   
    return new HttpHeaders(
      {'Content-Type':'application/json',
      'Access-Control-Allow-Origin':'*',
      'Access-Control-Allow-Headers':'*',
      'Accept':'*',
      'Token':'Basic' + btoa('talkingbus' + ":" + 'zx96@28#')
      });

    //console.log(headers);
    //return headers;
  }


}
