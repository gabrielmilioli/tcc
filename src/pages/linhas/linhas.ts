import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { PontosProvider } from '../../providers/pontos/pontos';

/**
 * Generated class for the LinhasPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-linhas',
  templateUrl: 'linhas.html',
})
export class LinhasPage {
  ponto_id:any;
  ponto_nome:string;
  response:any;
  loading:any;
  linhas:Array<{id: string, nome: string, numero: string, data_ultima_alt: string, itinerarios: [{itinerario:string}], selecionado:boolean }> = [];
  pontos_linhas:Array<{id: string, nome: string, numero: string, data_ultima_alt: string, itinerarios: [{itinerario:string}], selecionado:boolean }> = [];
  todasLinhas:Array<{id: string, nome: string, numero: string, data_ultima_alt: string, itinerarios: [{itinerario:string}], selecionado:boolean }>;
  selecionados = [];
  mostrarBuscar:boolean = false;
  editar:boolean = false;
  inputBuscar:string;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public pontosProvider: PontosProvider,
    public alertCtrl: AlertController, public loadingCtrl: LoadingController) {
    this.ponto_id = this.navParams.get("ponto_id");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LinhasPage');
  }

  ionViewDidEnter() {
    this.loading = this.loadingCtrl.create({
      content: 'Carregando linhas...'
    });
    this.loading.present();
    this.linhas = [];
    this.pontos_linhas = [];
    this.pontosProvider.get_linhas(this.ponto_id).then((result) => {
      console.log(result);
      this.response = result;
      if(this.response.status === 'success'){
        this.todasLinhas = this.response.data;
        let linhas = [];
        this.todasLinhas.forEach(element => {
          if(element.selecionado){
            linhas.push(element);
          }
        });
        this.linhas = linhas;
        this.pontos_linhas = linhas;
      }else{ 
        this.alert('Atenção', this.response.data);
      }
    }).catch(error=>{
      console.log(error);
      this.alert('Atenção', error);
    });

    this.loading.dismiss();
  }

  salvarLinhas() {
    this.linhas.forEach(element => {
      if(element.selecionado){
        this.selecionados.push(element.id);
      }
    });

    this.pontosProvider.set_pontos_linhas(this.ponto_id, this.selecionados).then((result) => {
      console.log(result);
      this.response = result;
      if(this.response.status === 'success'){
        this.ionViewDidEnter();
      }else{ 
        this.alert('Atenção', this.response.data);
      }
    }).catch(error=>{
      console.log(error);
      this.alert('Atenção', error);
    });
  }

  itinerarios(i){
    let message = "";
    let count = 0;
    let total = this.linhas[i].itinerarios.length;
    this.linhas[i].itinerarios.forEach(element => {
      count++;
      if(count === total){
        message += element.itinerario;
      }else{
        message += element.itinerario+" - ";
      }
    });
    this.alert("Itinerários", message);
  }

  buscar(e){
    let val = e.target.value;
    let results = [];
    let buscarPor = val;
    let linhas = this.todasLinhas;
    if (this.editar) {
      linhas = this.todasLinhas;
    } else {
      linhas = this.pontos_linhas;
    }
    
    for (var i=0 ; i < linhas.length ; i++)
    {
      let nome = linhas[i].nome;
      let numero = linhas[i].numero;
      console.log(buscarPor+" = "+nome+" - "+numero);
      if(nome.indexOf(buscarPor) != -1 || numero.indexOf(buscarPor) != -1){
        results.push(linhas[i]);
      }
    }

    if(results.length === 0){
      results = linhas;
    }

    this.linhas = results;

    //console.log(this.pontos);
  }

  toggleEditar(){
    this.loading = this.loadingCtrl.create({
      content: 'Carregando...'
    });
    this.loading.present();

    if (this.editar) {
      this.editar = false;
      this.linhas = this.pontos_linhas;
    } else {
      this.editar = true;
      this.linhas = this.todasLinhas;
    }

    this.loading.dismiss();
  }

  alert(title, subTitle) {
    if(this.loading){
      this.loading.dismiss();
    }
    
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subTitle,
      buttons: ['Ok']
    });
    alert.present();
  }

}
