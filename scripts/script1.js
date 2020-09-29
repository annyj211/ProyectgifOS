//Scripts para la interaccion con la API Giphy 
const apiKey='g0VjvRHYxnGUGHSHqB4HexqaeXtUgAsi';

function activeSearch(){
    let elementoHtml = document.getElementById ("myBody");
    let searchBar = document.getElementById ("searchtext").value;
    let elementLens = document.getElementById("lens");
    let buttonSearchMain= document.getElementById("buttonSearch");
    let fatherAutocomplete= document.getElementById("listAutocomplete");
   
    if (searchBar== "" && elementoHtml.className == "light"){
        elementLens.src = "./sources/images/lupa_inactive.svg"
        buttonSearchMain.disabled=true;
        fatherAutocomplete.style["display"]="none";
    } else if (searchBar== "" && elementoHtml.className=="dark"){
        elementLens.src = "./sources/images/combinedshape.svg";
        buttonSearchMain.disabled=true;
        fatherAutocomplete.innerHTML= "";
        fatherAutocomplete.style["display"]="none";
    } else if(searchBar!="" && elementoHtml.className=="light"){
        elementLens.src = "./sources/images/lupa.svg"
        buttonSearchMain.disabled =false;
    } else{
        elementLens.src = "./sources/images/lupa_light.svg";
        buttonSearchMain.disabled =false;
    }
}
//Funcion para autocompletar la busqueda
function autoCompleteApi (search) {
    const apiKey='g0VjvRHYxnGUGHSHqB4HexqaeXtUgAsi';
    const found = fetch('https://api.giphy.com/v1/gifs/search/tags?' + '&api_key=' + apiKey + '&q='+ search) 
        .then(response => { 
            console.log(response)
            return response.json();
        })
        .then(dataAnswer => { 
            console.log(dataAnswer); 
            let arrayGifos = dataAnswer.data;
            let fatherAutocomplete = document.getElementById("listAutocomplete");
            fatherAutocomplete.className="autocomplete-father";
            fatherAutocomplete.innerHTML="";
            if(arrayGifos.length>1){   
                fatherAutocomplete.style["display"]="block";         
                for (index =0; index<arrayGifos.length; index++) {
                    let newdivautocomplete = document.createElement("div");
                    newdivautocomplete.className="autocomplete-sons";
                    newdivautocomplete.innerText=arrayGifos[index].name;
                    newdivautocomplete.onclick= function (event){ 
                        let input = document.getElementById("searchtext");
                        input.value = event.target.innerHTML;
                        getSearch();
                    }
                    fatherAutocomplete.appendChild(newdivautocomplete);
                }
            }
        })
        .catch(error => {
            alert ("Ha ocurrido un error al autocompletar su busqueda"); //siempre se debe esccribir antes del return porque despues no genera nada
            return error;
        });
    }
//Ejecutar la busqueda al dar enter
function enterSearch(e) {
    let inputbar = document.getElementById ("searchtext").value;
        if (e.keyCode == 13) {  
            if  (inputbar != "") {
                getSearch();
    
            }else {
                alert("Digite su busqueda en la caja de texto");
            }
            e.preventDefault();
            return false;
            }
        if (inputbar.length >1){
            autoCompleteApi(inputbar);
    }
}    

