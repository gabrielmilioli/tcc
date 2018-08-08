import { Component } from '@angular/core';

import { MenuPage } from '../menu/menu';
import { MapPage } from '../map/map';
import { ChatPage } from '../chat/chat';

/**
 * Generated class for the TabsPage tabs.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  menuRoot = MenuPage;
  mapRoot = MapPage;
  chatRoot = ChatPage;


  constructor() {
    
  }
}
