//Llamamos al formulario de inventario.html por sus Id
const productForm = document.getElementById('productForm');

//Llamamos a las funciones de main
const { remote } = require('electron')
const main = remote.require('./main') 

const productList = document.getElementById('productos');

//let cant = 0
let products = []

let editingStatus = false;
let editproductId = '';


function renderProducts(products){
    productList.innerHTML= '';
    products.forEach(element => {
        productList.innerHTML += `
                <tr>
                    <th>
                      <button class="navbar-toggler" type="button">
                        <i class="fas fa-times"></i>
                      </button>
                    </th>
                    <td scope="row">${element.Nombre}</td>
                    <td>${element.ID_Producto}</td>
                    <td>${element.Precio}</td>
                    <td>${element.Stock}</td>
                    <td>${element.Descripcion}</td>
                  </tr>
        `
    });
}

let btnGuardar = document.getElementById("btnGuardar");
let btnIngresar = document.getElementById("btnIngresar");
let btnModificar = document.getElementById("mbtnModificar");
let btnEliminar = document.getElementById("ebtnEliminar");
let btnConsulta = document.getElementById("btnConsulta");

let nombre;
let precio;
let stock;
let descripcion;
let sw = 0;

btnIngresar.onclick = function (){
    sw = 1; 
};

btnModificar.onclick = function (){
    modifyProducto();
    nombre = document.getElementById("mnombreInput");
    precio = document.getElementById("mprecioInput");
    stock = document.getElementById("mstockInput");
    descripcion = document.getElementById("mdescripcionInput");

    nombre.value = "";
    precio.value = "";
    stock.value = "";
    descripcion.value = "";
    getProducts();
    
};

btnEliminar.onclick = function(){
    eliminarProducto();
}

btnConsulta.onclick = function(){
    searchProducto();
}

const eliminarProducto =async ()=>{
    nombre = document.getElementById("enombreInput");
    const producto = {nombre:nombre.value};

    await main.deleteProducto(producto);
    name.value = "";
    getProducts();

}   

btnGuardar.onclick = function (){
        setProducto();
        getProducts();        
};

let cpy;

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

function filtrar() {
    // Declare variables
      var input, filter, table, tr, td, i, txtValue;
      input = document.getElementById("busquedaInput");
      filter = input.value.toUpperCase();
      table = document.getElementById("productos");
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

async function init(){
    await getProducts();
   // await getCantidad();
}

init();
