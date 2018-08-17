import { AuthServiceProvider } from './../../providers/auth-service/auth-service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ViewController } from 'ionic-angular';

/**
 * Generated class for the FriendsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-friends',
  templateUrl: 'friends.html',
})
export class FriendsPage {
  friends:any=[{}];
  loading: any;
  response: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public authService: AuthServiceProvider,
    public alertCtrl: AlertController, public loadingCtrl: LoadingController, public viewCtrl: ViewController) {
    //navParams.get("userId");
    
  }

  loadFriends(){
    this.authService.get_friends().then((result) => {
      console.log(result);
      this.response = result;
      if(this.response.status === 'success'){
        this.friends = this.response.data;
        console.log(this.response.data);
      }else{ 
        this.alert('Erro', this.response.data);
      }
    }).catch(error=>{
      this.alert('Erro', error.message);
    });
  }

  alert(title, subTitle) {
    this.loading.dismiss();
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subTitle,
      buttons: ['Ok']
    });
    alert.present();
  }

  openChat(friend_id){
    //this.navCtrl.push();
    let data = { 'friend_id': friend_id };
    this.viewCtrl.dismiss(data);
  }

  ionViewDidEnter() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loading.present();
    
    this.loadFriends();

    this.loading.dismiss();
    
    console.log('ionViewDidEnter FriendsPage');
  }

  back(){
    this.navCtrl.pop();
  }

}
