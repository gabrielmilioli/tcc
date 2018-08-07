import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { RegisterPage } from '../register/register';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  email: string;
  password: string;

  constructor(public navCtrl: NavController) {

  }

  login() {
    console.log("email: " + this.email);
    console.log("password: " + this.password);
  }

  gotoRegister() {
    this.navCtrl.push(RegisterPage);
  }

}
