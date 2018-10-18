import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

let restUrl = "http://tcc3.pelocelular.com.br/rest.php";
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

  get_pontos_linhas(ponto_id){
    let credentials = {
      "class": restClass,
      "method": "get_pontos_linhas",
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

  set_pontos_linhas(ponto_id, selecionados){
    let credentials = {
      "class": restClass,
      "method": "set_pontos_linhas",
      "ponto_id": ponto_id,
      "selecionados": selecionados
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

  get_linhas(ponto_id){
    let credentials = {
      "class": restClass,
      "method": "get_linhas",
      "ponto_id": ponto_id,
      "cidade_id": "75"
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

  get_linha_pontos(linha_id){
    let credentials = {
      "class": restClass,
      "method": "get_linha_pontos",
      "linha_id": linha_id
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

  set_ponto(id, endereco){
    let credentials = {
      "class": restClass,
      "method": "set_ponto",
      "id": id,
      "endereco": endereco
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

  get_classificacoes(){
    let credentials = {
      "class": 'apiClassificacao',
      "method": "get_classificacoes"
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

  get_classificacao_nivel(){
    let credentials = {
      "class": 'apiClassificacao',
      "method": "get_classificacao_nivel"
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
  
  set_usuarios_ponto_class(id, ponto_id, classificacoes){
    let credentials = {
      "class": 'apiClassificacao',
      "method": "set_usuarios_ponto_class",
      "id": id,
      "ponto_id": ponto_id,
      "classificacoes": classificacoes
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

  get_linhas_itinerario(linha_id){
    let credentials = {
      "class": restClass,
      "method": "get_linhas_itinerario",
      "linha_id": linha_id
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


  get_itinerario_linhas(itinerario){
    let credentials = {
      "class": restClass,
      "method": "get_itinerario_linhas",
      "itinerario": itinerario
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



  get_horarios(linha_id){
    let credentials = {
      "class": restClass,
      "method": "get_horarios",
      "linha_id": linha_id
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
