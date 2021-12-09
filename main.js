
const { app, appusr, BrowserWindow, ipcMain, Notification } = require('electron');
const {getConnection} = require('./database');
const path = require('path'); 


let window;
let winlogin;

function loginWindow () {

winlogin = new BrowserWindow({
    width: 1000,
    height: 700,
    center: true,
    backgroundColor: '#fff', 
    title: 'Run Mountain', 
    resizable: true,
    maximizable: false,
    //autoHideMenuBar: true,
    transparent: true,
    //icon: 
    movable: true,
    webPreferences: {
    // nodeIntegration: true,
    preload:path.join(__dirname, './gui/scripts/login.js')
    }
})

winlogin.loadFile('./gui/index.html');
}


function createWindow(){
    window = new BrowserWindow({
        width: 1000,
        height: 700,
        center: true,
        backgroundColor: '#000', 
        title: 'StockSpot', 
        resizable: true,
        maximizable: false,
        //autoHideMenuBar: true,
        transparent: true,
        //icon: 
        movable: true,
        webPreferences:{
        nodeIntegration: true,
        contextIsolation: false
        }
    })
    window.loadFile('./gui/index.html');
}

function createWindowInv(){
    window = new BrowserWindow({
        width: 1000,
        height: 700,
        center: true,
        backgroundColor: '#000', 
        title: 'Inventario', 
        resizable: true,
        maximizable: false,
        //autoHideMenuBar: true,
        transparent: true,
        movable: true,
        webPreferences:{
        nodeIntegration: true
        }
    })
    window.loadFile('./gui/inventario.html');
}

function createWindowUsr(){
    window = new BrowserWindow({
        width: 1000,
        height: 700,
        center: true,
        show: false,
        backgroundColor: '#000', 
        title: 'Inventario', 
        resizable: true,
        maximizable: false,
        //autoHideMenuBar: true,
        transparent: true,
        movable: true,
        webPreferences:{
        nodeIntegration: true
        }
    })
    window.loadFile('./gui/usuarios.html');
}

function createWindowMenu(){
    window = new BrowserWindow({
        width: 1000,
        height: 700,
        center: true,
        backgroundColor: '#000', 
        title: 'Inventario', 
        resizable: true,
        maximizable: false,
        //autoHideMenuBar: true,
        transparent: true,
        movable: true,
        webPreferences:{
        nodeIntegration: true
        }
    })
    window.loadFile('./gui/menu.html');
}

function createWindowProv(){
    window = new BrowserWindow({
        width: 1000,
        height: 700,
        center: true,
        backgroundColor: '#000', 
        title: 'Inventario', 
        resizable: true,
        maximizable: false,
        //autoHideMenuBar: true,
        transparent: true,
        movable: true,
        webPreferences:{
        nodeIntegration: true
        }
    })
    window.loadFile('./proveedores/menu.html');
}



app.on('activate', () => {
if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
}
})

ipcMain.handle('login', (event, obj) => {
    validatelogin(obj)
});

async function validatelogin(obj) {
const { password } = obj
const {user}= obj 
const conn = await getConnection();
const results = await conn.query ("SELECT * FROM Empleado WHERE Correo_Electronico = ? AND Contraseña = ?", [user, password])
    if (password && user) {
        if(results.length > 0){
            //createWindowUsr()
            //createWindowInv ()
            createWindowMenu()

            //console.log("Usuario Identificado") 
            //winlogin.loadFile('./gui/inventario.html'); 
            window.show()
            winlogin.close()
        }
        else{
            console.log("Usuario No Identificado") 
            winlogin.loadFile('./gui/index.html'); 
            winlogin.show()
            new Notification({
                title: 'StockSpot',
                body: '❌ Contraseña Invalida',
                subtitle: 'Usuario No Identificado',
                timeoutType: 'default'
            }).show();
        }
    }
}


async function createProduct(product){
    try {
        const conn = await getConnection();
        product.price = parseFloat(product.price)
        product.stock = parseFloat(product.stock)
        const result = await conn.query('INSERT INTO product SET ?', product )
        console.log(result)

        new Notification({
            title: 'Run Mountain',
            body: '✔ Producto guardado!',
            subtitle: 'Se mostrara en la bd',
            timeoutType: 'default'
        }).show();

        product.id = result.insertId;
        return product

    }catch (error){
        new Notification({
            title: 'Run Mountain',
            body: '❌ Error'+'\n'+ error,
            subtitle: 'Verificar en bd',
            timeoutType: 'default'
        }).show();
        console.log(error)
    }    
}


async function getProducts(){
    console.log("Hola, esto en main get products")
    const conn = await getConnection();
    const results = await conn.query('SELECT * FROM Producto')
    // const results = await conn.query('SELECT COUNT(*) FROM product');
    console.log(results)
    return results;
}


async function getCantidad(){
    const conn = await getConnection();
    const result = await conn.query('SELECT COUNT(*) AS Cantidad FROM product')
    //console.log(result)
    return result;
}


async function deleteProduct(id){
    const conn = await getConnection();
    const result = await conn.query('DELETE FROM product WHERE id = ?', id)
    console.log(result); 
}


async function getProductById(id){
    const conn = await getConnection();
    const result = await conn.query('SELECT * FROM product WHERE id = ?', id)
    return result[0]; 
}


async function updateProduct(id, product){
    const conn = await getConnection();
    const result = await conn.query('UPDATE product SET ? WHERE id = ?', [product, id]);
    // return result
    console.log(result)
}


async function getUsers(){
    //console.log("Hola, esto en main get usuarios")
    const conn = await getConnection();
    const results = await conn.query('SELECT * FROM Empleado')
  
    //console.log(results)
    return results;
}

async function getProveedores(){
  
    const conn = await getConnection();
    const results = await conn.query('SELECT * FROM Proveedor')
  
    //console.log(results)
    return results;
}

module.exports = {
    loginWindow,
    createWindow,
    createProduct,
    getProducts,
    getCantidad,
    deleteProduct,
    getProductById,
    getUsers,
    getProveedores,
    updateProduct
};
