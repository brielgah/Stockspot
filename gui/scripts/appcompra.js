//Llamamos a las funciones de main
const { remote } = require('electron')
const main = remote.require('./main') 

let proveedores = [];
let products = [];
let suma = 0.00;
let editingStatus = false;
let editiserId = '';
const productList = document.getElementById('productosc');
const sumaList = document.getElementById('sumita');
const carritoList = document.getElementById('tcarrito');
const btnAgregar = document.getElementById('agregar');
const btnCarrito = document.getElementById('carrito');
const btnRcompra = document.getElementById('RCompra');
const btnBorrarcompra = document.getElementById('bcompra');
//variables carrito
var table = document.getElementById('tabla'),rIndex;
var tablec = document.getElementById('tablec'),rIndex;
var seleccion;
var seleccionc;
var cantidad = 0;
var carrito = [];
var eliminacionCarrito;
//Funciones carrito
var auxi;
var eliminar;
//Funciones carrito
function eliminar(elimina)
{
  var carritoTemp = [];
  for(var i=0;i<carrito.length;i++)
  {
    if(!(carrito[i].nombre === elimina))
    {
      carritoTemp.push(carrito[i]);
      //console.log("borrados");
    }
  }
  carrito = carritoTemp;
  renderCarrito();
}


function agregarSeleccionTabla()
{
    for(var i=0;i<table.rows.length;i++)
    {
      table.rows[i].onclick = function()
      {
        rIndex = this.rowIndex;
        var producto = 
        {
          'nombre': this.cells[1].innerHTML,
          'precio': this.cells[3].innerHTML,
          'cantidad': 0
        }
        //console.log(producto);
        seleccion = producto;
      }
    }
}

function agregarSeleccionTablaCarrito()
{
    //console.log(tablec);
    for(var i=0;i<tablec.rows.length;i++)
    {
      //console.log("esto en seleccion tablec");
      tablec.rows[i].onclick = function()
      {
        rIndex = this.rowIndex;
        var producto = 
        {
          'nombre': this.cells[1].innerHTML,
          'precio': this.cells[3].innerHTML,
          'cantidad': this.cells[2].innerHTML
        }
        console.log(producto);
        seleccionc = producto.nombre;
        eliminar(seleccionc);
      }
    }
}
//MOstrar carrito
btnCarrito.onclick = function (){
    renderCarrito();

};

function renderCarrito(){
    sumaList.innerHTML= '';
    carritoList.innerHTML= '';
    suma = 0.00;
    console.log(carrito)
    for(var i=0;i<carrito.length;i++)
    {
        suma = suma + (parseFloat(carrito[i].precio)*parseFloat(carrito[i].cantidad));
        //console.log(carrito.nombre)
        carritoList.innerHTML += `
                  <tr>
                    <th>
                      <button class="navbar-toggler" type="button" id="bcompra">
                        <i class="fas fa-times"></i>
                      </button>
                    </th>
                    <th scope="row">${carrito[i].nombre}</th>
                    <td>${carrito[i].cantidad}</td>
                    <td>$ ${carrito[i].precio}</td>
                  </tr>
    `
      
    }
        sumaList.innerHTML += `
        <span class="texto" >Total: $ ${suma.toFixed(2)}</span>
    `
    agregarSeleccionTablaCarrito();

}


btnRcompra.onclick = async () =>{
    
    for(var i=0;i<carrito.length;i++)
    {
        sw = 3;
        //console.log(carrito.nombre)
        //buscamos el producto para conseguir el stock original
        const producto = {nombre:carrito[i].nombre};
        aux = await main.buscarProducto(producto);   
        //console.log("Se encontro en la query a");
        //console.log(aux);
        aux = {id:aux[0].ID_Producto,nombre:aux[0].Nombre,stock:aux[0].Stock,precio:aux[0].Precio,descripcion:aux[0].Descripcion}
        //sumamos el stock que compramos al que ya tenemos
        aux2 = parseInt(aux.stock)+parseInt(carrito[i].cantidad);
        //console.log(aux2);
        aux.stock = aux2;
        await main.modifyProducto(sw, aux, aux);
        sw = 0; 
        init();
      
    }


};



btnAgregar.onclick = function (){
    cantidad = document.getElementById("cantidadInput").value;
    console.log(cantidad);
    seleccion.cantidad = cantidad;
    carrito.push(seleccion);
    swal({
      icon: "success",
       title: "Se agrego correctamente el producto al carrito"
    });
    //console.log(carrito); 
    
};


function renderProducts(products){
    productList.innerHTML= '';

    products.forEach(element => {
        productList.innerHTML += `
                <tr>
                  <th>
                    <button class="navbar-toggler" id="agregar" type="button" data-bs-toggle="modal" data-bs-target="#cantidadPopUp">
                      <i class="fas fa-plus"></i>
                    </button>
                  </th>
                  <td scope="row">${element.Nombre}</td>
                  <td>${element.Stock}</td>
                  <td>${element.Precio}</td>
                  
                </tr>
    `
    });

}



const searchProducto = async()=>{
    sw = 3;
    nombre = document.getElementById("mnombreInput");
    precio = document.getElementById("mprecioInput");
    stock = document.getElementById("mstockInput");
    descripcion = document.getElementById("mdescripcionInput");

    const producto = {nombre:nombre.value};
    
    cpy = await main.searchProducto(producto);

    nombre.value = cpy.Nombre;
    stock.value = cpy.Stock;
    precio.value = cpy.Precio;
    descripcion.value = cpy.Descripcion;

}

const modifyProducto = async()=>{
    nombre = document.getElementById("mnombreInput");
    precio = document.getElementById("mprecioInput");
    stock = document.getElementById("mstockInput");
    descripcion = document.getElementById("mdescripcionInput");
    const producto = {id:null, nombre:nombre.value, precio:parseFloat(precio.value),stock:parseInt(stock.value)
    ,descripcion:descripcion.value};
    await main.modifyProducto(sw, cpy, producto);
    sw = 0;
    cpy = {};  
};

const setProducto = async() =>{
    nombre = document.getElementById("inombreInput");
    precio = document.getElementById("iprecioInput");
    stock = document.getElementById("istockInput");
    descripcion = document.getElementById("idescripcionInput");
    const producto = {id:null, nombre:nombre.value, precio:parseFloat(precio.value),stock:parseInt(stock.value)
    ,descripcion:descripcion.value};
    await main.createProducto(producto);

}

const getProducts = async () =>{
    products = await main.getProducts();
    renderProducts(products);
}
async function init(){
    await getProducts();
    agregarSeleccionTabla();
   // await getCantidad();
}

function filtrar() {
  // Declare variables
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("busquedaInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("productosc");
    tr = table.getElementsByTagName("tr");
    console.log(tr);
    for (i = 0; i < tr.length; i++) {
        console.log(tr)
        td = tr[i].getElementsByTagName("td")[0];
        console.log(td);
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
            tr[i].style.display = "";
            } else {
            tr[i].style.display = "none";
            }
        }
    }
  }

init();
