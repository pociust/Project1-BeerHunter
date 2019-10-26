// google maps api key AIzaSyBZrGx2lk-aBzNw1Y5aR-f4DuzZP_a1v2g || key=AIzaSyBZrGx2lk-aBzNw1Y5aR-f4DuzZP_a1v2g
var city;
var state;

function searchBrewery() {
  city = $("#cityInput").val();
  state = $("#stateInput").val();
  console.log("state name" + state);

  var queryUrl =
    "https://api.openbrewerydb.org/breweries?by_city=" +
    city +
    "&by_state=" +
    state;

  console.log("quryURL" + queryUrl);
  $.ajax({
    url: queryUrl,
    method: "GET"
  }).then(function(response) {
    console.log(response);
    console.log("response 0", response[0]);
    renderList(response);
  });
}

function renderList(response) {
  // get cream filling
  for (i = 0; i < 5; i++) {
    if (response[i].phone === "") {
      response[i].phone = "info not avaiable yet";
    }
    if (response[i].website_url === "") {
      response[i].website_url = "no website";
    }
    var brewDiv = $(
      `<div class="cardResults">
    <h3>
        ${response[i].name}
    </h3>
    <div>
        ${response[i].street}
    </div>
    <div>
        ${response[i].phone}
    </div>
    <div>
        ${response[i].website_url}
    </div>
    </div>`
    );

    console.log("phonw", response[i].phone);
    $("#resultBrew").append(brewDiv);
  }
}

function initMap() {
  var geocoder = new google.maps.Geocoder();

  var options = {
    center: { lat: 0, lng: 0 }, //{ lat: 41.8781, lng: -87.6298 },
    zoom: 14
  };
  //intialize id
  map = new google.maps.Map(document.getElementById("map"), options);

  geocoder.geocode({ address: "Chicago" }, function(results, status) {
    if (status === "OK") {
      map.setCenter(results[0].geometry.location);
    } else {
      alert("Geocode was not successful for the following reason: " + status);
    }
  });

  var input = document.getElementById("search");
  //search box auto completes what you are trying see also auto complete
  var searchBox = new google.maps.places.SearchBox(input);

  //function to make search results bias in maps current viewport
  //add lisenter to map see events page at https://developers.google.com/maps/documentation/javascript/events
  map.addListener("bounds_changed", function() {
    //set the bounds on search box to the bounds of the map
    searchBox.setBounds(map.getBounds());
  });

  //see search results on map
  var marker = [];

  searchBox.addListener("places_changed", function() {
    // call back will run when user selects place from list
    var places = searchBox.getPlaces();

    if (places.length === 0) return;

    //clear out all markers used in interation
    // marker.forEach(function(m) {
    //   m.setMap(null);
    // });
    // marker = [];

    // create bounds object or coordinate boundaries of map
    var bounds = new google.maps.LatLngBounds();

    //iterate over places add marker for earch and adjust bounds of map
    places.forEach(function(p) {
      //check for geo attr or data for postion; if not
      if (!p.geometry) return;

      marker.push(
        new google.maps.Marker({
          map: map,
          title: p.name,
          position: p.geometry.location
        })
      );

      //update bounds of map to take each place into account
      //check if place had geometry view port geomerty ref https://developers.google.com/maps/documentation/javascript/geometry (if it preffered set to combination ref https://developers.google.com/maps/documentation/javascript/reference/coordinates#LatLngBounds)
      if (p.geometry.viewport) bounds.union(p.geometry.viewport);
      else bounds.extend(p.geometry.location);
    });

    //call fit bounds on map object and pass in bounds
    map.fitBounds(bounds);
  });
}

$("#startBtn").click(function() {
    $('html,body').animate({
        scrollTop: $(".searchBox").offset().top},
        'slow');
  });

  $("form").submit(function(event) {
    event.preventDefault();
    searchBrewery();
  });

$("#searchBtn").on("click", function() {
  searchBrewery();
});


//init card
//show card with imputs city state
//drop for number of results
//check mark for tags switch or toggle

//var

//helperfuncitons

//events
//enter input of city and state
//toggle switch to url perimieter
