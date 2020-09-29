
//Variables global
let interval;
let copyText = "";
let booleanCancelar = false;
let recorder;
//Cargar el blob nulo 
let blob = null;
let srcVid;

//Regresar a la pag anterior ya que el usuario cancela el inicio de grabar Gif
function volver(){
    window.history.back();
}
// Iniciar 
function start(){
    let divstart = document.getElementById("createContaniner");
    let divcapture= document.getElementById("capturar");
    divcapture.style.display="flex";
    divstart.style.display="none";
    getStreamAndPlay();
}

//Funcion para dar play
function getStreamAndPlay () {
   
    navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
        height: { max: 480 }
    }
    })
    .then(function(stream) {
        let video= document.querySelector("video");
        video.muted= true;
        video.srcObject = stream;
        video.style.display="block"; // Sin importar si el video esta oculto o no se muestra
        video.play()
    })
    .catch(error => console.log(error));
}

//Cronometro
const setTime = () => {
    let secondsLabel = document.getElementById("seconds");
    let minutesLabel = document.getElementById("minutes");
    secondsLabel.innerHTML="00";
    minutesLabel.innerHTML="00";
    
    let minutes = 0;
    let seconds = 0;
       
    interval = setInterval(() => {
    if (seconds === 59) {
        seconds = 0;
        minutes += 1;
        minutes = minutes === 60 ? 0 : minutes;
        minutesLabel.innerHTML="0"+ minutes;
      }
      seconds += 1;
      secondsLabel.innerHTML="0"+seconds;
      if (seconds>=10){
      secondsLabel.innerHTML=seconds;
      }
    },1000); //Cada segundo iniciar de nuevo
  };
 
// Script para grabar los Gifs
function getStreamAndRecord() {
    navigator.mediaDevices.getUserMedia({ //Solicitar los permisos a usuario para usar camara 
    audio: false,
    video: {
        height: { max: 480 }
    }
    })
    .then(function(stream) { //Inicia cuando el usuario acepta los permisos
        let video= document.querySelector("video");
        
        video.muted= true;
        video.srcObject = stream;
        let recorder = new RecordRTCPromisesHandler(stream, { //Se realiza la grabacion con estas caracteristicas
            type: 'gif',
            frameRate: 1, //tasa de imagenes (imagenes por seg o min)
            quality: 10,
            width: 540,
            height: 400,
            hidden: 400
        });
        
        recorder.startRecording(); //inicia grabacion
        setTime();//Se invoca al cronometro
        
        let fatherButtons= document.getElementById ("buttonCamera");
        fatherButtons.style.display="none";
        let gifbuttons = document.getElementById ("gifCompleteRecording");
        gifbuttons.style.display="flex";

        // await sleep(3000);
        document.getElementById("stoped").addEventListener ('click',async function(){
            
            await recorder.stopRecording(); //Termina la grabacion
            blob = await recorder.getBlob(); //promesa que obtiene el video 
            console.log("Tu video es: ",blob);//En blob se van guardando lo que se graba
            video.style.display="none";
            srcVideo = URL.createObjectURL(blob);   
            console.log(srcVideo);
            let imgVideogif=document.getElementById("imgvideo");
            imgVideogif.src = srcVideo;
            imgVideogif.className="classVideo";
            let titleVistaPrevia = document.querySelector(".createCapture");
            titleVistaPrevia.innerHTML="Vista Previa <img src='./sources/images/button3.svg' alt='x'>";
            gifbuttons.style.display="none";    
            let fatherRepetirSubir = document.getElementById ("gifRepetUpload");
            fatherRepetirSubir.style.display="flex";  
            clearInterval(interval);
                  
        })
        
    })
    .catch(err => console.log(err));
}


//Repetir la captura 
function repeatCapture(){
    let titleVistaPrevia = document.querySelector(".createCapture");
    titleVistaPrevia.innerHTML="Un Chequeo Antes de Empezar <img src='./sources/images/button3.svg' alt='x'>" //texto titulo cambia a "Un Chequeo Antes de Empezar"
    let cronometro = document.getElementById ("timeRecord")
    cronometro.style.visibility="visible";
    let restartSeconds = document.getElementById("seconds");
    restartSeconds.innerHTML="00";
    let hiddenFatherButtons = document.getElementById ("gifRepetUpload");
    hiddenFatherButtons.style.display="none";
    let ShowButtonsCapture = document.getElementById ("buttonCamera");
    ShowButtonsCapture.style.display="flex";
    getStreamAndPlay();
    let hideImg = document.getElementById ("imgvideo");
    hideImg.className="";
}
//Mostrar el Gif que se cargará
function subirGif() {
    booleanCancelar = false;
    let imgChange = document.getElementById ("imgvideo");
    imgChange.src = "./sources/images/download.png";
    let titleSubiendoGuifo = document.querySelector(".createCapture");
    titleSubiendoGuifo.innerHTML="Subiendo Guifo <img src='./sources/images/button3.svg' alt='x'>";
    let GifFatherContainerRepetirSubirHide= document.getElementById("gifRepetUpload");
    GifFatherContainerRepetirSubirHide.style.display="none";
    let FatherCancelarButton = document.getElementById("CancelButton");
    FatherCancelarButton.style.display="flex"; 
    let cronometro = document.getElementById ("timeRecord")
    cronometro.style.visibility="hidden";
    postVideoOnGiphy () //subir a Giphy
    //Guardar en Local Storage
}
//Postear gif en Giphy
function postVideoOnGiphy () {
    var formdata = new FormData();
    formdata.append("api_key", "g0VjvRHYxnGUGHSHqB4HexqaeXtUgAsi");
    formdata.append("file", blob);
    formdata.append("tags", "#annyj211");

    var requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow'
    };

    let send = fetch("http://upload.giphy.com/v1/gifs", requestOptions)
    .then(response => response.json())
    .then(result => {
        console.log(result)
        //
        if(booleanCancelar){
            console.log ("Seleccionó cancelar, se ha cancelado el proceso de subir Gif")
        }
        else{
            let misGuifosLocalStorage = localStorage.getItem ("gifSaveLocalStorarge");
            misGuifosLocalStorage=misGuifosLocalStorage + "," + result.data.id;
            localStorage.setItem("gifSaveLocalStorarge",misGuifosLocalStorage);
            let titleVistaPrevia = document.querySelector(".createCapture");
            titleVistaPrevia.innerHTML="Guifo subido correctamente <img src='./sources/images/button3.svg' alt='x'>"//                
            getNewUploadGifOnGiphy (result.data.id);
            misGuifos();
        }
    })
    .catch(error => console.log('error', error));
}

