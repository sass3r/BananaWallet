const {app, BrowserWindow} = require('electron');
const { spawn } = require('child_process');
const ipc = require('electron').ipcMain;
let authToken = undefined;

function createWindow () {
  win = new BrowserWindow({width: 800, height:600});
  win.loadFile('inicio.html');
}

function connectBananaChain() {
    const cmd = spawn('multichaind', ['BananaChain','-daemon']);
    cmd.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

    cmd.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
    });

    cmd.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });

}

function registerBananaChain() {
    const cmd = spawn('multichaind', ['BananaChain@178.128.228.106:2883']);

    cmd.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
        let buffer = data.toString();
        let regexWallet = /([a-zA-Z0-9]{38,})/g;
        if(regexWallet.test(buffer)){
          let walletId = buffer.match(regexWallet)[0]
          console.log(walletId);
          win.webContents.send('notify-walletid',walletId);
        }
    });

    cmd.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
    });

    cmd.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });
}

function consultarSaldo(){
    const cmd = spawn('multichain-cli', ['BananaChain', 'gettotalbalances']);
    cmd.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
        let buffer = data.toString();
        json = JSON.parse(buffer);
        let balance = json[0];
        let saldo = 0;
        if(balance)
        	saldo = balance.qty;
        console.log('saldo: ' + saldo);
        win.webContents.send('notify-monto',saldo);
    });

    cmd.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
    });

    cmd.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });
}

function mostrarSaldo(){
    win.loadFile('saldo.html');
}

app.on('ready',createWindow);
ipc.on('connect-bananachain',connectBananaChain);
ipc.on('register-bananachain',registerBananaChain);
ipc.on('query-monto', consultarSaldo);
ipc.on('view-saldo', mostrarSaldo);
ipc.on('notify-token', (event, token) => {
    json = JSON.parse(token);
    authToken = json;
    console.log('token: ' + authToken);
});

ipc.on('get-token',(event,action)=>{
    win.webContents.send(action,authToken);
});

ipc.on('transfer-asset',(event,data) => {
//let object = JSON.parse(data);
    const cmd = spawn('multichain-cli', ['BananaChain','sendassettoaddress',data.cuenta,'BananaCoin',data.monto]);
    cmd.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

    cmd.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
    });

    cmd.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });
    win.loadFile('saldo.html');
});
