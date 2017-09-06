// Include the axios package for performing HTTP requests (promise based alternative to request)
var axios = require("axios");
var request = require("request");
var cheerio = require("cheerio");
var PORT = process.env.PORT||3000;
var baseUrl = "http://localhost:"+PORT;

// example API
//api.openweathermap.org/data/2.5/weather?q=London&appid=0558d69e2ef94da5a18c33d8a9dffd5b&units=imperial

// Helper functions for making API Calls
var helper = {

  customImg: function (city,state) {

    return new Promise(function(resolve,reject) {

      var locImg = city + "+" + state;
      var imgAttempt = 0; // counter for no result
      var imgKey = "6299821-762bdea8a954438f2918f510d";
      var url = "https://pixabay.com/api/?key=" + imgKey + "&q=" + locImg + "&image_type=photo&orientation=horizontal&category=places&safesearch=true";
      console.log(url);
      axios.get(url).then(function(response) {
        //console.log(response);
    
        if (response.data.hits.length > 0) { // if at least one image result
            // Store the number of likes in an array
            var userLikes = 0;
            var bestImg;
            for (var i=0; i<response.data.hits.length; i++) {
                var width = response.data.hits[i].webformatWidth;
                var height = response.data.hits[i].webformatHeight;
                var ratio = height/width; // aspect ratio
                // console.log(ratio);
                if (ratio > 0.60 && response.data.hits[i].likes >= userLikes) { // if most likes and not panorama img
                    userLikes = response.data.hits[i].likes; // store most likes
                    bestImg = response.data.hits[i]; // store current img data
                }
            }
            // set the img variable          
            var customImg = bestImg.webformatURL;
            console.log(customImg); 
              resolve(customImg);
        }
        else if (imgAttempt < 2 && response.data.hits.length === 0) {
          imgAttempt++;
          locImg = city; // make 2nd attempt with only city
          //customImgs();
        }
        else {
            resolve(false);
        }
      }).catch(function(error) {console.log(error)});
    })
  },
  
  // This function serves our purpose of running the query to weathermapapi
  runQuery: function() {
    axios.get(baseUrl+"/api/locations").then(function(response,error) {
        var obj = {
          weather: [],
          earthquake: [],
          travel: []
        };

        if (response.data) {
          for (var i = 0; i< response.data.length;i++) {
            var city = response.data[i].city;
            var state = response.data[i].state;
            for (var j = 0; j< response.data[i].Watches.length;j++) {
              if (response.data[i].Watches[j].type == 'weather') {
                var weatherObj = {
                  city: city,
                  state: state,
                  watch_id: response.data[i].Watches[j].id
                }
                obj.weather.push(weatherObj) ;
              }
              else if (response.data[i].Watches[j].type == 'earthquake') {

                var earthQuakeObj = {
                  city: city,
                  state: state,
                  watch_id: response.data[i].Watches[j].id
                }
                obj.earthquake.push(earthQuakeObj) ;

              }
              //go to travel category
              else {
                var travelObj = {
                  city: city,
                  state: state,
                  watch_id: response.data[i].Watches[j].id
                }
                obj.travel.push(travelObj) ;
              }
            }
          }
          //console.log(obj);

          //getWeatherWatch(obj.weather);

          // var earthquake = [

          //   {city: 'new delhi', state: 'india', watch_id: 1},
          //   {city: 'pyongyang', state: 'North Korea', watch_id: 2},
          //   {city: 'Heicheng', state: 'China', watch_id: 3} //Heicheng, China

          // ];

          // var weather = [

          //   {city: 'new delhi', state: 'india', watch_id: 4},
          //   {city: 'pyongyang', state: 'North Korea', watch_id: 5},
          //   {city: 'Irvine', state: 'California', watch_id: 6}
          // ];

          // var travel = [

          //   {city: 'pyongyang', state: 'North Korea', watch_id: 7},
          //   {city: 'damacus', state: 'Venezuela', watch_id: 8},
          //   {city: 'Irvine', state: 'California', watch_id: 9},
          // ];

          getEarthQuakeWatch(obj.earthquake);
          getWeatherAlert(obj.weather);
          getTravelWatch(obj.travel);
       
        }
    });

  },

};

