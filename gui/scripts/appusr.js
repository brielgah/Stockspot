//Llamamos a las funciones de main
const { remote } = require('electron');
const main = remote.require('./main')
const usersList = document.getElementById('usuarios');
let users = []
let editingStatus = false;
let editiserId = '';

/*Definimos el evento enviar del formulario
productForm.addEventListener('submit' , async (e) =>{
    e.preventDefault();
    //Se definen los elementos para insertar un nuevo producto
    //Se enviaran por el objeto nweProduct
    const newProduct = {
        name: productName.value,
        price: productPrice.value,
        color: productColor.value,
        stock: productStock.value,
        description: productDescription.value
    }

    if(!editingStatus){
        const result = await main.createProduct(newProduct)
        console.log(result);
        //Alerta de sweetalert definida en index.html
        swal({
            icon: "success",
        });
    }else{
        await main.updateProduct(editproductId, newProduct);
        editingStatus = false;
        editproductId = '';
        //Alerta de sweetalert
        swal({
            icon: "info",
            title: 'Producto Actualizado',
            width: 600,
        });
    }
    
    productForm.reset();
    productName.focus();

    getProducts();
    getCantidad();
})

//Funcion de eleminar y alertas
async function deleteProduct(id){
    const response = confirm('❓ || ¿Esta seguro que desea eliminar este producto?')
    if(response){
        await main.deleteProduct(id)
        await getProducts();
        await getCantidad();
        productForm.reset();
        productName.focus();
        
        swal({
            text: "Eliminado",
            icon: "success",
        });

    }
    return;
}

async function editProduct(id){
    const product = await main.getProductById(id);
    productName.value = product.name;
    productPrice.value = product.price;
    productColor.value = product.color;
    productStock.value = product.stock;
    productDescription.value = product.description;

    editingStatus = true;
    editproductId = product.id;
    //await getProducts();
}*/

//Se mustran los productos guardados de la bd de lado izquierdo
function renderUsers(users){
    usersList.innerHTML= '';
    users.forEach(element => {
        usersList.innerHTML += `
                <tr>
                  <th>
                    <button class="navbar-toggler" type="button" >
                      <i class="fas fa-times"></i>
                    </button>
                  </th>
                  <td scope="row">${element.Nombre}</td>
                  <td>${element.Correo_Electronico}</td>
                  <td>${element.Sueldo}</td>
                  <td>${element.Sexo}</td>
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
let edad;
let correo;
let sueldo;
let sexo;
let password;


let sw = 0;

btnIngresar.onclick = function (){
    sw = 1;
    
};
btnModificar.onclick = function (){
    modifyUser();
    nombre = document.getElementById("mnombreInput");
    edad = document.getElementById("medadInput");
    correo = document.getElementById("memailInput");
    sueldo = document.getElementById("msueldoInput");
    sexo = document.getElementById("msexoInput");
    password = document.getElementById("mpasswordInput");

    nombre.value = "";
    correo.value = "";
    edad.value = "";
    sueldo.value = "";
    password.value = "";
    sexo.selectedIndex = 0;


    getUsers();
    
};


btnEliminar.onclick = function(){
    eliminarUser();
}

btnConsulta.onclick = function(){
    searchUser();
}

const eliminarUser =async ()=>{
    email = document.getElementById("eemailInput");
    password = document.getElementById("epasswordInput");

    const usuario = {email:email.value, password:password.value};
    console.log(usuario);

    await main.deleteUser(usuario);
    email.value = "";
    password.value="";
    getUsers();

}   


btnGuardar.onclick = function (){
        setUser();
        getUsers();
    

       
    
};

let cpy;



const searchUser = async()=>{
    sw = 3;
    nombre = document.getElementById("mnombreInput");
    edad = document.getElementById("medadInput");
    correo = document.getElementById("memailInput");
    sueldo = document.getElementById("msueldoInput");
    sexo = document.getElementById("msexoInput");
    password = document.getElementById("mpasswordInput");

    const usuario = {correo:correo.value,password:password.value};
    
        cpy = await main.searchUser(usuario);

        nombre.value = cpy.Nombre;
        correo.value = cpy.Correo_Electronico;
        edad.value = cpy.Edad;
        sueldo.value = cpy.Sueldo;
        sexo.value = cpy.Sexo;
        


}


const modifyUser = async()=>{

    
        nombre = document.getElementById("mnombreInput");
        edad = document.getElementById("medadInput");
        correo = document.getElementById("memailInput");
        sueldo = document.getElementById("msueldoInput");
        sexo = document.getElementById("msexoInput");
        password = document.getElementById("mpasswordInput");

        const usuario = {id:null, nombre:nombre.value, edad:parseInt(edad.value), 
            correo:correo.value, sueldo:parseFloat(sueldo.value), sexo:sexo.value, password:password.value};

        await main.modifyUser(sw, cpy, usuario);
        sw = 0;
        cpy = {};

       
    
    
};



const setUser = async() =>{
    nombre = document.getElementById("nombreInput");
    edad = document.getElementById("edadInput");
    correo = document.getElementById("emailInput");
    sueldo = document.getElementById("sueldoInput");
    sexo = document.getElementById("sexoInput");
    password = document.getElementById("passwordInput");

    

    const usuario  ={id:null, nombre:nombre.value, edad:parseInt(edad.value), 
                     correo:correo.value, sueldo:parseFloat(sueldo.value), sexo:sexo.value, password:password.value};
    
    await main.createUser(usuario);

  

}
const getUsers = async () =>{
    users = await main.getUsers();
    renderUsers(users);
}

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
    
    await getUsers();
   // await getCantidad();
}

function filtrar() {
    // Declare variables
      var input, filter, table, tr, td, i, txtValue;
      input = document.getElementById("busquedaInput");
      filter = input.value.toUpperCase();
      table = document.getElementById("usuarios");
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
