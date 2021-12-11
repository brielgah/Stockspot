//Llamamos a las funciones de main
const { remote } = require('electron')
const main = remote.require('./main') 
const proveedoresList = document.getElementById('prove');
let proveedores = []
let editingStatus = false;
let editiserId = '';

//Se mustran los proveedores guardados de la bd de lado izquierdo
function renderProveedores(proveedores){
    proveedoresList.innerHTML= '';
    proveedores.forEach(element => {
        proveedoresList.innerHTML += `
                <tr>
                  <th>
                    <button class="navbar-toggler" type="button">
                      <i class="fas fa-times"></i>
                    </button>
                  </th>
                  <th scope="row">${element.Compania}</th>
                  <td>${element.Nombre}</td>
                  <td>${element.Numero}</td>
                </tr>

        `
    });
}

const getProveedores = async () =>{
    proveedores = await main.getProveedores();
    renderProveedores(proveedores);
}

let btnGuardar = document.getElementById("btnGuardar");
let btnIngresar = document.getElementById("btnIngresar");
let btnModificar = document.getElementById("mbtnModificar");
let btnEliminar = document.getElementById("ebtnEliminar");
let btnConsulta = document.getElementById("btnConsulta");

let nombre;
let numero;
let compania;

let sw = 0;

btnIngresar.onclick = function (){
    sw = 1;
};

btnModificar.onclick = function (){
    modifyProveedor();
    nombre = document.getElementById("mnombreInput");
    numero = document.getElementById("mnumeroInput");
    compania = document.getElementById("mcompaniaInput");

    nombre.value = "";
    correo.value = "";
    compania.value = "";

    getProveedores();
    
};

btnEliminar.onclick = function(){
    eliminarProveedor();
}

btnConsulta.onclick = function(){
    searchProveedor();
}

const eliminarProveedor =async ()=>{
    numero = document.getElementById("enumeroInput");
    compania = document.getElementById("ecompaniaInput");


    const proveedor = {compania:compania.value, numero:numero.value};
    console.log(proveedor)
    console.log("Hola")
    await main.deleteProveedor(proveedor);
    compania.value = "";
    numero.value="";
    getProveedores();

}   

const setProveedor = async() =>{
    nombre = document.getElementById("inombreInput");
    numero = document.getElementById("inumeroInput");
    compania = document.getElementById("icompaniaInput");
    
    const proveedor = {id:null, nombre:nombre.value, numero:numero.value,compania:compania.value};
    
    await main.createProveedor(proveedor);

  

}


btnGuardar.onclick = function (){
        setProveedor();
        getProveedores();
};

let cpy;


const searchProveedor = async()=>{
    sw = 3;
    nombre = document.getElementById("mnombreInput");
    numero = document.getElementById("mnumeroInput");
    compania = document.getElementById("mcompaniaInput");
        
    const proveedor = {numero:numero.value,compania:compania.value};

    cpy = await main.searchProveedor(proveedor);

    nombre.value = cpy.Nombre;
    numero.value = cpy.Numero;
    compania.value = cpy.Compania;

       
}


const modifyProveedor = async()=>{
        nombre = document.getElementById("mnombreInput");
        numero = document.getElementById("mnumeroInput");
        compania = document.getElementById("mcompaniaInput");
        

        const proveedor = {id:null, nombre:nombre.value, numero:numero.value,compania:compania.value};
        await main.modifyProveedor(sw, cpy, proveedor);
        sw = 0;
        cpy = {};

       
    
    
};


/*function renderCantidad(cant){
    cant.forEach(element => {
        console.log(element.Cantidad)
        document.getElementById('cantidad').innerHTML = element.Cantidad
    });
}*/

//Al utilizarse sql estas funciones seran asincronas
/*const getCantidad = async () =>{
    cant = await main.getCantidad();
    renderCantidad(cant);
}*/

async function init(){
    //console.log("Hola, esto en init de usuario")
    await getProveedores();
   // await getCantidad();
}

init();
