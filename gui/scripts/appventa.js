//Llamamos a las funciones de main
const { remote } = require('electron')
const main = remote.require('./main') 

let proveedores = [];
let products = [];
let editingStatus = false;
let editiserId = '';
let suma = 0.00;
const ventitacList = document.getElementById('ventitac');
const productList = document.getElementById('productosv');
const carritoList = document.getElementById('tcarrito');
const btnAgregar = document.getElementById('agregar');
const btnCarrito = document.getElementById('carrito');
const btnRVenta = document.getElementById('RVenta');
//variables carrito
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

function eliminar(elimina)
{
  var carritoTemp = [];
  for(var i=0;i<carrito.length;i++)
  {
    if(!(carrito[i].nombre === elimina))
    {
      carritoTemp.push(carrito[i]);
    }
  }
  carrito = carritoTemp;
  renderCarrito();
}




function agregarSeleccionTabla()
{
    //console.log(table);
    for(var i=0;i<table.rows.length;i++)
    {
      
      table.rows[i].onclick = function()
      {
        rIndex = this.rowIndex;
        var producto = 
        {
          'nombre': this.cells[1].innerHTML,
          'precio': this.cells[3].innerHTML,
          'cantidad': this.cells[2].innerHTML
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
    ventitac.innerHTML= '';
    carritoList.innerHTML= '';
    suma = 0.00
    for(var i=0;i<carrito.length;i++)
    {
        suma = suma + (parseFloat(carrito[i].precio)*parseFloat(carrito[i].cantidad));
        console.log(carrito)
        carritoList.innerHTML += `
                  <tr>
                    <th>
                      <button class="navbar-toggler" type="button">
                        <i class="fas fa-times"></i>
                      </button>
                    </th>
                    <th scope="row">${carrito[i].nombre}</th>
                    <td>${carrito[i].cantidad}</td>
                    <td>$ ${carrito[i].precio}</td>
                  </tr>
    `
      
    }
    ventitac.innerHTML += `
        <span class="texto" >Total: $ ${suma.toFixed(2)}</span>
    `
    agregarSeleccionTablaCarrito();


}

btnRVenta.onclick = async () =>{
    
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
    
        //console.log(aux2);
        aux.stock = parseInt(carrito[i].cantidad);
        await main.modifyProducto(sw, aux, aux);
        sw = 0; 
        //modificar montos de venta
        let ts = Date.now();
        let date_ob = new Date(ts);
        let date = date_ob.getDate();
        let month = date_ob.getMonth() + 1;
        let year = date_ob.getFullYear();
        let fecha = year + "-" + month + "-" + date;
        let monto = await main.buscarMontoVenta(fecha);
        //console.log(monto);
        monto = parseFloat(monto[0].Monto)+suma;
        await main.modifyMontoVenta(fecha, monto.toFixed(2)) 
    }


};

btnAgregar.onclick = function (){
    cantidad = document.getElementById("cantidadInput").value;
    //console.log(seleccion);
    cantidad = parseInt(cantidad);
    //console.log(seleccion.cantidad);
    //console.log(cantidad);
    seleccion.cantidad = parseInt(seleccion.cantidad);
    if(seleccion.cantidad < cantidad || seleccion.cantidad ==  0 || seleccion.cantidad -cantidad < 0){
        console.log("xd");
    }
    else{
            seleccion.cantidad =cantidad;
            carrito.push(seleccion);
            //console.log(carrito); 

    }

    
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

const getProveedores = async () =>{
    proveedores = await main.getProveedores();
    //console.log(proveedores);
    renderProveedores(proveedores);
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
    //console.log(table);
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
