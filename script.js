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
            console.log(data);
            for(let ville of data){
                let option = new Option(ville.nom, ville.code);
                select.appendChild(option);
            }      
        });
    }
});

select.childNodes.forEach(function(item){
    console.log(item);
})


document.querySelector('#validation').addEventListener('click', function (){
    console.log(select)
});

function choice(){

}
