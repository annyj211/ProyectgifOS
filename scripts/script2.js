//Script para el manejo de estilos y guardar los datos en localstorage

//Cargar datos guardados en el local storage 
function UploadlastStyle(){
    
    let stylesave = localStorage.getItem("estyleActive");//Recuperar el valor del estilo
    let stylelogo = localStorage.getItem("logo");//Recuperar el valor del logo
    if(stylesave == undefined){
        localStorage.setItem("estyleActive", "light");//Si no hay local storage le asigna esta
    }else{
    let bodyElement = document.getElementById("myBody"); //Traer elemento del body
    let imageLogo= document.getElementById("idLogo");//Traer el logo
    bodyElement.className = stylesave; //asignar la clase al elemento, se asigna la que viene del localstorage
    imageLogo.src=stylelogo;
    }
    let arreglo=localStorage.getItem ("searchtext");
    if (arreglo==undefined){
        localStorage.setItem("searchtext", JSON.stringify([])); //convertir el objeto/arreglo en string
    }
    random();
    getTrending();
    onloadMisGuifos();
}
//Guardar las busquedas en local storage
function UploadSearch (search){
    let arrayLocalStorage=JSON.parse(localStorage.getItem ("searchtext")); //convertir el string en objeto/arreglo
    arrayLocalStorage.unshift(search); //Agregar elemento al inicio arreglo
    localStorage.setItem ("searchtext", JSON.stringify (arrayLocalStorage))
}
//Traer los datos de busqueda del local storage
function SafeSearch (){
    let arrayLocalStorage=JSON.parse(localStorage.getItem ("searchtext"));
    let divFatherPreviewsSearch = document.getElementById("searchPreviews");
    divFatherPreviewsSearch.innerHTML="";
    for (i=0; i<arrayLocalStorage.length; i++) {
        let divButtonPreviewsSearch=document.createElement ("div");
        divButtonPreviewsSearch.className="divPreviewSearch";
        divButtonPreviewsSearch.innerText="#" + arrayLocalStorage[i];
        divButtonPreviewsSearch.onclick= function (event){
            let input = document.getElementById("searchtext");
            input.value = event.target.innerHTML.replace("#","");
            getSearch();
        }
        divFatherPreviewsSearch.appendChild(divButtonPreviewsSearch);
    }
}

//Cambiar el estilo, dependiendo de lo seleccionado por el usuario
function changeStyle()
{    
    let bodyElement = document.getElementById("myBody");    
    let valueList = document.getElementById("listTopic").value;
    //console.log(listaTema);
    if(valueList === "light"){
        bodyElement.className = "light"; //condicion
        localStorage.setItem("estyleActive", "light");
        document.getElementById("idLogo").src= './sources/images/gifOF_logo.png';
        localStorage.setItem('logo','./sources/images/gifOF_logo.png');
    }
    else{
        bodyElement.className = "dark"; //condicion
        localStorage.setItem("estyleActive", "dark");
        document.getElementById("idLogo").src= './sources/images/gifOF_logo_dark.png';
        localStorage.setItem('logo','./sources/images/gifOF_logo_dark.png');
    } 
}
//Traer los gifos guardados en el local storage
let elementoBodyMisGuifosHtml = document.getElementById ("estyleActive");
function onloadMisGuifos(){
    let SavedStyle = localStorage.getItem ("estyleActive");
    let bodyElement = document.getElementById ("myBody");
    bodyElement.className=SavedStyle;
    let cameraImg = document.getElementById ("cameraImgCapturar");
    if (SavedStyle==="light"){
        cameraImg.src='./sources/images/camera.svg';
    }else {
        cameraImg.src='./sources/images/camera_light.svg';
    }
    let misGuifosLocalStorage = localStorage.getItem ("gifSaveLocalStorarge");
    if (misGuifosLocalStorage==undefined){
        localStorage.setItem("gifSaveLocalStorarge","");
    }
    misGuifos();
    
}