const {app, BrowserWindow} = require('electron');

function createWindow () {
  win = new BrowserWindow({width: 800, height:600});
  win.loadFile('inicio.html');
}

app.on('ready',createWindow);