//Funcion que busca  y pinta los resultados que el usuario desea
function getSearchResults(search) {
    UploadSearch(search);
    SafeSearch();
    const found = fetch('http://api.giphy.com/v1/gifs/search?q=' + search + '&api_key=' + apiKey + '&limit='+ 12)
        .then(response => {
            return response.json();
        })
        .then(dataAnswer => {
            console.log(dataAnswer);
            let arrayGifos=dataAnswer.data;
            let sectionGallery= document.getElementById("searchResults");
            sectionGallery.innerHTML = ""; // cargar la galeria vacía, no acumular el resultado
            let divTitleSearch=document.createElement("div"); //Crear barra busqueda, en la que muestra el texto de la busqueda
            divTitleSearch.className="galleryGif";
            sectionGallery.appendChild (divTitleSearch);
            let inputTitleSearch=document.createElement('input');  
            inputTitleSearch.type="text";
            inputTitleSearch.id="Search";
            inputTitleSearch.placeholder=search;
            inputTitleSearch.className="suggestion";
            inputTitleSearch.readonly="readonly";
            inputTitleSearch.disabled="disabled";
            divTitleSearch.appendChild (inputTitleSearch); 
            let fatherAutocomplete= document.getElementById("listAutocomplete").style.display="none";
            let sectionGifos= document.createElement("div");
            sectionGifos.className="marginImages";
            sectionGallery.appendChild (sectionGifos);
            for(let i=0; i<arrayGifos.length; i++){                
                let newImage= document.createElement("img"); //Crear el elemento imagen
                newImage.src= arrayGifos[i].images.fixed_width_downsampled.url;//downsized.url; //asignar la url de la imagen
                newImage.height="280"; //asignar tamaño a imagen
                newImage.width="290";
                newImage.alt= arrayGifos[i].title;
                newImage.className= "marginImagesContent";
                sectionGifos.appendChild(newImage);// agregar a la sección de galeria
                //sectionGallery.replaceChild(newImage);
            }
            
        })
        .catch(error => {
            alert("Tenemos un error, no podemos entregar el resultado");
            return error;
        });
    return found;
}
// Ejecutar funcion, basada en el texto que se ingresa en el input
function getSearch(){
    let search= document.getElementById("searchtext");// Ir a buscar el elemento 
    getSearchResults(search.value); //traer el valor que contiene el campo de search
}
//Funcion para traer los resultados del bloque random (Sugerencias)
function random(){

    const found = fetch('http://api.giphy.com/v1/gifs/trending?' + 'api_key=' + apiKey + '&offset='+ 20 +'&limit='+ 4)//'&offset=inicio posicion de resulltados de la tendencia
    .then(response => {
        return response.json();
    }).then(dataAnswer => {
        console.log(dataAnswer);
        let arrayGifos= dataAnswer.data;
        console.log(arrayGifos);
        let sectioNames= document.getElementById("idNameImg");
        let sectionGifos= document.getElementById("idGallery");
        console.log(sectionGifos);
        //sectionGifos.innerHTML = ""; // cargar la galeria vacía
        for(let i=0; i < arrayGifos.length; i++){
            console.log(i);
            let newDivMain= document.createElement("div");
            newDivMain.className="marginImagesMain";
            newDivMain.id= "ramdonDiv"
            sectionGifos.appendChild(newDivMain);//Primero creo el div en el que voy a insertar el titulo, boton e imagen
            let newDiv= document.createElement("div");
            newDiv.className="divNameImg";
            newDiv.id=arrayGifos[i].title;
            newDiv.textContent ="#"+(arrayGifos[i].title).trim();
            newDivMain.appendChild(newDiv);
            let newX= document.createElement("img");
            newX.src= './sources/images/button3.svg'; //asignar la url de la imagen
            newX.alt= "Una equis";
            newX.className= "imgX";
            newDiv.appendChild(newX);
            let newImage= document.createElement("img"); //Crear el elemento imagen
            newImage.src= arrayGifos[i].images.fixed_width_downsampled.url;//downsized.url; //asignar la url de la imagen
            newImage.height="280"; //asignar tamaño a imagen
            newImage.width="290";
            newImage.alt= arrayGifos[i].title;
            newImage.className= "marginImages2";
            newDivMain.appendChild(newImage);// agregar a la sección de galeria
            let buttonImg= document.createElement("button");
            buttonImg.className="butImgRamdom";
            buttonImg.name=arrayGifos[i].title;
            buttonImg.onclick= function(){ buttonSeeMore(event); };
            buttonImg.textContent= "Ver más…  ";
            newDivMain.appendChild(buttonImg);
            //sectionGallery.replaceChild(newImage);
               
        }   
    return data;
    })
    .catch((error) => {
    return error;
    })
    return found;
}
//Funcion para el boton ver mas en sugerencia
function buttonSeeMore(event){
    let TargetName= event.target.name; //Obtener el nombre
    let search = document.getElementById ("searchtext");
    search.value = TargetName; //Asignar el nombre a la barra de busqueda
    getSearch(); //Ejecutar la funcion de la busqueda
}
// Funcion para traer los resultados del bloque de tendencia
function getTrending(){

    const found = fetch('http://api.giphy.com/v1/gifs/trending?' + 'api_key=' + apiKey + '&limit='+ 12)
    .then(response => {
        return response.json();
    }).then(dataAnswer => {
        console.log(dataAnswer);
        let arrayGifos= dataAnswer.data;
        console.log(arrayGifos);
        let sectionGifos= document.getElementById("suggestionDiv");
        //console.log(sectionGifos);
        sectionGifos.innerHTML = ""; // cargar la galeria vacía
        for(let i=0; i < arrayGifos.length; i++){
            console.log(i);
            let divTrendMain = document.createElement("div");
            divTrendMain.className = "divTrendingMain";
            let newImage= document.createElement("img"); //Crear el elemento imagen
            newImage.src= arrayGifos[i].images.fixed_width_downsampled.url;//downsized.url; //asignar la url de la imagen
            newImage.height="280"; //asignar tamaño a imagen
            newImage.width="290";
            newImage.alt= arrayGifos[i].title;
            newImage.className= "marginImagesContent";
            let divTextMain = document.createElement("div");
            divTextMain.innerText = ("#"+ arrayGifos[i].title.replace(/ /g, " #")); //Fuente: https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_replace2
            divTextMain.className = "classTrendyText";
            divTrendMain.appendChild(newImage);// agregar al div suggestionDiv en la seccion de galeria
            divTrendMain.appendChild(divTextMain);
            sectionGifos.appendChild(divTrendMain);
            
        }   
    return data;
    })
    .catch((error) => {
    return error;
    })
    return found;
}
    // fetch que obtuve de postman
    // fetch("http://api.giphy.com/v1/gifs/trending?api_key=g0VjvRHYxnGUGHSHqB4HexqaeXtUgAsi&limit=4")
    // .then(response => response.json())
    // .then(result => console.log(result))
    // .catch(error => console.log('error', error));

