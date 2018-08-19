import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

/**
 * Generated class for the PlacePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-place',
  templateUrl: 'place.html',
})
export class PlacePage {
  place = {
    "id": "",
    "name": "",
    "address": "",
    "register_date": "",
    "photo": "",
    "comments": []
  };
  loading:any;
  response:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public authService: AuthServiceProvider,
    public alertCtrl: AlertController, public loadingCtrl: LoadingController) {

  }

  ionViewDidEnter(){
    this.place.id = this.navParams.get('id');
    console.log("id = "+this.place.id);
    this.loading = this.loadingCtrl.create({
      content: 'Carregando ponto...'
    });
    this.loading.present();

    this.loadPlace();

    this.loading.dismiss();
  }

  loadPlace(){
    this.authService.get_place(this.place.id).then((result) => {
      //console.log(result);
      this.response = result;
      if(this.response.status === 'success'){
        this.place = this.response.data;
      }else{ 
        this.alert('Erro', this.response.data);
      }
    }).catch(error=>{
      this.alert('Erro', error);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PlacePage');
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

}
