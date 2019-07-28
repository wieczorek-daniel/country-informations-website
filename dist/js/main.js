window.onload = prepareToUse;

function prepareToUse() {
    document.getElementById('button-search').onclick = function () {
        let inputCountry = document.getElementById("input-country").value.toLowerCase();
        displayCountryInfo(inputCountry);
    }
    document.getElementById('input-country').addEventListener('keyup', function (event) {
        if (event.keyCode == 13) {
            event.preventDefault();
            document.getElementById('button-search').click();
        }
    })
    autocomplete();
}

let countries;

fetch("https://restcountries.eu/rest/v2/all")
    .then(res => res.json())
    .then(data => initialize(data))
    .catch(err => console.log("Error:", err));

function initialize(countriesData) {
    countries = countriesData;
    console.log(countries); // Access to enitre API via console
}

function displayCountryInfo(countryByName) {
    const countryData = countries.find(country => country.name.toLowerCase() === countryByName || country.nativeName.toLowerCase() === countryByName);
    let exists = countryData === undefined ? false : true;

    if (exists == true) {
        document.querySelector("#flag img").style.border = "solid 1px #ccc";
        document.getElementById("informations").style.display = "block";
        document.getElementById("country-name").innerHTML = ` about ${countryData.name}`;
        document.querySelector("#flag img").src = countryData.flag;
        document.querySelector("#flag img").alt = `Flag of ${countryData.name}`;
        document.getElementById("capital").innerHTML = countryData.capital;
        document.getElementById("dialing-code").innerHTML = `+${countryData.callingCodes[0]}`;
        document.getElementById("domain").innerHTML = countryData.topLevelDomain;
        document.getElementById("population").innerHTML = countryData.population.toLocaleString("en-US");
        document.getElementById("area").innerHTML = `${countryData.area.toLocaleString("en-US")} km<sup>2</sup>`;
        document.getElementById("currencies").innerHTML = countryData.currencies.filter(c => c.name).map(c => `${c.name} (${c.code})`).join(", ");
        document.getElementById("region").innerHTML = countryData.region;
        document.getElementById("subregion").innerHTML = countryData.subregion;
    } else {
        document.getElementById("country-name").innerHTML = "";
        document.querySelector("#flag img").style.border = "none";
        document.querySelector("#flag img").src = "dist/img/not-found.png";
        document.querySelector("#flag img").alt = "Not found";
        document.getElementById("informations").style.display = "none";
    }
}

function autocomplete() {
    let ajax = new XMLHttpRequest();
    ajax.open("GET", "https://restcountries.eu/rest/v2/all", true);
    ajax.onload = function () {
        let list = JSON.parse(ajax.responseText).map(function (i) {
            return i.name;
        });
        new Awesomplete(document.getElementById("input-country"), {
            list: list,
            minChars: 1,
            maxItems: 5,
            autoFirst: true
        });
    };
    ajax.send();
}
