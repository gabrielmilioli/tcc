import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

let restUrl = "http://tcc.pelainternetsistemas.com.br/rest.php";
let restClass = "apiPontos";

/*
  Generated class for the PontosProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PontosProvider {

  constructor(public http: HttpClient) {
    console.log('Hello PontosProvider Provider');
  }

  get_usuarios_pontos(id) {
    let credentials = {
      "class": restClass,
      "method": "get_usuarios_pontos",
      "id": id
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

  set_usuarios_pontos(id, ponto_id){
    let credentials = {
      "class": restClass,
      "method": "set_usuarios_pontos",
      "id": id,
      "ponto_id": ponto_id
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

  get_pontos(id) {
    let credentials = {
      "class": restClass,
      "method": "get_pontos",
      "id": id
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

  get_ponto(id, ponto_id){
    let credentials = {
      "class": restClass,
      "method": "get_ponto",
      "id": id,
      "ponto_id": ponto_id
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

  set_pontos_classificacoes(id, ponto_id, classificacao){
    let credentials = {
      "class": restClass,
      "method": "set_pontos_classificacoes",
      "id": id,
      "ponto_id": ponto_id,
      "classificacao": classificacao
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
