import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { ProductoService } from 'src/app/services/producto.service';
import { AngularFireList, AngularFireDatabase } from '@angular/fire/compat/database';
import { ProductInfoPage } from '../product-info/product-info.page';

@Component({
  selector: 'app-modal-categoria',
  templateUrl: './modal-categoria.page.html',
  styleUrls: ['./modal-categoria.page.scss'],
})
export class ModalCategoriaPage implements OnInit {

  @Input() categoria;
  textoBuscarProd = '';
  productos= [];
  
  textoBuscarCat = '';
  
  //categoria filter
  CategoryFiltrExist: any[];
  CategoryExistAngularList: AngularFireList<any>
  filtrCategoryExist: any[];

  //duplicados
  productosDuplicados = []

  constructor(
    private modalCtrl: ModalController,
    public alertController: AlertController,
    public prodServ: ProductoService,
    private afs: AngularFireDatabase
    ) { }

  ngOnInit() {
    //this.getProd()
    this.filterCategory()
  }

  filterCategory(){
    this.CategoryExistAngularList = this.afs.list('producto/')
    this.CategoryExistAngularList.snapshotChanges().subscribe(
      list => {
        this.CategoryFiltrExist = list.map(item => {
          return{
            $key: item.key,
            ...item.payload.val()
          }
        })
        
        this.filtrCategoryExist = this.CategoryFiltrExist.filter(value => value.categoria_producto === this.categoria)
        
        this.productosDuplicados = Array.from(this.filtrCategoryExist.reduce((map, obj) => map.set(obj.empresa_proveedor, obj), new Map()).values())
        this.productosDuplicados.map(data => {
          console.log("categoria duplicada: "+data.categoria_producto+" proveedor: "+data.empresa_proveedor)
        })
      }
    )
  }

  async categorySelected(image, categoria, empresa){
    console.log("cat: "+categoria)
    const modal = await this.modalCtrl.create({
      component: ProductInfoPage,
      componentProps: {
        nombre_prod: categoria,
        img_empresa: image,
        nom_empresa: empresa
      }
    })
    return await modal.present()
  }


  buscarProd(event){
    this.textoBuscarCat = event.detail.value;
    console.log("busqueda: "+this.textoBuscarProd)
  }

  getProd(){
    this.prodServ.getProduct().subscribe(data => {
      data.map((item) => {
        console.log("item_categoria: "+item.categoria_producto)
        console.log("categ: "+this.categoria)
        
      if(item.categoria_producto === this.categoria){
        this.productos.push({
          nombre_producto: item.nombre_producto,
          descripcion_producto: item.descripcion_producto,
          cantidad_producto: item.cantidad_producto,
          categoria_producto: item.categoria_producto,
          empresa_proveedor: item.proveedor_empresa,
          precio_producto: item.precio_producto,
          image_producto: item.image_producto

        })
      }
     
      })
    })
  }

  salir(){
    this.modalCtrl.dismiss();
  }
  

}