var getEarthQuakeWatch = function(earthquake) { 
  var timeZone = "UTC";
  var alertLevel;

  var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.atom";
  axios.get(url).then(function(response) {
    var $ = cheerio.load(response.data);

    for (var i =0; i< earthquake.length;i++) {

      var city = earthquake[i].city;
      var state = earthquake[i].state;
      var watchId = earthquake[i].watch_id;

      console.log(city,state,watchId);

      var cityRegex = new RegExp(city, 'gi'); // convert 'city' to regex for boolean parsing below
      var stateRegex = new RegExp(state, 'gi');
      $("entry").each(function (i,element) { // loop through all entries

        var magnitude = Number($(element).children("title").text().substring(2,5)); // capture magnitude and convert to number
        var titleInfo = $(element).children("title").text(); // variable of 'title' info
        //console.log(titleInfo); 
// var location = cityRegex.test(titleInfo) || stateRegex.test(titleInfo); // check whether the 'city', 'state' or 'country' exists
        //console.log(location);
        var details = $(element).children("link").attr("href"); // variable of 'details' url














if (state.length > 2) { // check if country and not state abbreviation
  var location = stateRegex.test(titleInfo); // set regex of 'state' for conditional below
}
else { // is U.S. state
  var location = cityRegex.test(titleInfo); // set regex of 'city' for conditional below
}










        
        //if (magnitude >= 6 && location != false) { // high magnitude in watched city
          // console.log(el);
        // var alerts = [];

        if (magnitude >= 5 && location != false) {

          // console.log("location is true");

          var timeDate = $(element).children("updated").text();
          // Date
          var month = timeDate.substring(5, 7);
          var day = timeDate.substring(8, 10);
          var year = timeDate.substring(0, 4);
          var newDate = (year + "-" + month + "-" + day);

          // Time
          var hours = Number(timeDate.substring(11, 13));
          var minutes = timeDate.substring(14, 16);
          var time = hours + ":" + minutes + " " + timeZone;

          var dateTime = newDate + ' ' + time;
          // console.log(pst);

          // Alert Level
          switch (true) {
              case magnitude >=6 && magnitude < 7:
                  alertLevel = "Yellow";
                  break;
              case magnitude >= 7:
                  alertLevel = "Red";
                  break;
              case magnitude < 7:
                  alertLevel = "Green";
                  break;
          }//end of switch
          //console.log('dateTime: '+ dateTime + 'city ' + city + ' temp ' + magnitude + 'details ' + details +' alert ' + alertLevel);
          //alerts.push({external:details,description:magnitude,severity:alertLevel,WatchId:WatchId});

          axios.post(baseUrl+"/api/alerts",{
            status: 1,
            description: magnitude,
            WatchId: watchId,
            severity: alertLevel,
            external: details,
            dateTime: dateTime,
            title: 'EarthQuake Warning'          
          }).then(function(response) {
            //console.log(response);
          }).catch(function(error) {
            console.log(error);
          })
        }  //end of if
      });//end of each
    }//end of for
  }).catch(function(error) {console.log(error)});
}

var getTravelWatch = function(travel) { 
  var timeZone = "UTC";
  var alertLevel;

  var url = 'https://travel.state.gov/_res/rss/TWs.xml';

  request(url,function(error,response,xml) {
    
    var $ = cheerio.load(xml,{
        xml: {
            normalizeWhitespace: true,
        }
    });

    $("item").each(function (i,element) { // loop through all entries

      for (var i =0; i< travel.length;i++) {
        
        var city = travel[i].city;
        var state = travel[i].state;
        var watchId = travel[i].watch_id;
        //console.log(element);
        var title = $(element).children("title").text();
        
        var stateRegex = new RegExp(state, 'gi'); // convert for regex usage below
        if (stateRegex.test(title) && state.length > 2) {
          //console.log($(element).children("date"));

          var month = $(element).children("pubDate").text().substring(8, 11);
          var day = $(element).children("pubDate").text().substring(5, 7);
          var year = $(element).children("pubDate").text().substring(12, 16);
          var newDate = (year + "-" + month + "-" + day);
          var summary = $(element).children("link").text();
          //console.log(summary);
          alertLevel = "Red";

          //console.log( 'summary '+ summary + ' date: ' + newDate + ' title: ' + title  + ' alert ' + alertLevel);

          axios.post(baseUrl+"/api/alerts",{
            status: 1,
            // description: summary,
            WatchId: watchId,
            severity: alertLevel,
            title: title,
            external: summary,
            dateTime: newDate          
          }).then(function(response) {
            //console.log(response);
          }).catch(function(error) {
            console.log(error);
          })

        }
      }

    });

  });
}

