const electron = require('electron');
const ipc = electron.ipcRenderer;

ipc.on('notify-walletid',(event,walletId)=>{
  alert(walletId);
  let json = generarJSON(walletId);
  enviarJSON(json);
});

$(document).ready(function(){
  let botonRegistro = $("#botonRegistro");
  let formularioRegistro = $("#formularioRegistro");
  let token = undefined;

  botonRegistro.click(function(){
    registerBananaChain();
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
        token = respuesta.target.response;
        window.token = token;
        ipc.send('connect-bananachain');
        ipc.send('view-saldo');
        ipc.send('notify-token',token);
        console.log(token);
      }
    }
  };
  xmlHttpRequest.send(json);
}

function registerBananaChain(){
  if(validarFormulario()){
    alert("Conectando BananaChain");
    ipc.send('register-bananachain');
  }
}

function validarFormulario(){
  let res = true;
  let entradaNombre = $("#nombre");
  let nombre = entradaNombre.val();
  let entradaApellido = $("#apellido");
  let apellido = entradaApellido.val();
  let entradaCorreo = $("#correoElectronico");
  let correo = entradaCorreo.val();
  let entradaContraseña = $("#contraseña");
  let contraseña = entradaContraseña.val();
  let entradaConfirmacion = $("#confirmacion");
  let confirmacion = entradaConfirmacion.val();
  let contenedorMensaje = $("#contenedorMensaje");
  let mensajeError = $("#mensajeError");
  let validarCamposTexto = new RegExp('[a-zA-ZñíÁÍÚs]+');
  let validarCorreo = new RegExp("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$");
  let validarPasswd = new RegExp("^(?=\\w*\\d)(?=\\w*[A-Z])(?=\\w*[a-z])\\S{8,16}$");
  let validacionNombre = validarCamposTexto.test(nombre);
  let validacionApellido = validarCamposTexto.test(apellido);
  let validacionCorreo = validarCorreo.test(correo);
  let validacionContraseña = validarPasswd.test(contraseña);
  let validacionConfirmacion = validarPasswd.test(confirmacion);

  if(validacionNombre){
    res = res && true;
  }else{
    res = res && false;
    entradaNombre.attr("class","form-control is-invalid");
  }

  if(validacionApellido){
    res = res && true;
  }else{
    res = res && false;
    entradaApellido.attr("class","form-control is-invalid");
  }

  if(validacionCorreo){
    res = res && true;
  }else{
    res = res && false;
    entradaCorreo.attr("class","form-control is-invalid");
  }

  if(validacionContraseña){
    res = res && true;
  }else{
    res = res && false;
    entradaContraseña.attr("class","form-control is-invalid");
  }

  if(confirmacion == contraseña && validacionConfirmacion){
    res = res && true;
  }else{
    res = res && false;
    entradaConfirmacion.attr("class","form-control is-invalid");
  }

  if(res == false)
    contenedorMensaje[0].style.display = "block";
  else
    contenedorMensaje[0].style.display = "none";

  return res;
}

function correccionNombre(){
  let entradaNombre = $("#nombre");
  entradaNombre.attr("class","form-control");
}

function correccionApellido(){
  let entradaApellido = $("#apellido");
  entradaApellido.attr("class","form-control");
}

function correccionCorreo(){
  let entradaCorreo = $("#correoElectronico");
  entradaCorreo.attr("class","form-control");
}

function correccionContraseña(){
  let entradaContraseña = $("#contraseña");
  entradaContraseña.attr("class","form-control");
}

function correccionConfirmacion(){
  let entradaConfirmacion = $("#confirmacion");
  entradaConfirmacion.attr("class","form-control");
}
