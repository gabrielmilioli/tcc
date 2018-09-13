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

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public authService: AuthServiceProvider) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      //statusBar.styleDefault();
      statusBar.overlaysWebView(false);
      //statusBar.backgroundColorByHexString('f4f4f4');
      splashScreen.hide();

      this.authService.afAuth.authState.subscribe(user => {
          if (user) {
            this.rootPage = TabsPage;
          } else {
            this.rootPage = HomePage;
          }
        },
        () => {
          this.rootPage = HomePage;
        }
      );

    });
  }
}

