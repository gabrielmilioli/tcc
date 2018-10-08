import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

let restUrl = "http://tcc.pelainternetsistemas.com.br/rest.php";
let restClass = "apiMensagens";

/*
  Generated class for the MensagensProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MensagensProvider {

  constructor(public http: HttpClient) {
    
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

  set_usuarios_mensagens_visualizado(id, amigo_id) {
    let credentials = {
      "class": restClass,
      "method": "set_usuarios_mensagens_visualizado",
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
