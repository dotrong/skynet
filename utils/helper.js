// Include the axios package for performing HTTP requests (promise based alternative to request)
var axios = require("axios");

// example API
//api.openweathermap.org/data/2.5/weather?q=London&appid=0558d69e2ef94da5a18c33d8a9dffd5b&units=imperial

// Helper functions for making API Calls
var helper = {

  // This function serves our purpose of running the query to weathermapapi
  runQuery: function() {

    axios.get("http://localhost:3000/api/locations").then(function(response) {
        var obj = {
          weather: [],
          tsunami: [],
          news: []
        };
        if (response.data) {
        
          //console.log(response.data);
          for (var i = 0; i< response.data.length;i++) {
            var loc_term = response.data[i].loc_term;
            for (var j = 0; j< response.data[i].Watches.length;j++) {
              if (response.data[i].Watches[j].wat_type == 'Weather') {
                var weatherObj = {
                  city: loc_term,
                  watch_id: response.data[i].Watches[j].id
                }
                obj.weather.push(weatherObj) ;
              }
              else if (response.data[i].Watches[j].wat_type == 'Tsunami') {

                var tsunamiObj = {
                  city: loc_term,
                  watch_id: response.data[i].Watches[j].id
                }
                obj.tsunami.push(tsunamiObj) ;

              }
              else {
                var newsObj = {
                  city: loc_term,
                  watch_id: response.data[i].Watches[j].id
                }
                obj.news.push(newsObj) ;
              }
            }
          }
        console.log(obj);

          //processing weather

        var appid = '0558d69e2ef94da5a18c33d8a9dffd5b';

        for (var i = 0; i<obj.weather.length;i++) {
            var url = 'https://api.openweathermap.org/data/2.5/weather?';
            var city = obj.weather[i].city;
            var watchId = obj.weather[i].watch_id;
            //city ='london';
            url = url+'q='+city+'&appid='+appid+'&units=imperial';
            //console.log(url);

            axios.get(url).then(function(response) {

              console.log(response.data.main.temp);
              axios.post("http://localhost:3000/api/alerts",{

              
              })
            
          });

        }

        //processing Tsunami



        //processing news
        //Article Search API: 30043fc35dfa4f0089e6234400603470


      }

    });

  },

};
//get all locations with watch
var getLocationWatch = function() {

    //categorize locations --> term, watch type

    //  return obj = {
    //     weather: [ {city: "irvine", watchid: "1" }, {city: "rancho cucamonga", id:"2"}, 
    //      {city: "las vegas",id:"3"}],
    //     tusnami: [{city: "honolulu", watchid: "4"},{city: "santa barbara", watchid:"5"}],
    //     earthquake: ["Los Angeles", "New York", "Washington DC"]
    // }

}

// We export the API helper
module.exports = helper;
