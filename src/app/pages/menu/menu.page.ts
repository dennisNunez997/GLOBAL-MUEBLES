import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

import { AngularFireAuth, AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireDatabase, AngularFireObject, snapshotChanges } from '@angular/fire/compat/database';
import { AngularFireList } from '@angular/fire/compat/database';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  //user
  userFiltr: any[];
  userAngularList: AngularFireList<any>
  filtruser: any[];

  user = [];
  nombre: string;
  apellido: string;
  email: string;
  imagen: string;
  constructor(
    private navCtrl: NavController,
    private authservice: AuthService,
    private menu:  MenuController,
    private afAuth: AngularFireAuth,    
    private afs: AngularFireDatabase
  ) {}
  
  ngOnInit() {
    this.afAuth.onAuthStateChanged(user=> {
      if(user){
        this.showProfile(user.uid)
      }
    })
  }

  showProfile(uid){
    this.userAngularList = this.afs.list('usuario/')
    this.userAngularList.snapshotChanges().subscribe(
      list => {
        this.userFiltr = list.map(item => {
          return{
            $key: item.key,
              ...item.payload.val()
          }
        })
        this.filtruser = this.userFiltr.filter(value => value.uid === uid)
        this.filtruser.map(data => {
          this.nombre = data.nombre
          this.apellido = data.apellido
          this.imagen = data.imagen          
        })
      }
    )
  }

  goToHome(){
    this.navCtrl.navigateForward("/menu/home")
  }

  goToProfile(){
    this.navCtrl.navigateForward("/menu/profile")
  }

  goToVendedores(){
    this.navCtrl.navigateForward("/menu/list-vendedores")
  }

  goToPromocion(){
    this.navCtrl.navigateForward("/menu/promocion")
  }

  goToPedidos(){
    this.navCtrl.navigateForward("/menu/pedido")
  }

  logout(){
    this.authservice.logoutUser().then(res => {
      console.log(res);
      this.navCtrl.navigateBack('/login');
    }).catch(error => {
      console.log(error);
    })
  }
  closeMenu(){
    this.menu.toggle();
  }


}
