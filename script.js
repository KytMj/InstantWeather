let select = document.querySelector('#selectCommune');
const myToken = 'df67b5d9a4ad5c4d7edc7cb5bfd546524b5c69c768c28b951e0da9199128b388';
//https://api.meteo-concept.com/api/ephemeride/0?token=df67b5d9a4ad5c4d7edc7cb5bfd546524b5c69c768c28b951e0da9199128b388

document.querySelector('#postalCode').addEventListener('input', function (){
    if(this.value.length == 5) {
        let url = `https://geo.api.gouv.fr/communes?codePostal=${this.value}&type=commune-actuelle&fields=nom,code,codesPostaux&format=json&geometry=centre`;
    
        document.getElementById("selectCommune").className = "selectCommune formElement";
        document.getElementById("validation").className = "formElement";

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
    });
    
    checkboxes.forEach(element => {
        console.log(element.checked);
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
    while(select.firstChild){
        select.removeChild(select.firstChild);
    }
    checkboxes.forEach(element => {
        element.checked = true;
    });
}

let checkboxes = document.querySelectorAll("ul input");
