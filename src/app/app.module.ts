import { NovoPontoPage } from './../pages/novo-ponto/novo-ponto';
import { LinhasPage } from './../pages/linhas/linhas';
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
import { RegistrarPage } from '../pages/registrar/registrar';
import { TabsPage } from '../pages/tabs/tabs';
import { MenuPage } from '../pages/menu/menu';
import { MapPage } from '../pages/map/map';
import { ChatPage } from '../pages/chat/chat';
import { MessagesPage } from '../pages/messages/messages';
import { ProfilePage } from '../pages/profile/profile';
import { PlacesPage } from '../pages/places/places';
import { AboutPage } from '../pages/about/about';
import { SettingsPage } from '../pages/settings/settings';
import { AmigosPage } from '../pages/amigos/amigos';
import { PlacePage } from './../pages/place/place';
import { HorariosPage } from '../pages/horarios/horarios';
import { HorariosSalvosPage } from './../pages/horarios-salvos/horarios-salvos';
import { ClassificarPontoPage } from './../pages/classificar-ponto/classificar-ponto';

import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { UserProvider } from '../providers/user/user';
import { PontosProvider } from '../providers/pontos/pontos';
import { Network } from '@ionic-native/network';
import { FileTransfer } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Camera } from '@ionic-native/camera';
import * as firebase from 'firebase';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';

export const firebaseConfig = {
  apiKey: "AIzaSyBf0JuSDTO44vDVOKg8swsVNoVJCsIHji4",
  authDomain: "talkingbus-211300.firebaseapp.com",
  databaseURL: "https://talkingbus-211300.firebaseio.com",
  projectId: "talkingbus-211300",
  storageBucket: "talkingbus-211300.appspot.com",
  messagingSenderId: "138261567653"
};

firebase.initializeApp(firebaseConfig);

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    RegistrarPage,
    TabsPage,
    MenuPage,
    MapPage,
    ChatPage,
    MessagesPage,
    ProfilePage,
    PlacesPage,
    AboutPage,
    SettingsPage,
    AmigosPage,
    PlacePage,
    HorariosPage,
    HorariosSalvosPage,
    ClassificarPontoPage,
    LinhasPage,
    NovoPontoPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {tabsPlacement: 'bottom', tabsHideOnSubPages: true}),
    HttpClientModule,
    FormsModule,
    AngularFireModule.initializeApp(firebaseConfig)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    RegistrarPage,
    TabsPage,
    MenuPage,
    MapPage,
    ChatPage,
    MessagesPage,
    ProfilePage,
    PlacesPage,
    AboutPage,
    SettingsPage,
    AmigosPage,
    PlacePage,
    HorariosPage,
    HorariosSalvosPage,
    ClassificarPontoPage,
    LinhasPage,
    NovoPontoPage
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
    PontosProvider,
    Network,
    FileTransfer,
    File,
    Camera,
    AngularFireAuth
  ]
})
export class AppModule {}
