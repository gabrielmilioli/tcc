import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { PontosProvider } from './../../providers/pontos/pontos';

/**
 * Generated class for the ClassificarPontoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-classificar-ponto',
  templateUrl: 'classificar-ponto.html',
})
export class ClassificarPontoPage {
  ponto_id:any;
  response:any;
  loading:any;
  valoresClassificacao:any;
  classificacaoNivel:Array<{id: string, valor: string, nome: string, cor: string, valorInicial: boolean }>;
  classificacoes:Array<{id: string, metodo: string, pergunta: string, descricao: string }>;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public ponto: PontosProvider,
    public alertCtrl: AlertController, public loadingCtrl: LoadingController) {
    this.ponto_id = this.navParams.get("ponto_id");

    var indexes = [];
    indexes[1] = 3;
    indexes[2] = 3;
    indexes[3] = 3;
    indexes[4] = 3;
    indexes[5] = 3;
    this.valoresClassificacao = indexes;
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter ClassificarPontoPage');
    this.loading = this.loadingCtrl.create({
      content: 'Carregando pontos...'
    });
    this.loading.present();

    this.carregaClassificacaoNivel();
    this.carregaClassificacoes();
    
    this.loading.dismiss();
  }

  carregaClassificacaoNivel(){
    // carregar classificacoes
    this.ponto.get_classificacao_nivel().then((result) => {
      //console.log(result);
      this.response = result;
      if(this.response.status === 'success'){
        this.classificacaoNivel = this.response.data;
      }else{ 
        this.alert('Erro', this.response.data);
      }
    }).catch(error=>{
      console.log(error);
      this.alert('Erro', error);
    });
  }

  carregaClassificacoes(){
    // carregar classificacoes
    this.ponto.get_classificacoes().then((result) => {
      //console.log(result);
      this.response = result;
      if(this.response.status === 'success'){
        this.classificacoes = this.response.data;
      }else{ 
        this.alert('Erro', this.response.data);
      }
    }).catch(error=>{
      console.log(error);
      this.alert('Erro', error);
    });
  }

  classificar(){
    console.log(this.valoresClassificacao);
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
