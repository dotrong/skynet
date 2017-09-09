$(document).ready(function() {
    
    reload();

    $("#city3,#city2,#city1").on("click",function(event) {

        event.preventDefault();
        $("#myModal").modal('show');

    });

    $(".watch").on("click",".delete",function(){
        event.preventDefault();
        var btnId = $(this).attr("id"); // grabs entire id of event target
        // console.log(btnId);
        var delBtnIndex = btnId.match(/\d/).index; // captures index of first number(digit) in id (6)
        var locId = btnId.charAt(6); // first number
        for (var i=delBtnIndex+1; i<btnId.length; i++) { // start at index position of number
          var locId = locId+btnId[i]; // add next number to string
        }
        // console.log(locId);
        $.ajax({
            url: '/api/locations/' + locId,
            type: 'DELETE'
        }).done(function(data) {
            // console.log(data);
            window.location.href="/dashboard";
        });
    });

    $("#userSubmit").on("click",function(event) {
        event.preventDefault();
        var city = $('[name="city"]').val();
        var state = $('[name="state"]').val();
        var watches = [];
       
        if ($('[name="weather"]').is(':checked') ) {

            watches.push({type: 'weather'});

        }
        if ($('[name="travel"]').is(':checked') ) {
            
            watches.push({type: 'travel'});

        }

        if ($('[name="earthquake"]').is(':checked') ) {
            
            watches.push({type: 'earthquake'});

        }

        // console.log(watches);
        
        $.post("/api/locations", {
            city: city,
            state: state,
            Watches: watches

        },function(data,status) {
            console.log(data);
            $("#myModal").modal('hide');
            window.location.href="/dashboard";
        });

    });

});

setInterval(function() {
    reload();
}, 3600000); // one hour

var reload = function() {

    $.get("/api/users",function(data,status) {
        
        // console.log(data);

        var location = data.Locations;

        for (var i=0; i<location.length; i++) {
            var city = location[i].city;
            var state = location[i].state;
            var picture = location[i].picture;
            var watches = location[i].Watches;
            var curSeverity = "Green";
            // var severity = "Green";
            var id = location[i].id;

            for (var j=0; j<watches.length; j++) {

                if (watches[j].Alert && watches[j].Alert != null && watches[j].Alert.title != null) { // some watches don't have 'Alert' or 'title' which causes an error
                    var title = watches[j].Alert.title.toUpperCase();
                    var description = watches[j].Alert.description;
                    var dateTime = watches[j].Alert.dateTime;
                    var external = watches[j].Alert.external;
                    var severity = watches[j].Alert.severity;

                    if (severity === "Red" && curSeverity === "Green") {
                      curSeverity = "Red";
                    }
                    else if (severity === "Red" && curSeverity === "Yellow") {
                      curSeverity = "Red";
                    }
                    else if (severity === "Yellow" && curSeverity === "Green") {
                      curSeverity = "Yellow";
                    }
                    else if (severity === "Yellow" && curSeverity === "Red") {
                      severity = "Red";
                    }
                    else if (severity === "Green" && curSeverity === "Yellow") {
                      severity = "Yellow";
                    }
                    else if (severity === "Green" && curSeverity === "Red") {
                      severity = "Red";
                    }

                    // console.log(city,state,title,picture,description,dateTime,external,severity);

                    // Fill in dynamic city, state/country data
                    $("#watch" + i + ".ui-content img").attr('src', picture);            
                    $("#watchTitle" + i + " .ui-collapsible-heading-toggle").text(city + ", " + state);
                    $("#watchTitle" + i + " .ui-collapsible-heading-toggle").append('<img src="images/trash-can-icon.png" id="delete' + id + '" class="delete">');
                    $("#watch" + i + " .ui-collapsible-heading-toggle").css("background-color", severity);

                    // if (severity === "Red" || severity === "Yellow") {
                    if (severity != "Green") {
                        $("#watch" + i + " div.ui-collapsible-content").append("<div>*****************************</div>");
                        $("#watch" + i + " div.ui-collapsible-content").append("<div>" + title + "</div>");
                        // $("#watch" + i + " div.ui-collapsible-content").append("<div>" + description + "</div>");
                        $("#watch" + i + " div.ui-collapsible-content").append("<div>" + dateTime + "</div>");
                        // More Details
                        $("#watch" + i + " div.ui-collapsible-content").append('<a href="' + external + '" target="_blank">More Details</a><br>');
                        // Map Display
                        console.log(state);
                        var countryCode = countryCodes[state];
                        console.log(countryCode);
                        $("#mapContainer").append('<img src="images/map/' + countryCode + '-' + severity + '.png" id="mapOverlay">');
                    }
                }
            } // end of watches for loop

            if (severity == null || severity === "Green") {
                // Fill in dynamic city, state/country data
                severity = "Green";
                $("#watch" + i + ".ui-content img").attr('src', picture);           
                $("#watchTitle" + i + " .ui-collapsible-heading-toggle").text(city + ", " + state);
                $("#watchTitle" + i + " .ui-collapsible-heading-toggle").append('<img src="images/trash-can-icon.png" id="delete' + id + '" class="delete">');
                $("#watch" + i + " .ui-collapsible-heading-toggle").css("background-color", severity);
                
                $("#watch" + i + " div.ui-collapsible-content").append("<div><br>No Alerts</div>");
            }

        } // end of locations for loop

    });

};

