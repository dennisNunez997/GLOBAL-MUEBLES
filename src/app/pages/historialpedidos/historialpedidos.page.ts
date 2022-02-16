import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { VendedorService } from 'src/app/services/vendedor.service';
import { ProductoService } from 'src/app/services/producto.service';
import { AngularFireList, AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireAuth } from '@angular/fire/compat/auth';
@Component({
  selector: 'app-historialpedidos',
  templateUrl: './historialpedidos.page.html',
  styleUrls: ['./historialpedidos.page.scss'],
})
export class HistorialpedidosPage implements OnInit {

  @Input() nombre_empresa
  @Input() fecha_pedido
  
  pedidos = []
  vendedores = []
  vendedoreSelected = []
  subtotalArray = []

  subtotalfinal = null;

  total_final = null;

  direccion: string;
  telefono: string;
  email: string;

  //pedidos angularfirelist
  pedidosFiltrExist: any[];
  pedidosExistAngularList: AngularFireList<any>
  filtrpedidosExist: any[];

  //duplicados
  pedidos_duplicados = [];

  //vendedor
  vendedorFltr: any[];
  vendedorAngularList: AngularFireList<any>
  filtrvendedor: any[];



  constructor(
    private modalCtrl: ModalController,
    private vendedorServ: VendedorService,
    private prodServ: ProductoService,
    private afs: AngularFireDatabase,
    private auth: AngularFireAuth
  ) { }

  ngOnInit() {
    //this.showPedidoFinal()
    //this.subTotalFinal()
    this.showEmpresa()

    this.auth.onAuthStateChanged(user => {
      this.pedidosVisulizacion(user.uid)
    })

  }

  pedidosVisulizacion(user_id){
    this.pedidosExistAngularList = this.afs.list('pedido_final/')
    this.pedidosExistAngularList.snapshotChanges().subscribe(
      list => {
        this.pedidosFiltrExist = list.map(item => {
          return{
            $key: item.key,
            ...item.payload.val()
          }
        })
        

        this.filtrpedidosExist = this.pedidosFiltrExist.filter(value => value.id_usuario === user_id && value.empresa_pedido === this.nombre_empresa  && value.fecha_pedido === this.fecha_pedido )
        this.filtrpedidosExist.map(dta => {
          console.log("nombre: "+dta.nombre_pedido+"fecha: "+dta.fecha_pedido)
        })
        this.pedidos_duplicados = Array.from(this.filtrpedidosExist.reduce((map, obj) => map.set(obj.nombre_pedido, obj), new Map()).values())
        
        this.total_final = this.pedidos_duplicados.map(data => data.subtotal).reduce((sum, current) => sum + current, 0)
        
      }
    )
  }

  

  showEmpresa(){

    this.vendedorAngularList = this.afs.list('vendedor/')
    this.vendedorAngularList.snapshotChanges().subscribe(
      list => {
        this.vendedorFltr = list.map(item => {
          return{
            $key: item.key,
            ...item.payload.val()
          }
        })
        this.filtrvendedor = this.vendedorFltr.filter(value => value.nombre_empresa === this.nombre_empresa)
        this.filtrvendedor.map(dta => {
          this.direccion = dta.direccion_vendedor
          this.telefono = dta.telefono_vendedor
          this.email = dta.email_vendedor
        })
      }
    )

    /*
    
    this.vendedorServ.getVendedor().subscribe(
      list => {
        this.vendedores = list.map(item => {
          return {
            $key: item.key,
            ...item.payload.val()
          }
        })
        this.vendedores.map(item => {
          console.log("empresa1: "+item.empresa_pedido)
          console.log("empresa2: "+this.nombre_empresa)           
          if(item.empresa_pedido === this.nombre_empresa){
            this.direccion = item.direccion_vendedor
            this.telefono = item.telefono_vendedor
            this.email = item.email_vendedor
            console.log("direccion: "+this.direccion)
            console.log("telefono: "+this.telefono)
            console.log("email: "+this.email)
          }
        })
      }
    )
    */
    
  }

  /*
    showPedidoFinal()
  {
    this.prodServ.getPedidoFinal().subscribe(data => {
      data.map((item) => {
        if(item.empresa_pedido === this.nombre_empresa){
          this.pedidos.push({
            cantidad_pedido: item.cantidad_pedido,
            categoria_pedido: item.categoria_pedido,
            empresa_pedido: item.empresa_pedido,
            id_pedido: item.id_pedido,
            id_prod: item.id_prod,
            imagen_pedido: item.imagen_pedido,
            nombre_pedido: item.nombre_pedido,
            precio_pedido: item.precio_pedido
          })
        }
      })
    })
  }
  */
  

  close(){
    this.modalCtrl.dismiss()
  }

}
