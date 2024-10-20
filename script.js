const myToken = 'df67b5d9a4ad5c4d7edc7cb5bfd546524b5c69c768c28b951e0da9199128b388';
//https://api.meteo-concept.com/api/ephemeride/0?token=df67b5d9a4ad5c4d7edc7cb5bfd546524b5c69c768c28b951e0da9199128b388

let select = document.querySelector('#selectCommune');
let checkboxes = document.querySelectorAll("ul input");
let nbDays = document.querySelector("#nbDays");
let forecast = document.querySelector("#forecast");
let nbDaysNumber = document.getElementById("nbDaysNumber");

let cityName;
let todayDate = new Date();
let id = ["minimTemp", "maxiTemp", "rainProba", "dailySunshine", "latitude", "longitude", "rr10", "wind10m", "dirwind10m"];
let criteria = ["latitude", "longitude", "rr10", "wind10m", "dirwind10m"];  //for the checkboxes

let dataNames = ["tmin", "tmax", "probarain", "sun_hours", "latitude", "longitude", "rr10", "wind10m", "dirwind10m"] //name of the data in the database
let dataTypes = ["°C","°C","%", " heure(s)","",""," mm"," km/h","°"]; //unit of the data in the database
// all lists can be modified at will and will adapt
// id, dataNames and dataTyes MUST have the same size !

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
    document.getElementById("cityName").className = "cityName";
    document.getElementById("todayDate").className = "todayDate";

    fetch(url).then((response) => {
        return response.json();
    }
    ).then((data) => { 
        document.getElementById("cityName").innerText = cityName;
        document.getElementById("todayDate").innerText = todayDate.toLocaleDateString(undefined, {dateStyle: 'long'});


        //writes and executes code for each inforamtion as such (example for the minimum temperature) :
        // document.getElementById("minimTempDisplay").innerText = data.forecast[0].tmin + "°C";
        // it inserts the values of the current day into the first weater card
        for(let i = 0; i < id.length; i++){       
            eval("document.getElementById(id[i] + \"Display\").innerText = data.forecast[0]."+ dataNames[i] + "+ dataTypes[i]");  //didn't know this function : https://stackoverflow.com/questions/14014371/how-do-i-convert-a-string-into-an-executable-line-of-code-in-javascript
        }

        changingWeather(data.forecast[0].weather, document.getElementById("imgWeather"));


        //creates cards for the upcoming days
        if(nbDays.value > 1){
            forecastDays(nbDays.value, data);
            document.getElementById("forecast").className = "forecast";
        }

        checkboxHandler();
    });
}

//hides/shows data based on if it was asked or not (checkboxes)
function checkboxHandler(){
    for (let i = 1; i < nbDays.value; i++) { //cards of the upcoming days
        for (let j = 0; j < 5; j++) {
            if(checkboxes[j].checked){
                document.getElementById(criteria[j]+""+i).className = "weatherInfos right";
            }else{
                document.getElementById(criteria[j]+""+i).className = "ghost";
            }
        }
    }

    
    for (let j = 0; j < 5; j++) { //card of the current day
        if(checkboxes[j].checked){
            document.getElementById(criteria[j]).className = "weatherInfos";
        }else{
            document.getElementById(criteria[j]).className = "ghost";
        }
    }
}

//reset the page, criterias and values used to select the informations
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
    todayDate = new Date();
}

//change the weather image according to the day
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



//show the informations for the selected days by the user
function forecastDays(numberOfDays, data){
    for (let i = 1; i < numberOfDays; i++) {
        let weatherInfosForecast = document.createElement('div');
        weatherInfosForecast.className = "viewInfos BoxTransition";

        let cityAndDate = document.createElement('div');
        cityAndDate.className = "dateLocalite";

        let cityForecast = document.createElement('h2');
        cityForecast.innerText = cityName;
        cityForecast.className = "cityName";
        cityAndDate.appendChild(cityForecast);

        let dateForecast = document.createElement('h2');
        todayDate.setDate(todayDate.getDate() + 1);
        dateForecast.innerText = todayDate.toLocaleDateString(undefined, {dateStyle: 'long'});
        dateForecast.className = "todayDate";
        cityAndDate.appendChild(dateForecast);

        weatherInfosForecast.appendChild(cityAndDate);

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

        let innerTextData = ["Température minimale : ", "Température maximale : ", "Probabilité de pluie : ", "Ensoleillement journalier : "
                                , "Latitude : ", "Longitude : ", "Cumul de pluie : ", "Vent moyen à 10m : ", "Direction du vent : "];
     // let dataNames = ["tmin", "tmax", "probarain", "sun_hours", "latitude", "longitude", "rr10", "wind10m", "dirwind10m"];
     // let dataTypes = ["°C","°C","%", " heure(s)","",""," mm"," km/h","°"];
     // so you can remember the content of these lists :)
     
        for(let j= 0; j < id.length; j++){
            document.getElementById("textInfo" + "ID" + i + ":" +j).innerText = innerTextData[j];
            eval("document.getElementById(id[j] + \"Display\" + i).innerText = data.forecast[i]." + dataNames[j] + " + dataTypes[j]");
        }
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

nbDaysNumber.addEventListener("click", (e) =>{ // when the user clicks on number input it selects everything (so when he types a number it replaces the content instead of adding a number)
    nbDaysNumber.select();
});

nbDaysNumber.addEventListener("keypress", (e) =>{ // when the users types a number it replaces the old one
    nbDaysNumber.select();
});

