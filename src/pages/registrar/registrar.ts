import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, LoadingController, NavParams } from 'ionic-angular';
import { AuthServiceProvider } from './../../providers/auth-service/auth-service';
import { HomePage } from '../home/home';
import { FormBuilder, Validators } from '@angular/forms';
import { UserProvider } from '../../providers/user/user';

/**
 * Generated class for the RegistrarPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-registrar',
  templateUrl: 'registrar.html',
})
export class RegistrarPage {
  response:any;
  usuario = {
        "nome": "",
        "email": "",
        "senha": "", 
        "resenha": "",
        "estado": "",
        "cidade": ""
      };
  public RegistrarForm: any;
  messageError = ""
  error = false;
  estados:Array<{id:string, sigla:string}>;
  cidades:Array<{id:string, nome:string}>;
  loading:any;
  id:any;

  constructor(public navParams: NavParams, public formBuilder: FormBuilder, public navCtrl: NavController, 
    public authService:AuthServiceProvider, public alertCtrl: AlertController, 
    public loadingCtrl: LoadingController, public userService: UserProvider) {
      
      this.RegistrarForm = formBuilder.group({
        nome: ['', Validators.required],
        email: ['', Validators.required],
        password: ['', Validators.compose([Validators.minLength(6), Validators.maxLength(20), Validators.required])],
        repassword: ['', Validators.compose([Validators.minLength(6), Validators.maxLength(20), Validators.required])],
      });

  }

  keypress(){
    let { email, password } = this.RegistrarForm.controls;
 
    if (!this.RegistrarForm.valid) {
      if (!email.valid) {
        this.error = true;
        this.messageError = "Email inválido";
      } else {
        this.messageError = "";
      }
 
      if (!password.valid) {
        this.error = true;
        this.messageError ="A senha precisa ter de 6 a 20 caracteres"
      } else {
        this.messageError = "";
      }
    }else {
      console.log("Login Realizado");
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegistrarPage');
  }

  ionViewDidEnter(){
    this.loading = this.loadingCtrl.create({
      content: 'Carregando...'
    });
    this.loading.present();

    this.id = this.navParams.get("id");
    if(this.id){
      this.carregarPerfil(this.id, null);
    }

    this.carregarEstadosCidades();
    
    this.loading.dismiss();
  }

  carregarEstadosCidades(){
    this.userService.get_estados_cidades().then((result) => {
      this.response = result;
      console.log(this.response);
      if(this.response.status === 'success'){
        this.estados = this.response.data.estados;
        this.cidades = this.response.data.cidades;
      }else{ 
        this.alert('Erro', this.response.data);
      }
    }).catch(error=>{
      console.log(error);
      this.alert('Erro', error);
    });
  }

  carregarPerfil(id, usuario_id){
    this.userService.get_usuario(id, usuario_id).then((result) => {
      console.log(result);
      this.response = result;
      if(this.response.status === 'success'){
        console.log(this.response.data);
        this.usuario = this.response.data;
      }else{ 
        this.alert('Erro', this.response.data);
      }
    }).catch(error=>{
      this.alert('Erro', error);
    });
  }

  registrar(){
    this.loading = this.loadingCtrl.create({
      content: 'Criando conta...'
    });
    this.loading.present();

    if(this.usuario.nome.length === 0 || this.usuario.email.length === 0 ||
      this.usuario.senha.length === 0 || this.usuario.resenha.length === 0||
      this.usuario.cidade.length === 0 || this.usuario.estado.length === 0){
        this.alert('Erro', 'Preencha os campos!'); 
        return false;
    }
    if(this.usuario.senha != this.usuario.resenha){
        this.alert('Erro', 'Senhas incompatíveis!'); 
        return false;
    }

    let id = null;
    if(this.id){
      id = this.id;
    }
    
    this.userService.set_usuario(id, this.usuario).then((result) => {
      console.log(result);
      this.response = result;
      if(this.response.status === 'success'){
        let alert = this.alertCtrl.create({
          title: 'Sucesso',
          subTitle: 'Conta criada com sucesso!',
          buttons: [
            {
              text: 'Cancelar',
              role: 'cancel',
              handler: data => {
                console.log('Cancel clicked');
              }
            },
            {
              text: 'Ok',
              handler: data => {
                this.navCtrl.setRoot(HomePage);
              }
            }
          ]
        });
        alert.present();
      }else{ 
        this.alert('Erro', this.response.data);
      }
    }, (err) => {
      // Error log
      this.alert('Erro', err);
    });

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

  onChangeName(event) {
    var regex = new RegExp("^[A-zÀ-ÿçÇ ]+$");
    let value = event._value;
    if (!regex.test(value)) {
      value = value.replace(/[^A-Za-z]/g, '');
      console.log("nao tem string permitida");
      this.usuario.nome = value;
      event._value = value;
      this.onChangeName(event);
    }
    event.setFocus();
    console.log(value);
  }

  onChangeEmail(event) {
    let value = event._value;
    value = value.replace(/[a-z0-9.@]/gi,'');
    console.log(value);
    this.usuario.email=value;
  }
  
}