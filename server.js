
const {createWindow, loginWindow} = require('./main')
const {app} = require('electron')
const path = require('path');



require('./database')


require('electron-reload')(__dirname, {
    electron: path.join(__dirname, 'node_modules/.bin/electron')
});

//Mensaje encendido en Consola "El Linea!"
app.on('ready', () => {
    console.log('App encendida');
})

app.allowRendererProcessReuse = false;


app.whenReady().then(loginWindow)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {  
        app.quit()
    }
})


app.on('activate', function() {
    if (BrowserWindow.getAllWindows().length === 0){
        loginWindow();
    }
});

