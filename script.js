const myToken = 'df67b5d9a4ad5c4d7edc7cb5bfd546524b5c69c768c28b951e0da9199128b388';
//https://api.meteo-concept.com/api/ephemeride/0?token=df67b5d9a4ad5c4d7edc7cb5bfd546524b5c69c768c28b951e0da9199128b388

let select = document.querySelector('#selectCommune');
let checkboxes = document.querySelectorAll("ul input");
let nbDays = document.querySelector("#nbDays");
let forecast = document.querySelector("#forecast");
let nbDaysNumber = document.getElementById("nbDaysNumber");

let cityName;
let todayDate = Date.now();

let id = ["minimTemp", "maxiTemp", "rainProba", "dailySunshine", "latitude", "longitude", "rr10", "wind10m", "dirwind10m"];

var latitudeAff
var longitudeAff
var precipitationsAff
var vitVentAff
var dirVentAff

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
            for(let city of data){
                let option = new Option(city.nom, city.code);
                select.appendChild(option);
            }      
        });
    }
});

function weatherInformationsToday(){
    //let city = select.options[select.selectedIndex].text;    donne le nom de la commune

    let insee = select.value;   //donne la valeur insee de la commune sélectionnée
    cityName = select.options[select.selectedIndex].text;   
    let url = `https://api.meteo-concept.com/api/forecast/daily?token=${myToken}&insee=${insee}`;

    document.getElementById("codeResearch").className = "ghost";
    document.getElementById("viewInfos").className = "";
    document.getElementById("title").className = "ghost";

    fetch(url).then((response) => {
        return response.json();
    }
    ).then((data) => { 
        document.getElementById("minimTempDisplay").innerText = data.forecast[0].tmin + "°C";
        document.getElementById("maxiTempDisplay").innerText = data.forecast[0].tmax + "°C";
        document.getElementById("rainProbaDisplay").innerText = data.forecast[0].probarain + "%";
        document.getElementById("dailySunshineDisplay").innerText = data.forecast[0].sun_hours + " heure(s)";
        document.getElementById("latitudeDisplay").innerText = data.forecast[0].latitude;
        document.getElementById("longitudeDisplay").innerText = data.forecast[0].longitude;
        document.getElementById("rr10Display").innerText = data.forecast[0].rr10;
        document.getElementById("wind10mDisplay").innerText = data.forecast[0].wind10m;
        document.getElementById("dirwind10mDisplay").innerText = data.forecast[0].dirwind10m;

        changingWeather(data.forecast[0].weather, document.getElementById("imgWeather"));

        if(nbDays.value > 1){
            forecastDays(nbDays.value, data);
            document.getElementById("forecast").className = "forecast";
        }

        checkboxHandler();
    });
}

function checkboxHandler(){
    latitudeAff = checkboxes[0].checked;
    longitudeAff = checkboxes[1].checked;
    precipitationsAff = checkboxes[2].checked;
    vitVentAff = checkboxes[3].checked;
    dirVentAff = checkboxes[4].checked;

    for (let i = 1; i < nbDays.value; i++) {
        if(latitudeAff){
            document.getElementById("latitude"+i).className = "weatherInfos right";
        }else{
            document.getElementById("latitude"+i).className = "ghost";
        }

        if(longitudeAff){
            document.getElementById("longitude"+i).className = "weatherInfos right";
        }else{
            document.getElementById("longitude"+i).className = "ghost";
        }

        if(precipitationsAff){
            document.getElementById("rr10"+i).className = "weatherInfos right";
        }else{
            document.getElementById("rr10"+i).className = "ghost";
        }

        if(vitVentAff){
            document.getElementById("wind10m"+i).className = "weatherInfos right";
        }else{
            document.getElementById("wind10m"+i).className = "ghost";
        }

        if(dirVentAff){
            document.getElementById("dirwind10m"+i).className = "weatherInfos right";
        }else{
            document.getElementById("dirwind10m"+i).className = "ghost";
        }
    }

    if(latitudeAff){
        document.getElementById("latitude").className = "weatherInfos";
    }else{
        document.getElementById("latitude").className = "ghost";
    }

    if(longitudeAff){
        document.getElementById("longitude").className = "weatherInfos";
    }else{
        document.getElementById("longitude").className = "ghost";
    }

    if(precipitationsAff){
        document.getElementById("rr10").className = "weatherInfos";
    }else{
        document.getElementById("rr10").className = "ghost";
    }

    if(vitVentAff){
        document.getElementById("wind10m").className = "weatherInfos";
    }else{
        document.getElementById("wind10m").className = "ghost";
    }

    if(dirVentAff){
        document.getElementById("dirwind10m").className = "weatherInfos";
    }else{
        document.getElementById("dirwind10m").className = "ghost";
    }
}

