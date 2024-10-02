document.querySelector('#postalCode').addEventListener('input', function (){
    if(this.value.length == 5) {
        let url = `https://geo.api.gouv.fr/communes?codePostal=${this.value}&type=commune-actuelle&fields=nom,code,codesPostaux&format=json&geometry=centre`;
    
        fetch(url).then((response) => {
            return response.json();
        }
        ).then((data) => {
            console.log(data);
            //let select = document.querySelector('#selectCommune');
            let select = document.getElementById("selectCommune");
            for(let ville of data){
                let newOption = document.createElement("option");
                select.appendChild(newOption);
                
                console.log(ville.nom);

                // let options=[{
                //     Text:`${ville.nom}`
                // }]
                select.appendChild(newOption) ;
            } 
        });
    }
});
