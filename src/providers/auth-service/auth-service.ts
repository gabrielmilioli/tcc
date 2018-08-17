import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

let restUrl = "http://tcc.pelainternetsistemas.com.br/rest.php";
let restClass = "TalkingBus";

/*
  Generated class for the AuthServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthServiceProvider {
  public loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public user: BehaviorSubject<object> = new BehaviorSubject<object>({});
  public userData:any;

  constructor(public http: HttpClient) {
    //console.log('Hello AuthServiceProvider Provider');
  }

  get_user() {
    return this.userData;
  }

  get_user_id() {
    return this.userData.id;
  }

  set_user(object) {
    this.userData = object;
    //console.log('userData', this.userData);
    //this.user.next(object);
  }

  get get_logged() {
    return this.loggedIn.asObservable();
  }

  set_logged(status) {
    this.loggedIn.next(status);
  }

  login(credentials) {
    //console.log(credentials);
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
    //console.log(credentials);
    credentials.class = restClass;
    credentials.method = "register";
    
    return new Promise((resolve, reject) => {
      

      this.http.post(restUrl, JSON.stringify(credentials), {headers: this.getHeaders()})
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
    
  }

  check_login(credentials) {
    //console.log(credentials);
    credentials.class = restClass;
    credentials.method = "check_login";

    return new Promise((resolve, reject) => {
      this.http.post(restUrl, JSON.stringify(credentials), {headers: this.getHeaders()})
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
    
  }

  
  get_friends() {
    let user = this.get_user();
    
    let credentials = {
      "class": restClass,
      "method": "get_friends",
      "id": user.id
    };

    //console.log(credentials);
    
    return new Promise((resolve, reject) => {
      this.http.post(restUrl, JSON.stringify(credentials), {headers: this.getHeaders()})
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
    
  }

  get_messages() {
    let user = this.get_user();
    
    let credentials = {
      "class": restClass,
      "method": "get_messages",
      "id": user.id
    };

    //console.log(credentials);
    
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
      'Accept':'*',
      'Token':'Basic' + btoa('talkingbus' + ":" + 'zx96@28#')
      });

    //console.log(headers);
    //return headers;
  }

}
