import { TabsPage } from './../pages/tabs/tabs';
import { AuthServiceProvider } from './../providers/auth-service/auth-service';
import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = HomePage;
  response:any;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public authService: AuthServiceProvider) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      //statusBar.styleDefault();
      statusBar.overlaysWebView(false);
      statusBar.backgroundColorByHexString('B43C3C');
      splashScreen.hide();

      this.authService.afAuth.authState.subscribe(user => {
        this.authService.loginFirebase(user.email).then((result) => {
          this.response = result;
          if(this.response.status === 'success'){
            localStorage.setItem('user', JSON.stringify(this.response.data));
            
            this.authService.set_logged(true);
            this.authService.set_user(this.response.data);
            this.rootPage = TabsPage;
          }else{ 
            console.log(this.response.data);
          }
        }).catch(error=>{
          console.log(error.message);
        });
        },
        () => {
          this.rootPage = HomePage;
        }
      );

    });
  }
}