// Funcionalidad traer mis gifos
function misGuifos(){
    let apiKey='g0VjvRHYxnGUGHSHqB4HexqaeXtUgAsi';
    let gifLocalStorage = localStorage.getItem ("gifSaveLocalStorarge");
    const NewURL = fetch('http://api.giphy.com/v1/gifs?api_key='+apiKey+'&ids='+gifLocalStorage)
    .then(response => { 
        console.log(response)
        return response.json();
    })
    .then(dataJson => { 
        console.log(dataJson);
        let gifSaved = dataJson.data;
        let gifMain=document.getElementById ("misguifoscontainer");
        gifMain.innerHTML="";
        for (index=0; index<gifSaved.length; index++){
            let gifSecond = document.createElement("img");     
            gifSecond.src = gifSaved[index].images.fixed_width_downsampled.url;//downsized.url;     
            gifSecond.alt = gifSaved[index].title;
            gifSecond.className = "marginImagesContent";
            gifSecond.height="280";
            gifMain.appendChild(gifSecond);
        }
        
    }).catch(error => {
        alert ("Ha ocurrido un error"+ error);
        return error;
    });
}
// Funcionalidad Boton cancelar
function cancelarButton(){
    booleanCancelar = true;
    let comenzar = document.getElementById("createContaniner");
    let capturar= document.getElementById("capturar");
    capturar.style.display="none";
    comenzar.style.display="block";
    let HideImgGif = document.getElementById("imgvideo");
    HideImgGif.className="";// ocultar la imgen
    let CancelarButton = document.getElementById("CancelButton");
    CancelarButton.style.display="none";// ocultar boton cancelar
    let cronometro = document.getElementById ("timeRecord")
    cronometro.style.visibility="visible";//mostrar cronometro
    let restartSeconds = document.getElementById("seconds");//Volver a ceros el cronometro
    restartSeconds.innerHTML="00";
    let ButtonsCancelar = document.getElementById("buttonCamera");//mostrar botones
    ButtonsCancelar.style.display="flex";
    }

//Nuevo GIF
function getNewUploadGifOnGiphy (searchId){
    const apiKey='g0VjvRHYxnGUGHSHqB4HexqaeXtUgAsi';
    var requestOptions = {
    method: 'GET',
    redirect: 'follow'
    };

    fetch("http://api.giphy.com/v1/gifs/"+searchId+"?api_key="+ apiKey, requestOptions)
    .then(response => response.json())
    .then(jsonResult => {
        console.log(jsonResult)
        let capturar = document.getElementById("capturar");
        capturar.style.display="none";
        let gifCreated = document.getElementById ("gifUploadSuccess");
        gifCreated.style.display="flex";
        let gifUploadSuccess = document.getElementById("GifFinalUpload");
        gifUploadSuccess.src= jsonResult.data.images.fixed_width_downsampled.url;//downsized.url;
        let downloadGifFin = document.getElementById ("downloadGif");
        downloadGifFin.href=jsonResult.data.url;
        copyText=jsonResult.data.url;
    })
    .catch(error => console.log('Ha ocurrido un error:', error));

}
//Retornar la grabacion
function returnCrearGuifos(){
    let crearGuifos = document.getElementById("instructionsMain");
    let gifUploadSuccess= document.getElementById("gifUploadSuccess");
    let imgvideo = document.getElementById("imgvideo");
    crearGuifos.style.display="flex";
    gifUploadSuccess.style.display="none";
    imgvideo.className="";
    cancelarButton();
}

//Copiar al portapapeles
function copyClipboard() {
    var temp = document.createElement("input"); 
    temp.value= copyText; 
    document.body.appendChild(temp); 
    temp.select(); // Seleccionar el contenido del campo
    document.execCommand("copy"); // Copiar el texto seleccionado
    document.body.removeChild(temp); // Eliminar el campo de la página
    alert("Link copiado al portapapeles con éxito!");
  }
