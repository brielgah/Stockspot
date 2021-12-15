//Llamamos al formulario de inventario.html por sus Id

//Llamamos a las funciones de main
const { remote } = require('electron')
const main = remote.require('./main') 
const ventasList = document.getElementById('ventitas');
let editingStatus = false;
let editproductId = '';

async function init(){
    // current timestamp in milliseconds
    let ts = Date.now();

    let date_ob = new Date(ts);
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();
    let fecha = year + "-" + month + "-" + date;
    // prints date & time in YYYY-MM-DD format
    console.log(year + "-" + month + "-" + date);
    cpy = await main.buscarFechaVenta(fecha);
    if (cpy[0] === undefined ){
        await main.createFechaVenta(fecha);
        cpy = await main.buscarFechaVenta(fecha);
    }
    ventasList.innerHTML= '';
    cpy.forEach(element => {
        console.log(cpy)
        ventasList.innerHTML += `
            <h1 class="text-center">$ ${element.Monto}</h1>
    `
    });
}

init();