function newResearch(){
    document.getElementById("codeResearch").className = "";
    document.getElementById("viewInfos").className = "ghost";
    document.querySelector('#postalCode').value = "";
    document.getElementById("selectCommune").className = "selectCommune formElement ghost";
    document.getElementById("validation").className = "formElement ghost";
    document.getElementById("title").className = "";
    while(imgWeather.firstChild){
        imgWeather.removeChild(imgWeather.firstChild);
    }
    while(select.firstChild){
        select.removeChild(select.firstChild);
    }
    while(forecast.firstChild){
        forecast.removeChild(forecast.firstChild);
    }
    checkboxes.forEach(element => { // puts all the checkboxes back to selected
        element.checked = true;  
    });
}


function changingWeather(weather, imgWeather){
    let imgName = "";

    if(weather === 0){
        imgName = "sunny.png"
    }
    else if(weather === 1){
        imgName = "slightlyCloudy.png"
    }
    else if(weather >= 1 && weather <= 7){
        imgName = "cloudy.png"
    }
    else if((weather >= 10 && weather <= 16) || (weather >= 30 && weather <= 48) || (weather >= 70 && weather <= 78) || (weather >= 210 && weather <= 212)){
        imgName = "rainy.png"
    }
    else if((weather >= 20 && weather <= 22) || (weather >= 60 && weather <= 68) || (weather >= 220 && weather <= 235)){
        imgName = "snowy.png"
    }
    else if(weather >= 100 && weather <= 142){
        imgName = "stormy.png"
    }

    let img = document.createElement('img');
    img.className = "customWeatherIcon";
    img.src = `./img/${imgName}`;
    imgWeather.appendChild(img);
}

function forecastDays(numberOfDays, data){
    for (let i = 1; i < numberOfDays; i++) {
        let weatherInfosForecast = document.createElement('div');
        weatherInfosForecast.className = "viewInfos BoxTransition";

        let cityForecast = document.createElement('h2');
        cityForecast.innerText = cityName;
        cityForecast.className = "";
        weatherInfosForecast.appendChild(cityForecast)

        let weatherIcon = document.createElement('div');
        weatherIcon.id = "imgWeather" + i ;

        let weatherInfosAll = document.createElement('div');
        weatherInfosAll.className = "weatherInfosAll";

        for (let j = 0; j < id.length; j++) {
            let uniqueInfoBox = document.createElement('div');
            uniqueInfoBox.className = "weatherInfos "+id[j];
            uniqueInfoBox.id =  id[j]+i;

            let pText = document.createElement('p');
            pText.className = "formElement";
            pText.id = "textInfo" + "ID" + i + ":" +j;

            let pInfo = document.createElement('p');
            pInfo.className = "formElement";
            pInfo.id = id[j] + "Display" + i;

            weatherInfosAll.appendChild(uniqueInfoBox);
            uniqueInfoBox.appendChild(pText);
            uniqueInfoBox.appendChild(pInfo);
        }
        weatherInfosForecast.appendChild(weatherInfosAll);
        weatherInfosForecast.appendChild(weatherIcon);
        forecast.appendChild(weatherInfosForecast);  

        changingWeather(data.forecast[i].weather, document.getElementById("imgWeather"+i));

        document.getElementById("textInfo" + "ID" + i + ":" +0).innerText = "Température minimale : ";
        document.getElementById("minimTempDisplay" + i).innerText = data.forecast[i].tmin + "°C";

        document.getElementById("textInfo" + "ID" + i + ":" +1).innerText = "Température maximale : ";
        document.getElementById(`maxiTempDisplay` + i).innerText = data.forecast[i].tmax + "°C";

        document.getElementById("textInfo" + "ID" + i + ":" +2).innerText = "Probabilité de pluie : ";
        document.getElementById(`rainProbaDisplay` + i).innerText = data.forecast[i].probarain + "%";

        document.getElementById("textInfo" + "ID" + i + ":" +3).innerText = "Ensoleillement journalier : ";
        document.getElementById(`dailySunshineDisplay` + i).innerText = data.forecast[i].sun_hours + " heure(s)";

        document.getElementById("textInfo" + "ID" + i + ":" +4).innerText = "Latitude : ";
        document.getElementById(`latitudeDisplay` + i).innerText = data.forecast[i].latitude;

        document.getElementById("textInfo" + "ID" + i + ":" +5).innerText = "Longitude : " ;
        document.getElementById(`longitudeDisplay` + i).innerText = data.forecast[i].longitude;

        document.getElementById("textInfo" + "ID" + i + ":" +6).innerText = "Cumul de pluie (mm) : " ;
        document.getElementById(`rr10Display` + i).innerText = data.forecast[i].rr10;

        document.getElementById("textInfo" + "ID" + i + ":" +7).innerText = "Vent moyen à 10m : " ;
        document.getElementById(`wind10mDisplay` + i).innerText = data.forecast[i].wind10m;

        document.getElementById("textInfo" + "ID" + i + ":" +8).innerText = "Direction du vent (°) : ";
        document.getElementById(`dirwind10mDisplay` + i).innerText = data.forecast[i].dirwind10m;

    }
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
    nbDaysNumber.select();
});
