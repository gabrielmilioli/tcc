import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

let restUrl = "https://4p.pelainternet.com.br/rest.php";
let restClass = "TalkingBus";

/*
  Generated class for the AuthServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthServiceProvider {

  constructor(public http: HttpClient) {
    console.log('Hello AuthServiceProvider Provider');
  }

  login(credentials) {
    console.log(credentials);
    credentials.class = restClass;
    credentials.method = "login";

    return new Promise((resolve, reject) => {
      

      this.http.post(restUrl, JSON.stringify(credentials), {headers: this.getHeaders()})
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
    
  }

  register(credentials) {
    console.log(credentials);
    credentials.class = restClass;
    credentials.method = "register";
    let headers = this.getHeaders();

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
    /*let headers = new HttpHeaders();

    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Accept', 'application/json');
    headers.append('Authorization', 'Basic' + btoa('talkingbus' + ":" + 'zx96@28#'));
*/

    let headers = new HttpHeaders(
      {'Content-Type':'application/json',
      'Access-Control-Allow-Origin':'*',
      'Accept':'*',
      'Authorization':'Basic' + btoa('talkingbus' + ":" + 'zx96@28#')
      });

    console.log(headers);
    return headers;
  }

}
