const electron = require('electron');
const ipc = electron.ipcRenderer;

ipc.on('notify-monto',(event,saldo)=>{
  montoB = saldo;
  console.log('saldo: ' + montoB);
});

$(document).ready(function(){
  let botonRegistro = $("#botonRegistro");
  let formularioRegistro = $("#formularioTransferencia");
  let montoB = undefined;
  ipc.send('query-monto');

  botonRegistro.click(function(){
    registrarTransferencia();
  });

  formularioRegistro.submit(function(event){
    event.preventDefault();
  });
  // Toggle the side navigation
  $("#sidenavToggler").click(function(e) {
    e.preventDefault();
    $("body").toggleClass("sidenav-toggled");
    $(".navbar-sidenav .nav-link-collapse").addClass("collapsed");
    $(".navbar-sidenav .sidenav-second-level, .navbar-sidenav .sidenav-third-level").removeClass("show");
  });
  // Force the toggled class to be removed when a collapsible nav link is clicked
  $(".navbar-sidenav .nav-link-collapse").click(function(e) {
    e.preventDefault();
    $("body").removeClass("sidenav-toggled");
  });
  // Prevent the content wrapper from scrolling when the fixed side navigation hovered over
  $('body.fixed-nav .navbar-sidenav, body.fixed-nav .sidenav-toggler, body.fixed-nav .navbar-collapse').on('mousewheel DOMMouseScroll', function(e) {
    var e0 = e.originalEvent,
      delta = e0.wheelDelta || -e0.detail;
    this.scrollTop += (delta < 0 ? 1 : -1) * 30;
    e.preventDefault();
  });

});

function generarJSON(walletId){
  let object = {};
  let formData = new FormData(document.forms.namedItem("formRegistro"));
  formData.forEach((value, key) =>  {
    object[key] = value;
  });
  object["wallet"] = walletId;
  let json = JSON.stringify(object);
  return json;
}

function enviarJSON(json) {
  console.log(json);
  let xmlHttpRequest = new XMLHttpRequest();
  let action = "http://178.128.228.106:8085/users";
  xmlHttpRequest.open("POST",action,true);
  xmlHttpRequest.setRequestHeader('Content-Type','application/json');
  xmlHttpRequest.onreadystatechange = function(respuesta){
    if(xmlHttpRequest.readyState == 4){
      if(xmlHttpRequest.status == 200){
        let token = respuesta.target.response;
        console.log(token);
      }
    }
  };
  xmlHttpRequest.send(json);
}

function registrarTransferencia(){
  let entradaCuentaDestino = $("#cuentaDestino");
  let cuentaDestino = entradaCuentaDestino.val();
  let entradaMonto = $("#montoTransaccion");
  let monto = entradaMonto.val();
  data = {
    'cuenta': cuentaDestino,
    'monto': monto
  };
  if(validarFormulario()){
    alert("Transfiriendo");
    ipc.send("transfer-asset",data);
  }
}

function validarFormulario(){
  let res = true;
  let entradaCuentaDestino = $("#cuentaDestino");
  let cuentaDestino = entradaCuentaDestino.val();
  let entradaMonto = $("#montoTransaccion");
  let monto = entradaMonto.val();
/*  let entradaRazon = $("#razon");
  let razon = entradaRazon.val();*/
  let contenedorMensaje = $("#contenedorMensaje");
  let mensajeError = $("#mensajeError");
  let validarCamposTexto = new RegExp('[a-zA-ZñíÁÍÚs]+');
  let validarWallet = new RegExp('([a-zA-Z0-9]{38,})');
  let validacionCuentaDestino = validarWallet.test(cuentaDestino);

  if(validacionCuentaDestino){
    res = res && true;
  }else{
    res = res && false;
    entradaCuentaDestino.attr("class","form-control is-invalid");
  }

  console.log("monto validacion: " + montoB);
  if(monto > 0 && monto <= montoB){
    res = res && true;
  }else{
    res = res && false;
    entradaMonto.attr("class","form-control is-invalid");
  }

  if(res == false)
    contenedorMensaje[0].style.display = "block";
  else
    contenedorMensaje[0].style.display = "none";

  return res;
}

function correccionCuentaDestino(){
  let entradaCuentaDestino = $("#cuentaDestino");
  entradaCuentaDestino.attr("class","form-control");
}

function correccionMonto(){
  let entradaMonto = $("#montoTransaccion");
  entradaMonto.attr("class","form-control");
}
