// google maps api key AIzaSyBZrGx2lk-aBzNw1Y5aR-f4DuzZP_a1v2g || key=AIzaSyBZrGx2lk-aBzNw1Y5aR-f4DuzZP_a1v2g
var city = "chicago";
var state = "illinois";
//initMap(city);

let queryPatio = "";
let queryDog = "";
let queryFood = "";
let queryTours = "";
let map = "";

function searchBrewery() {
  city = $("#cityInput").val();
  state = $("#stateInput").val() || "";

  if ($("#patio").prop("checked")) {
    queryPatio = "&by_tag=patio";
  }

  if ($("#dog").prop("checked")) {
    queryDog = "&by_tag=dog";
    console.log("dog = checked");
  }

  if ($("#food").prop("checked")) {
    queryDog = "&by_tag=food";
  }

  if ($("#tours").prop("checked")) {
    queryDog = "&by_tag=tours";
  }

  var queryUrl = `https://api.openbrewerydb.org/breweries?by_city=${city}&by_state=${state}${queryDog}${queryPatio}${queryFood}${queryTours}`;

  console.log("quryURL" + queryUrl);
  $.ajax({
    url: queryUrl,
    method: "GET"
  }).then(function(response) {

    console.log("response", response);
    renderList(response);

    initMap(city);
    renderList(response);
  });
}

function renderList(response) {
  // get cream filling
  for (i = 0; i < response.length; i++) {
    if (response[i].phone === "") {
      response[i].phone = "info not available yet";
    }
    if (response[i].website_url === "") {
      response[i].website_url = "no website";
    }

    var lat = response[i].latitude;
    var lon = response[i].longitude;
    //locationArray.push(lat, lon);

    var brewDiv = $(
      `<div class="cardResults" data-name="${response[i].name}" data-lat="${response[i].latitude}" data-lon="${response[i].longitude}" id="result">
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

    $("#resultBrew").prepend(brewDiv);
  }
}

function initMap(city) {
  var geocoder = new google.maps.Geocoder();

  var options = {
    center: /* { lat: 0, lng: 0 },*/ { lat: 41.8781, lng: -87.6298 },
    zoom: 10
  };
  //intialize id
  map = new google.maps.Map(document.getElementById("map"), options);

  geocoder.geocode({ address: `${city}` }, function(results, status) {
    if (status === "OK") {
      map.setCenter(results[0].geometry.location);
    } //else {
    //alert("Geocode was not successful for the following reason: " + status);
    //}
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
      console.log("marker", marker);
      //update bounds of map to take each place into account
      //check if place had geometry view port geomerty ref https://developers.google.com/maps/documentation/javascript/geometry (if it preffered set to combination ref https://developers.google.com/maps/documentation/javascript/reference/coordinates#LatLngBounds)
      if (p.geometry.viewport) bounds.union(p.geometry.viewport);
      else bounds.extend(p.geometry.location);
    });

    //call fit bounds on map object and pass in bounds
    map.fitBounds(bounds);
  });

  $(document).on("click", ".cardResults", function() {
    var lat = parseFloat($(this).attr("data-lat"));
    var lon = parseFloat($(this).attr("data-lon"));
    console.log("lat", lat);
    console.log("lon", lon);

    marker = new google.maps.Marker({
      map: map,
      draggable: true,
      position: { lat: lat, lng: lon }
    });
    console.log("marker", marker);
    // To add the marker to the map, call setMap();
    marker.setMap(map);
  });
}

function pinInMap(brewery) {
  if (
    (brewery.latitude || brewery.latitude == 0) &&
    (brewery.longitude || brewery.longitude == 0)
  ) {
    var markerToCreate = new google.maps.Marker({
      map: map,
      draggable: true,
      position: {
        lat: parseFloat(brewery.latitude),
        lng: parseFloat(brewery.longitude)
      }
    });
    console.log("mark", parseFloat(brewery.latitude));
    markerToCreate.setMap(map);
  }
}

$("#startBtn").click(function() {
  $("html,body").animate(
    {
      scrollTop: $(".searchBox").offset().top
    },
    "slow"
  );
});

$("form").submit(function(event) {
  event.preventDefault();
  $("#resultBrew").html("");
  searchBrewery();
});

$("#searchBtn").on("click", function() {
  searchBrewery();
});

// $(document).on("click", ".cardResults", function() {
//   var lat = $(this).attr("data-lat");
//   var lon = $(this).attr("data-lon");
//   console.log("lat", lat);
//   console.log("lon", lon);
// });

//initMap("chicago");
//init card
//show card with imputs city state
//drop for number of results
//check mark for tags switch or toggle

//var

//helperfuncitons

//events
//enter input of city and state
//toggle switch to url perimieter
