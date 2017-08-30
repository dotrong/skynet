// Include the axios package for performing HTTP requests (promise based alternative to request)
var axios = require("axios");
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

// We export the API helper
module.exports = helper;
