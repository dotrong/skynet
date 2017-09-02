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

var reload = function() {

    $.get("/api/users",function(data,status) {
        
        console.log(data);
        var location = data.Locations;

        for (var i = 0; i<location.length;i++) {
            var city = location[i].city;
            var state = location[i].state;
            var city_state = city + ', ' + state;
            console.log(city,state,city_state);
            $('#'+i).find('h1').text(city_state);

            
    
        }
    });
};