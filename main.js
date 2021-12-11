
const { app, appusr, BrowserWindow, ipcMain, Notification } = require('electron');
const {getConnection} = require('./database');
const path = require('path'); 
const { windowsStore } = require('process');


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

async function refreshCurWindow(){
    window.reload()
}

async function getProducts(){
    console.log("Hola, esto en main get products")
    const conn = await getConnection();
    const results = await conn.query('SELECT * FROM Producto')
    // const results = await conn.query('SELECT COUNT(*) FROM product');
    //console.log(results)
    return results;
}


async function getCantidad(){
    const conn = await getConnection();
    const result = await conn.query('SELECT COUNT(*) AS Cantidad FROM product')
    //console.log(result)
    return result;
}


async function createUser(user){
    try{
        const conn = await getConnection();
        const result = await conn.query('INSERT INTO Empleado (Nombre, Edad, Correo_Electronico, Sueldo, Sexo, Contraseña) values (?,?,?,?,?,?)',
                            [user.nombre, user.edad, user.correo, user.sueldo, user.sexo, user.password]);
        console.log(result)
        
        new Notification({
            title: 'Run Mountain',
            body: '✔ Usuario guardado!   ID:'+result.insertId,
            subtitle: 'Se mostrara en la bd',
            timeoutType: 'default'
        }).show();

        user.id = result.insertId;
        return user
    }catch(error){
        new Notification({
            title: 'Run Mountain',
            body: '❌ Error'+'\n'+ error,
            subtitle: 'Verificar en bd',
            timeoutType: 'default'
        }).show();
        console.log(error)
    }    
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


//Funciones de empleado

async function getUsers(){
    //console.log("Hola, esto en main get usuarios")
    const conn = await getConnection();
    const results = await conn.query('SELECT * FROM Empleado')
  
    //console.log(results)
    return results;
}

async function searchUser(user){
    try{
        const conn = await getConnection();
        
        const result = await conn.query('SELECT * FROM Empleado WHERE Correo_Electronico=? AND Contraseña=?',[user.correo,user.password])
        
        if(result !== []){
            user=result[0];
            new Notification({
                title: 'Run Mountain',
                body: 'Usuario Encontrado!',
                subtitle: 'Adios',
                timeoutType: 'default'
            }).show();
            
        }
        else{
            new Notification({
                title: 'Run Mountain',
                body: 'Usuario No Encontrado!',
                subtitle: 'Adios',
                timeoutType: 'default'
            }).show();
        }
        return user;
    }catch(error){
        new Notification({
            title: 'Run Mountain',
            body: '❌ Error'+'\n'+ error,
            subtitle: 'Verificar en bd',
            timeoutType: 'default'
        }).show();
        console.log(error)
        
    }
}

async function modifyUser(sw,cpy, user){
    if(sw === 3){
            try{
                
                    const conn = await getConnection();
                
                    const id = cpy.ID_Empleado;
                    
                    
                    const result2 = await conn.query('UPDATE Empleado SET Correo_Electronico=?, Nombre=?, Edad=?, Sexo=?, Sueldo=?, Contraseña=?  WHERE ID_Empleado=?',[user.correo, user.nombre, user.edad, user.sexo,user.sueldo,user.password,id])
                   
                    new Notification({
                        title: 'Run Mountain',
                        body: '✔ Usuario Modificado!',
                        subtitle: 'Adios',
                        timeoutType: 'default'
                    }).show();
                    
                
                
        
            }catch(error){
                new Notification({
                    title: 'Run Mountain',
                    body: '❌ Error'+'\n'+ error,
                    subtitle: 'Verificar en bd',
                    timeoutType: 'default'
                }).show();
                console.log(error)
                
            }
    }
    else{
        new Notification({
            title: 'Run Mountain',
            body: '❌ Primero debes introducir un Usuario',
            subtitle: 'Verificar en bd',
            timeoutType: 'default'
        }).show();
    }
}

async function deleteUser(user){
    try{
        const conn = await getConnection();
        
        const result = await conn.query('SELECT ID_Empleado FROM Empleado WHERE Correo_Electronico=? AND Contraseña=?',[user.email,user.password])
        const id = result[0].ID_Empleado;
        const result2 = await conn.query('DELETE FROM Empleado where ID_Empleado=?',id)        


        new Notification({
            title: 'Run Mountain',
            body: '✔ Usuario Eliminado!   ',
            subtitle: 'Adios',
            timeoutType: 'default'
        }).show();
  
    }catch(error){
        new Notification({
            title: 'Run Mountain',
            body: '❌ Error'+'\n'+ error,
            subtitle: 'Verificar en bd',
            timeoutType: 'default'
        }).show();
        console.log(error)
        
    }

}


async function modifyUser(sw,cpy, user){
    if(sw === 3){
            try{
                
                    const conn = await getConnection();
                
                    const id = cpy.ID_Empleado;
                    
                    
                    const result2 = await conn.query('UPDATE Empleado SET Correo_Electronico=?, Nombre=?, Edad=?, Sexo=?, Sueldo=?, Contraseña=?  WHERE ID_Empleado=?',[user.correo, user.nombre, user.edad, user.sexo,user.sueldo,user.password,id])
                   
                    new Notification({
                        title: 'Run Mountain',
                        body: '✔ Usuario Modificado!',
                        subtitle: 'Adios',
                        timeoutType: 'default'
                    }).show();
                    
                
                
        
            }catch(error){
                new Notification({
                    title: 'Run Mountain',
                    body: '❌ Error'+'\n'+ error,
                    subtitle: 'Verificar en bd',
                    timeoutType: 'default'
                }).show();
                console.log(error)
                
            }
    }
    else{
        new Notification({
            title: 'Run Mountain',
            body: '❌ Primero debes introducir un Usuario',
            subtitle: 'Verificar en bd',
            timeoutType: 'default'
        }).show();
    }
}

async function deleteUser(user){
    try{
        const conn = await getConnection();
        
        const result = await conn.query('SELECT ID_Empleado FROM Empleado WHERE Correo_Electronico=? AND Contraseña=?',[user.email,user.password])
        const id = result[0].ID_Empleado;
        const result2 = await conn.query('DELETE FROM Empleado where ID_Empleado=?',id)        


        new Notification({
            title: 'Run Mountain',
            body: '✔ Usuario Eliminado!   ',
            subtitle: 'Adios',
            timeoutType: 'default'
        }).show();
  
    }catch(error){
        new Notification({
            title: 'Run Mountain',
            body: '❌ Error'+'\n'+ error,
            subtitle: 'Verificar en bd',
            timeoutType: 'default'
        }).show();
        console.log(error)
        
    }

}

//Funciones de proveedores
async function createProveedor(proveedor){
    try{
        const conn = await getConnection();
        const result = await conn.query('INSERT INTO Proveedor (Nombre, Numero,Compania) values (?,?,?)',
                            [proveedor.nombre, proveedor.numero, proveedor.compania]);
        console.log(result)
        
        new Notification({
            title: 'StockSpot',
            body: '✔ Proveedor guardado!   ID:'+result.insertId,
            subtitle: 'Se mostrara en la bd',
            timeoutType: 'default'
        }).show();

        proveedor.id = result.insertId;
        return proveedor
    }catch(error){
        new Notification({
            title: 'StockSpot',
            body: '❌ Error'+'\n'+ error,
            subtitle: 'Verificar en bd',
            timeoutType: 'default'
        }).show();
        console.log(error)
    }    
}



async function getProveedores(){
  
    const conn = await getConnection();
    const results = await conn.query('SELECT * FROM Proveedor')
  
    //console.log(results)
    return results;
}

async function searchProveedor(proveedor){
    try{
        const conn = await getConnection();
        
        const result = await conn.query('SELECT * FROM Proveedor WHERE Numero=? AND Compania=?',[proveedor.numero,proveedor.compania])
        
        if(result !== []){
            user=result[0];
            new Notification({
                title: 'StockSpot',
                body: 'Proveedor Encontrado!',
                subtitle: ':D',
                timeoutType: 'default'
            }).show();
            
        }
        else{
            new Notification({
                title: 'StockSpot',
                body: 'Proveedor No Encontrado!',
                subtitle: ':c',
                timeoutType: 'default'
            }).show();
        }
        return user;
    }catch(error){
        new Notification({
            title: 'StockSpot',
            body: '❌ Error'+'\n'+ error,
            subtitle: 'Verificar en bd',
            timeoutType: 'default'
        }).show();
        console.log(error)
        
    }
}

async function modifyProveedor(sw,cpy, proveedor){
    if(sw === 3){
            try{
                
                    const conn = await getConnection();
                
                    const id = cpy.ID_Proveedor;
                    
               
                    const result2 = await conn.query('UPDATE Proveedor SET Nombre=?, Numero=?, Compania=? WHERE ID_Proveedor=?',[proveedor.nombre, proveedor.numero, proveedor.compania, id])
                   
                    new Notification({
                        title: 'StockSpot',
                        body: '✔ Proveedor Modificado!',
                        subtitle: ':D',
                        timeoutType: 'default'
                    }).show();
                    
                
                
        
            }catch(error){
                new Notification({
                    title: 'StockSpot',
                    body: '❌ Error'+'\n'+ error,
                    subtitle: 'Verificar en bd',
                    timeoutType: 'default'
                }).show();
                console.log(error)
                
            }
    }
    else{
        new Notification({
            title: 'StockSpot',
            body: '❌ Primero debes introducir un Proveedor',
            subtitle: 'Verificar en bd',
            timeoutType: 'default'
        }).show();
    }
}

async function deleteProveedor(proveedor){
    try{
        const conn = await getConnection();
        //console.log(proveedor)
        const result = await conn.query('SELECT ID_Proveedor FROM Proveedor WHERE Compania=? AND Numero=?',[proveedor.compania,proveedor.numero])
        const id = result[0].ID_Proveedor;
        //console.log(result[0])
        //console.log(id)
        const result2 = await conn.query('DELETE FROM Proveedor where ID_Proveedor = ?',id)        


        new Notification({
            title: 'StockSpot',
            body: '✔ Provevedor Eliminado!   ',
            subtitle: 'Adios',
            timeoutType: 'default'
        }).show();
  
    }catch(error){
        new Notification({
            title: 'StockSpot',
            body: '❌ Error'+'\n'+ error,
            subtitle: 'Verificar en bd',
            timeoutType: 'default'
        }).show();
        console.log(error)
        
    }

}


//Funciones de inventario
async function createProducto(producto){
    try{
        const conn = await getConnection();
        const result = await conn.query('INSERT INTO Producto (Nombre, Precio,Stock,Descripcion) values (?,?,?,?)',
                            [producto.nombre, producto.precio, producto.stock,producto.descripcion]);
        console.log(result)
        
        new Notification({
            title: 'StockSpot',
            body: '✔ Producto guardado!   ID:'+result.insertId,
            subtitle: 'Se mostrara en la bd',
            timeoutType: 'default'
        }).show();

        producto.id = result.insertId;
        return producto
    }catch(error){
        new Notification({
            title: 'StockSpot',
            body: '❌ Error'+'\n'+ error,
            subtitle: 'Verificar en bd',
            timeoutType: 'default'
        }).show();
        console.log(error)
    }    
}

async function getProducts(){
    //console.log("Hola, esto en main get products")
    const conn = await getConnection();
    const results = await conn.query('SELECT * FROM Producto')
    // const results = await conn.query('SELECT COUNT(*) FROM product');
    //console.log(results)
    return results;
}

async function searchProducto(producto){
    try{
        const conn = await getConnection();
        
        const result = await conn.query('SELECT * FROM Producto WHERE Nombre=?',[producto.nombre])
        
        if(result !== []){
            producto=result[0];
            new Notification({
                title: 'StockSpot',
                body: 'Producto Encontrado!',
                subtitle: ':D',
                timeoutType: 'default'
            }).show();
            
        }
        else{
            new Notification({
                title: 'StockSpot',
                body: 'Producto No Encontrado!',
                subtitle: ':c',
                timeoutType: 'default'
            }).show();
        }
        return producto;
    }catch(error){
        new Notification({
            title: 'StockSpot',
            body: '❌ Error'+'\n'+ error,
            subtitle: 'Verificar en bd',
            timeoutType: 'default'
        }).show();
        console.log(error)
        
    }
}

async function modifyProducto(sw,cpy, producto){
    if(sw === 3){
            try{
                
                    const conn = await getConnection();
                
                    const id = cpy.ID_Producto;
                    
               
                    const result2 = await conn.query('UPDATE Producto SET Nombre=?, Precio=?, Stock=?, Descripcion=? WHERE ID_Producto=?',[producto.nombre, producto.precio, producto.stock, producto.descripcion, id])
                   
                    new Notification({
                        title: 'StockSpot',
                        body: '✔ Producto Modificado!',
                        subtitle: ':D',
                        timeoutType: 'default'
                    }).show();
                    
                
                
        
            }catch(error){
                new Notification({
                    title: 'StockSpot',
                    body: '❌ Error'+'\n'+ error,
                    subtitle: 'Verificar en bd',
                    timeoutType: 'default'
                }).show();
                console.log(error)
                
            }
    }
    else{
        new Notification({
            title: 'StockSpot',
            body: '❌ Primero debes introducir un Producto',
            subtitle: 'Verificar en bd',
            timeoutType: 'default'
        }).show();
    }
}

async function deleteProducto(producto){
    try{
        const conn = await getConnection();
        //console.log(proveedor)
        const result = await conn.query('SELECT ID_Producto FROM Producto WHERE Nombre=?',[producto.nombre])
        const id = result[0].ID_Producto;
        //console.log(result[0])
        //console.log(id)
        const result2 = await conn.query('DELETE FROM Producto where ID_Producto = ?',id)        


        new Notification({
            title: 'StockSpot',
            body: '✔ Producto Eliminado!   ',
            subtitle: 'Adios',
            timeoutType: 'default'
        }).show();
  
    }catch(error){
        new Notification({
            title: 'StockSpot',
            body: '❌ Error'+'\n'+ error,
            subtitle: 'Verificar en bd',
            timeoutType: 'default'
        }).show();
        console.log(error)
        
    }

}


module.exports = {
    loginWindow,
    createWindow,
    refreshCurWindow,
    createUser,
    searchUser,
    modifyUser,
    deleteUser,
    createProduct,
    getProducts,
    getCantidad,
    deleteProduct,
    getProductById,
    getUsers,
    createProveedor,
    getProveedores,
    searchProveedor,
    modifyProveedor,
    deleteProveedor,
    updateProduct,
    createProducto,
    searchProducto,
    modifyProducto,
    deleteProducto

};
