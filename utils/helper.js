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
              if (response.data[i].Watches[j].type == 'Weather') {
                var weatherObj = {
                  city: city,
                  state: state,
                  watch_id: response.data[i].Watches[j].id
                }
                obj.weather.push(weatherObj) ;
              }
              else if (response.data[i].Watches[j].type == 'Earthquake') {

                var earthQuakeObj = {
                  city: city,
                  state: state,
                  watch_id: response.data[i].Watches[j].id
                }
                obj.earthQuake.push(earthQuakeObj) ;

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
          console.log(obj);

          getWeatherWatch(obj.weather);
       
        }
    });

  },

};
//get all locations with watch
var getWeatherWatch = function(weather) {

    //categorize locations --> term, watch type

    //  return obj = {
    //     weather: [ {city: "irvine", watchid: "1" }, {city: "rancho cucamonga", id:"2"}, 
    //      {city: "las vegas",id:"3"}],
    //     tusnami: [{city: "honolulu", watchid: "4"},{city: "santa barbara", watchid:"5"}],
    //     earthquake: ["Los Angeles", "New York", "Washington DC"]
    // }

    var appid = '0558d69e2ef94da5a18c33d8a9dffd5b';
    
      for (var i = 0; i<weather.length;i++) {
          var url = 'https://api.openweathermap.org/data/2.5/weather?';
          var city = weather[i].city;
          var watchId = weather[i].watch_id;
          //city ='london';
          url = url+'q='+city+'&appid='+appid+'&units=imperial';
          //console.log(url);

          axios.get(url).then(function(response) {

            //console.log(response.data.main.temp);
            axios.post(baseUrl+"/api/alerts",{
              status: 1,
              description: response.data.main.temp,
              WatchId: watchId
            
            }).then(function(response) {
              console.log(response);
            }).catch(function(error) {
              console.log(error);
            })
          
        });

      }

}

var getEarthQuakeWatch = function(earthquake) { 
  var timeZone = "UTC";
  var alertLevel;

  var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.atom";
  axios.get(url).then(function(response) {
    var $ = cheerio.load(html);
    for (var i =0; i< earthquake.length;i++) {

      var city = earthquake[i].city;
      var state = earthquake[i].state;
      var watchId = earthquake[i].watch_id;

      var cityRegex = new RegExp(city, 'g'); // convert 'city' to regex for boolean parsing below
      var stateRegex = new RegExp(state, 'g');
      $("entry").each(function (i,element) { // loop through all entries
        
        var magnitude = Number($(element).children("title").text().substring(2,5)); // capture magnitude and convert to number
        var titleInfo = $(element).children("title").text(); // variable of 'title' info 
        var location = cityRegex.test(titleInfo) || stateRegex.test(titleInfo); // check whether the 'city', 'state' or 'country' exists
        var details = $(element).children("link").attr("href"); // variable of 'details' url
        
        if (magnitude >= 6 && location != false) { // high magnitude in watched city
          // console.log(el);

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
          // console.log(pst);

          // Alert Level
          switch (true) {
              case magnitude >=6 && magnitude < 7:
                  alertLevel = "yellow";
                  break;
              case magnitude >= 7:
                  alertLevel = "red";
                  break;
              case magnitude < 6:
                  alertLevel = "green";
                  break;
          }//end of switch
        }  //end of if
      });//end of each
    }//end of for
  });
}



// We export the API helper
module.exports = helper;