var countryCodes = {
  "Afghanistan": "AF",
  "Albania": "AL",
  "Algeria": "DZ",
  "Andorra": "AD",
  "Angola": "AO",
  "Antigua": "AG",
  "Antilles": "AN",
  "Barbuda": "AG",
  "Argentina": "AR",
  "Armenia": "AM",
  "Aruba": "AW",
  "Australia": "AU",
  "Austria": "AT",
  "Azerbaijan": "AZ",
  "Bahamas": "BS",
  "Bahrain": "BH",
  "Bangladesh": "BD",
  "Barbados": "BB",
  "Belarus": "BY",
  "Belgium": "BE",
  "Belize": "BZ",
  "Benin": "BJ",
  "Bermuda": "BM",
  "Bhutan": "BT",
  "Bolivia": "BO",
  "Bosnia": "BA",
  "Herzegovina": "BA",
  "Bissau": "GW",
  "Botswana": "BW",
  "Brazil": "BR",
  "Brunei": "BN",
  "Bulgaria": "BG",
  "Burkina Faso": "BF",
  "Burundi": "BI",
  "Cambodia": "KH",
  "Cameroon": "CM",
  "Canada": "CA",
  "Cape Verde": "CV",
  "Cayman Islands": "KY",
  "Central African Republic": "CF",
  "Chad": "TD",
  "Chile": "CL",
  "China": "CN",
  "Colombia": "CO",
  "Comoros": "KM",
  "Congo": "CG",
  "Costa Rica": "CR",
  "Cote dIvoire": "CI",
  "Croatia": "HR",
  "Cuba": "CU",
  "Cyprus": "CY",
  "Czech Republic": "CZ",
  "Czechia": "CZ",
  "Denmark": "DK",
  "Djibouti": "DJ",
  "Dominica": "DM",
  "Dominican Republic": "DO",
  "Ecuador": "EC",
  "Egypt": "EG",
  "El Salvador": "SV",
  "Equatorial Guinea": "GQ",
  "Eritrea": "ER",
  "Estonia": "EE",
  "Ethiopia": "ET",
  "Falkland Islands": "FK",
  "Fiji": "FJ",
  "Finland": "FI",
  "France": "FR",
  "French Guiana": "GF",
  "French Polynesia": "PF",
  "Gabon": "GA",
  "Gambia": "GM",
  "Georgia": "GE",
  "Germany": "DE",
  "Ghana": "GH",
  "Greece": "GR",
  "Greenland": "GL",
  "Grenada": "GD",
  "Grenadines": "VC",
  "Guam": "GU",
  "Guatemala": "GT",
  "Guinea": "GN",
  "Guinea-Bissau": "GW",
  "Guyana": "GY",
  "Haiti": "HT",
  "Holy See": "VA",
  "Honduras": "HN",
  "Hong Kong": "HK",
  "Hungary": "HU",
  "Iceland": "IS",
  "India": "IN",
  "Indonesia": "ID",
  "Iran": "IR",
  "Iraq": "IQ",
  "Ireland": "IE",
  "Israel": "IL",
  "Italy": "IT",
  "Jamaica": "JM",
  "Japan": "JP",
  "Jordan": "JO",
  "Kazakhstan": "KZ",
  "Kenya": "KE",
  "Kiribati": "KI",
  "Kuwait": "KW",
  "Kyrgyzstan": "KG",
  "Laos": "LA",
  "Latvia": "LV",
  "Lebanon": "LB",
  "Lesotho": "LS",
  "Liberia": "LR",
  "Libya": "LY",
  "Liechtenstein": "LI",
  "Lithuania": "LT",
  "Luxembourg": "LU",
  "Macau": "MO",
  "Macedonia": "MK",
  "Madagascar": "MG",
  "Malawi": "MW",
  "Malaysia": "MY",
  "Maldives": "MV",
  "Mali": "ML",
  "Malta": "MT",
  "Mariana Islands": "MP",
  "Marshall Islands": "MH",
  "Martinique": "MQ",
  "Mauritania": "MR",
  "Mauritius": "MU",
  "Mayotte": "YT",
  "Mexico": "MX",
  "Micronesia": "FM",
  "Moldova": "MD",
  "Monaco": "MC",
  "Mongolia": "MN",
  "Montenegro": "ME",
  "Morocco": "MA",
  "Mozambique": "MZ",
  "Myanmar": "MM",
  "Namibia": "NA",
  "Nauru": "NR",
  "Nepal": "NP",
  "Netherlands": "NL",
  "New Caledonia": "NC",
  "New Zealand": "NZ",
  "Nicaragua": "NI",
  "Niger": "NE",
  "Nigeria": "NG",
  "North Korea": "KP",
  "Norway": "NO",
  "Oman": "OM",
  "Pakistan": "PK",
  "Palau": "PW",
  "Palestine": "PS",
  "Panama": "PA",
  "Papua New Guinea": "PG",
  "Paraguay": "PY",
  "Peru": "PE",
  "Philippines": "PH",
  "Poland": "PL",
  "Polynesia": "PF",
  "Portugal": "PT",
  "Puerto Rico": "PR",
  "Qatar": "QA",
  "Reunion": "RE",
  "Romania": "RO",
  "Russia": "RU",
  "Rwanda": "RW",
  "Saint Barthelemy": "BL",
  "Saint Helena": "SH",
  "Saint Kitts": "KN",
  "Saint Lucia": "LC",
  "Saint Martin": "MF",
  "Saint Vincent": "VC",
  "Samoa": "WS",
  "San Marino": "SM",
  "Sao Tome": "ST",
  "Saudi Arabia": "SA",
  "Senegal": "SN",
  "Serbia": "RS",
  "Seychelles": "SC",
  "Sierra Leone": "SL",
  "Singapore": "SG",
  "Slovakia": "SK",
  "Slovenia": "SI",
  "Solomon Islands": "SB",
  "Somalia": "SO",
  "South Africa": "ZA",
  "South Korea": "KR",
  "South Sudan": "SS",
  "Spain": "ES",
  "Sri Lanka": "LK",
  "Sudan": "SD",
  "Suriname": "SR",
  "Swaziland": "SZ",
  "Sweden": "SE",
  "Switzerland": "CH",
  "Syria": "SY",
  "Taiwan": "TW",
  "Tajikistan": "TJ",
  "Tanzania": "TZ",
  "Thailand": "TH",
  "Timor-Leste": "TL",
  "Togo": "TG",
  "Tonga": "TO",
  "Trinidad-Tobago": "TT",
  "Tunisia": "TN",
  "Turkey": "TR",
  "Turkmenistan": "TM",
  "Turks and Caicos": "TC",
  "Tuvalu": "TV",
  "Uganda": "UG",
  "Ukraine": "UA",
  "United Arab Emirates": "AE",
  "United Kingdom": "GB",
  "United States": "US",
  "Uruguay": "UY",
  "Uzbekistan": "UZ",
  "Vanuatu": "VU",
  "Venezuela": "VE",
  "Vietnam": "VN",
  "Virgin Islands": "VI",
  "Western Sahara": "EH",
  "Yemen": "YE",
  "Zambia": "ZM",
  "Zimbabwe": "ZW",
  "AK": "US",
  "AL": "US",
  "AZ": "US",
  "AR": "US",
  "CA": "US",
  "CO": "US",
  "CT": "US",
  "DE": "US",
  "FL": "US",
  "GA": "US",
  "HI": "US",
  "ID": "US",
  "IL": "US",
  "IN": "US",
  "IA": "US",
  "KS": "US",
  "KY": "US",
  "LA": "US",
  "ME": "US",
  "MD": "US",
  "MA": "US",
  "MI": "US",
  "MN": "US",
  "MS": "US",
  "MO": "US",
  "MT": "US",
  "NE": "US",
  "NV": "US",
  "NH": "US",
  "NJ": "US",
  "NM": "US",
  "NY": "US",
  "NC": "US",
  "ND": "US",
  "OH": "US",
  "OK": "US",
  "OR": "US",
  "PA": "US",
  "RI": "US",
  "SC": "US",
  "SD": "US",
  "TN": "US",
  "TX": "US",
  "UT": "US",
  "VT": "US",
  "VA": "US",
  "WA": "US",
  "WV": "US",
  "WI": "US",
  "WY": "US",
  "Alaska": "US",
  "Alabama": "US",
  "Arizona": "US",
  "Arkansas": "US",
  "California": "US",
  "Colorado": "US",
  "Connecticut": "US",
  "Delaware": "US",
  "Forida": "US",
  "Georgia": "US",
  "Hawaii": "US",
  "Idaho": "US",
  "Illinois": "US",
  "Indiana": "US",
  "Iowa": "US",
  "Kansas": "US",
  "Kentucky": "US",
  "Louisiana": "US",
  "Maine": "US",
  "Maryland": "US",
  "Massachusetts": "US",
  "Michigan": "US",
  "Minnesota": "US",
  "Mississippi": "US",
  "Missouri": "US",
  "Montana": "US",
  "Nebraska": "US",
  "Nevada": "US",
  "New Hampshire": "US",
  "New Jersey": "US",
  "New Mexico": "US",
  "New York": "US",
  "North Carolina": "US",
  "North Dakota": "US",
  "Ohio": "US",
  "Oklahoma": "US",
  "Oregon": "US",
  "Pennsylvania": "US",
  "Rhode Island": "US",
  "South Carolina": "US",
  "South Dakota": "US",
  "Tennessee": "US",
  "Texas": "US",
  "Utah": "US",
  "Vermont": "US",
  "Virginia": "US",
  "Washington": "US",
  "West Virginia": "US",
  "Wisconsin": "US",
  "Wyoming": "US"
}