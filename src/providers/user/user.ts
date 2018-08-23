import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

let restUrl = "http://tcc.pelainternetsistemas.com.br/rest.php";
let restClass = "Users";

/*
  Generated class for the UserProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserProvider {
  user:{id:any, name:string, email:string, register_date:string};

  constructor(public http: HttpClient) {
    console.log('Hello UserProvider Provider');
  }

  get_user(id) {
    let credentials = {
      "class": restClass,
      "method": "get_user",
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
