$(document).ready(function() {
   
    reload();

    $("#city3,#city2,#city1").on("click",function(event) {

        event.preventDefault();
        $("#myModal").modal('show');

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

        console.log(watches);
        
        $.post("/api/locations", {
            city: city,
            state: state,
            Watches: watches

        },function(data,status) {

            console.log(data);
        })

        $("#myModal").modal('hide');
        reload();

    });

});

setInterval(function() {
    reload();
}, 3600000); // one hour

var reload = function() {

    $.get("/api/users",function(data,status) {
        
        console.log(data);
        var location = data.Locations;
        var watches = data.Locations.Watches;

        /*for (var i = 0; i<location.length;i++) {
            var city = location[i].city;
            var state = location[i].state;
            var city_state = city + ', ' + state;
            console.log(city,state,city_state);
            $('#'+i).find('h1').text(city_state);    
        }*/

        for (var i=0; i<location.length; i++) {
            // var city = location[i].city;
            // var state = location[i].state;

            // for (var j=0; j<watches.length; j++) {
                console.log(data.Locations[i].Watches[1]);
                // var type = watches[0].type;
                // var title = watches[0].Alert.title;
                // var description = watches[0].Alert.description;
                // var dateTime = watches[0].Alert.dateTime;
                // var external = watches[0].Alert.external;
                // var severity = watches[0].Alert.severity;
            // }

            // console.log(city,state,type,title,description,dateTime,external,severity);

            // $('#'+i).find('h1').text(city_state);    
        }




    });
};