//Llamamos a las funciones de main
const { remote } = require('electron')
const main = remote.require('./main') 
const seleccionList = document.getElementById('seleccionprov');
let proveedores = []
let editingStatus = false;
let editiserId = '';

//Se mustran los proveedores guardados de la bd de lado izquierdo
function renderProveedores(proveedores){
    seleccionList.innerHTML= '<option selected>Elige un proveedor</option>';
    
    proveedores.forEach(element => {
        seleccionList.innerHTML += `
                  <option value = "${element.Compania}" > ${element.Compania} </option>
        `
    });
}

const getProveedores = async () =>{
    proveedores = await main.getProveedores();
    console.log(proveedores);
    renderProveedores(proveedores);
}


async function init(){
    await getProveedores();
   // await getCantidad();
}

init();
