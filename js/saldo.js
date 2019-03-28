const electron = require('electron');
const ipc = electron.ipcRenderer;

ipc.on('notify-monto',(event,monto)=>{
    modificarMonto(monto);
});

ipc.on('get-token-saldo',(event,token)=>{
    jwt = token.token;
    userId = token.user;
    console.log('jwt :'+jwt);
    console.log('user :'+userId);
    getUsers();
});


$(document).ready(function(){
    let jwt = undefined;
    let users = undefined;
    let userId = undefined;
    let currentUser = undefined;
    setInterval(function(){
        ipc.send('query-monto');
    },2000);
    ipc.send('get-token','get-token-saldo');
});

function modificarMonto(monto) {
    console.log('monto: ' + monto);
    let elementMonto = $('#monto');
    elementMonto.html(monto);
}

function showWallet(wallet) {
    console.log('wallet: ' + wallet);
    let elementWallet = $('#wallet');
    elementWallet.html(wallet);
}


function getUsers(){
    let xmlHttpRequest = new XMLHttpRequest();
    let action = "http://178.128.228.106:8085/users";
    xmlHttpRequest.open("GET",action,true);
    xmlHttpRequest.setRequestHeader('Content-Type','application/json');
    xmlHttpRequest.setRequestHeader("Authorization", 'Bearer '+ jwt);
    xmlHttpRequest.onreadystatechange = function(respuesta){
        if(xmlHttpRequest.readyState == 4){
            if(xmlHttpRequest.status == 200){
                users = JSON.parse(respuesta.target.response);
                users.forEach((user)=>{
                    if (user._id == userId) {
                        currentUser = user;
                    }
                })
                console.log(users);
                console.log(currentUser);
                showWallet(currentUser.wallet);
            }
        }
    };
    xmlHttpRequest.send();
}
