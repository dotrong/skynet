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
        
        // console.log(data);

        var location = data.Locations;

        for (var i=0; i<location.length; i++) {
            var city = location[i].city;
            var state = location[i].state;

            var watches = location[i].Watches;
            for (var j=0; j<watches.length; j++) {
                var type = watches[j].type;
                var title = watches[j].title;
                var picture = watches[j].picture;
                if (watches[j].Alert) { // some watches don't have 'Alert' which causes an error
                    var description = watches[j].Alert.description;
                    var dateTime = watches[j].Alert.dateTime;
                    var external = watches[j].Alert.external;
                    var severity = watches[j].Alert.severity;
                }
            }
            // console.log(city,state,type,title,picture,description,dateTime,external,severity);

            // Fill city and state/country text into button
            // $("#watch" + i + ".ui-content img").attr('src', picture);
            $("#watch" + i + " div.ui-collapsible-content").html("");
            $("#watch" + i + " .ui-collapsible-heading-toggle").css("background-color", severity); 
            $("#watchTitle" + i + " .ui-collapsible-heading-toggle").text(city + ", " + state);
            $("#watchTitle" + i + " div.ui-collapsible-content").append("<br><br><div>*** " + title + " ***</div>");
            $("#watchTitle" + i + " div.ui-collapsible-content").append("<div>" + description + "</div>");
            $("#watchTitle" + i + " div.ui-collapsible-content").append("<div>Time: " + dateTime + "</div>");
            // More Details
            $("#watchTitle" + i + " div.ui-collapsible-content").append('<a href=' + external + '" id="wthrDetails" target="_blank">More Details</a><br>');
        }




    });
};