var getWeatherAlert = function(weather) {
  var timeZone = "UTC";
  var alertLevel;
  // var wthrKey = "fe7effa08314f68a"; // Chris
  var wthrKey = "6c4e6e946a271f60"; // Loree
  for (var i =0; i< weather.length;i++) {   
    var city = weather[i].city;
    var state = weather[i].state;
    var stateLC = state.toLowerCase();
    var cityLC = city.toLowerCase();
    var watchId = weather[i].watch_id;
    //console.log("watchId: " + watchId);
    city = city.replace(/ /i, "_");
    state = state.replace(/ /i, "_");
    var alerts = "https://api.wunderground.com/api/" + wthrKey + "/alerts/q/" + state + "/" + city + ".json";
    var conditions = "https://api.wunderground.com/api/" + wthrKey + "/conditions/q/" + state + "/" + city + ".json"; 
    var promise1 = axios.get(alerts);
    var promise2 = axios.get(conditions);
    Promise.all([promise1,promise2,watchId]).then(function(results) {
      var alerts_result= results[0].data.alerts;
      var conditions_result = results[1].data.current_observation;
      var temp;
      var newWatchId = results[2];
      var dateTime;
      var description;
      var alertLevel;
      if (conditions_result) {
        temp = conditions_result.temp_f;
      }
      console.log(temp,watchId);
      console.log(alerts_result);

      if (alerts_result && alerts_result.length > 0) {
        var item = alerts_result[0]; // only most recent result
        var timeDate = item.date;
        //DOMESTIC
        if (/GMT/.test(timeDate) != true) { // is not Greenwich Meantime
          
          var onIndex = timeDate.search(/ on /i); // find starting index of ' on '
          var newDate = timeDate.substring(onIndex + 4);
          var time = timeDate.substring(0, onIndex);
          var summary = "https://www.wunderground.com/weather/us/" + stateLC + "/" + cityLC;
          switch (item.type) {
              case "TOR":
                  alertLevel = "Red";
                  break;
              case "WRN":
                  alertLevel = "Red";
                  break;
              case "FLO":
                  alertLevel = "Red";
                  break;
              case "HWW":
                  alertLevel = "Red";
                  break;
              case "SVR":
                  alertLevel = "Red";
                  break;
              default:
                  alertLevel = "Yellow";
                  break;
          }
          description = item.description;
          dateTime = newDate + ' ' + time;
        } //end if Domestic
        else {
          var month = timeDate.substring(5, 7);
          var day = timeDate.substring(8, 10);
          var year = timeDate.substring(0, 4);
          var newDate = (year + "-" + month + "-" + day);
          var hours = Number(timeDate.substring(11, 13));
          var minutes = timeDate.substring(14, 16);
          var time = hours + ":" + minutes + " " + timeZone;
          alertLevel = item.level_meteoalarm_name;
          description = item.description;
          dateTime = newDate + ' ' + time;
          var countryInitCap = stateLC.replace(stateLC.charAt(0), stateLC.charAt(0).toUpperCase()); // replace first letter of 'state' with capital letter
          var countryCodeLC = countryCodes[countryInitCap].toLowerCase(); // pull country code from json at bottom of script
          var summary = "https://www.wunderground.com/weather/" + countryCodeLC + "/" + cityLC;
          var countryCodeUC = countryCodes[countryInitCap].toUpperCase(); // pull country code from json at bottom of script
        }

      }
        //insert/update db
      if (temp) {
        // console.log('date: ' + dateTime + 'description ' + temp + ' title ' + description + ' alert ' + alertLevel);
        axios.post(baseUrl+"/api/alerts",{
          status: 1,
          description: temp,
          title: description,
          WatchId: newWatchId,
          severity: alertLevel,
          dateTime: dateTime,
          external: summary,
          country: countryCodeUC
        }).then(function(response) {
          //console.log(response);
        }).catch(function(error) {
          console.log(error);
        })
        
      }
    }).catch(function(error) {
      console.log(error);
    });


  } //end of for loop
}

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
  "WY": "US"
}

// We export the API helper
module.exports = helper;