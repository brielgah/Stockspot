//Llamamos a las funciones de main
const { remote } = require('electron')
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
                    <button class="navbar-toggler" type="button">
                      <i class="fas fa-times"></i>
                    </button>
                  </th>
                  <th scope="row">${element.Nombre}</th>
                  <td>${element.Correo_Electronico}</td>
                  <td>${element.Sueldo}</td>
                  <td>${element.Sexo}</td>
                </tr>

        `
    });
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
    //console.log("Hola, esto en init de usuario")
    await getUsers();
   // await getCantidad();
}

init();
