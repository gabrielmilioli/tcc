import { GooglePlus } from '@ionic-native/google-plus';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule }   from '@angular/forms';
import { Facebook }   from '@ionic-native/facebook';
import { Geolocation } from '@ionic-native/geolocation';
import { GoogleMaps } from '@ionic-native/google-maps';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { RegisterPage } from '../pages/register/register';
import { TabsPage } from '../pages/tabs/tabs';
import { MenuPage } from '../pages/menu/menu';
import { MapPage } from '../pages/map/map';
import { ChatPage } from '../pages/chat/chat';
import { MessagesPage } from '../pages/messages/messages';
import { ProfilePage } from '../pages/profile/profile';
import { PlacesPage } from '../pages/places/places';
import { AboutPage } from '../pages/about/about';
import { SettingsPage } from '../pages/settings/settings';
import { FriendsPage } from '../pages/friends/friends';
import { PlacePage } from './../pages/place/place';
import { HorariosPage } from '../pages/horarios/horarios';
import { HorariosSalvosPage } from './../pages/horarios-salvos/horarios-salvos';

import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { UserProvider } from '../providers/user/user';
import { PontosProvider } from '../providers/pontos/pontos';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    RegisterPage,
    TabsPage,
    MenuPage,
    MapPage,
    ChatPage,
    MessagesPage,
    ProfilePage,
    PlacesPage,
    AboutPage,
    SettingsPage,
    FriendsPage,
    PlacePage,
    HorariosPage,
    HorariosSalvosPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {tabsPlacement: 'bottom', tabsHideOnSubPages: true}),
    HttpClientModule,
    FormsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    RegisterPage,
    TabsPage,
    MenuPage,
    MapPage,
    ChatPage,
    MessagesPage,
    ProfilePage,
    PlacesPage,
    AboutPage,
    SettingsPage,
    FriendsPage,
    PlacePage,
    HorariosPage,
    HorariosSalvosPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthServiceProvider,
    Facebook,
    Geolocation,
    GoogleMaps,
    GooglePlus,
    UserProvider,
    PontosProvider
  ]
})
export class AppModule {}
