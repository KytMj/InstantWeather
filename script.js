let select = document.querySelector('#selectCommune');
let imgWeather = document.getElementById("imgWeather");
let checkboxes = document.querySelectorAll("ul input");
let nbDays = document.querySelector("#nbDays");
let nbDaysNumber = document.getElementById("nbDaysNumber");

const myToken = 'df67b5d9a4ad5c4d7edc7cb5bfd546524b5c69c768c28b951e0da9199128b388';
//https://api.meteo-concept.com/api/ephemeride/0?token=df67b5d9a4ad5c4d7edc7cb5bfd546524b5c69c768c28b951e0da9199128b388

document.querySelector('#postalCode').addEventListener('input', function (){
    if(this.value.length == 5) {
        let url = `https://geo.api.gouv.fr/communes?codePostal=${this.value}&type=commune-actuelle&fields=nom,code,codesPostaux&format=json&geometry=centre`;
    
        document.getElementById("selectCommune").className = "selectCommune formElement";
        document.getElementById("validation").className = "";

        fetch(url).then((response) => {
            return response.json();
        }
        ).then((data) => {
            while(select.firstChild){
                select.removeChild(select.firstChild);
            }
            for(let ville of data){
                let option = new Option(ville.nom, ville.code);
                select.appendChild(option);
            }      
        });

        
    }
});

function weatherInformationsToday(){
    //let city = select.options[select.selectedIndex].text;    donne le nom de la commune

    let insee = select.value;   //donne la valeur insee de la commune sélectionnée
    let url = `https://api.meteo-concept.com/api/forecast/daily?token=${myToken}&insee=${insee}`;

    document.getElementById("codeResearch").className = "ghost";
    document.getElementById("viewInfos").className = "";

    fetch(url).then((response) => {
        return response.json();
    }
    ).then((data) => {
        document.getElementById("minimTemp").innerText = data.forecast[0].tmin + "°C";
        document.getElementById("maxiTemp").innerText = data.forecast[0].tmax + "°C";
        document.getElementById("rainProba").innerText = data.forecast[0].probarain + "%";
        document.getElementById("dailySunshine").innerText = data.forecast[0].sun_hours + " heures";
        document.getElementById("latitudeDisplay").innerText = data.forecast[0].latitude;
        document.getElementById("longitudeDisplay").innerText = data.forecast[0].longitude;
        document.getElementById("rr10Display").innerText = data.forecast[0].rr10;
        document.getElementById("wind10mDisplay").innerText = data.forecast[0].wind10m;
        document.getElementById("dirwind10mDisplay").innerText = data.forecast[0].dirwind10m;

        changingWeather(data.forecast[0].weather);

        console.log(nbDays.value);
    });
    
    checkboxes.forEach(element => { //displays the selected options / hides them if not

        // element.id.substring(5) turns the checkbox id to the div id it corresponds
        // check + element name for the checkboxes
        // element name for the div
        if(element.checked == true){
            document.getElementById(element.id.substring(5)).className = "weatherInfos";
        }else{
            document.getElementById(element.id.substring(5)).className = "ghost";
        }
    });
}

function newResearch(){
    document.getElementById("codeResearch").className = "";
    document.getElementById("viewInfos").className = "ghost";
    document.querySelector('#postalCode').value = "";
    document.getElementById("selectCommune").className = "selectCommune formElement ghost";
    document.getElementById("validation").className = "formElement ghost";
    while(imgWeather.firstChild){
        imgWeather.removeChild(imgWeather.firstChild);
    }
    while(select.firstChild){
        select.removeChild(select.firstChild);
    }
    checkboxes.forEach(element => { // puts all the checkboxes back to selected
        element.checked = true;  
    });
}


function changingWeather(weather){
    let imgName = "";

    // if(weather === 0){
    //     imgName = "sunny.png"
    // }
    // else if(weather === 1){
    //     imgName = "slightlyCloudy.png"
    // }
    // else if(weather >= 1 && weather <= 7){
    //     imgName = "cloudy.png"
    // }
    // else if((weather >= 10 && weather <= 16) || (weather >= 30 && weather <= 48) || (weather >= 70 && weather <= 78) || (weather >= 210 && weather <= 212)){
    //     imgName = "rainy.png"
    // }
    // else if((weather >= 20 && weather <= 22) || (weather >= 60 && weather <= 68) || (weather >= 220 && weather <= 235)){
    //     imgName = "snowy.png"
    // }
    // else if(weather >= 100 && weather <= 142){
    //     imgName = "stormy.png"
    // }

    let img = document.createElement('img');
    img.className = "customWeatherIcon";
    img.src = `./img/${imgName}`;
    imgWeather.appendChild(img);
}

nbDaysNumber.addEventListener("input", (e) => { //prevents user to put manually forbidden values
    if(nbDaysNumber.value > 7){
        nbDaysNumber.value = 7;
        nbDays.value = 7;
    }
    if(nbDaysNumber.value < 1){
        nbDaysNumber.value = 1;
        nbDays.value = 1;
    }
});

nbDaysNumber.addEventListener("click", (e) =>{ // when the user clicks on number input it selects everything
    console.log("oui");
    nbDaysNumber.select();
});