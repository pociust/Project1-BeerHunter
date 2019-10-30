var city = "";
var state = "";
//initMap(city);

let queryPatio = "";
let queryDog = "";
let queryFood = "";
let queryTours = "";
let map = "";

function searchBrewery() {
  $("#mapContainer").removeClass("hide");
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

  $.ajax({
    url: queryUrl,
    method: "GET"
  }).then(function(response) {
    console.log(response);
    initMap(city);
    renderList(response);
    // pinInMap(response[i]);
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

    //  <div>
    //  ${response[i].phone}
    //  </div>
    //  <div>
    //  ${response[i].website_url}
    //  </div>

    var brewDiv = $(
      `<div class="cardResults no-touch pointer" data-name="${response[i].name}" data-lat="${response[i].latitude}" data-lon="${response[i].longitude}" id="result">
        <h3>
        ${response[i].name}
        </h3>
        <div>
        ${response[i].street}
        </div>
        </div>
      </div>`
    );

    $("#resultBrew").append(brewDiv);
    pinInMap(response[i]);
  }
}

function initMap(city) {
  var geocoder = new google.maps.Geocoder();

  var options = {
    center: /* { lat: 0, lng: 0 },*/ { lat: 41.8781, lng: -87.6298 },
    zoom: 11
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
  //var searchBox = new google.maps.places.SearchBox(input);

  //function to make search results bias in maps current viewport
  //add lisenter to map see events page at https://developers.google.com/maps/documentation/javascript/events
  // map.addListener("bounds_changed", function() {
  //set the bounds on search box to the bounds of the map
  // searchBox.setBounds(map.getBounds());
  // });

  //see search results on map
  //var marker = [];

  //searchBox.addListener("places_changed", function() {
  // call back will run when user selects place from list
  //var places = searchBox.getPlaces();

  //if (places.length === 0) return;

  //clear out all markers used in interation
  // marker.forEach(function(m) {
  //   m.setMap(null);
  // });
  // marker = [];

  // create bounds object or coordinate boundaries of map
  //var bounds = new google.maps.LatLngBounds();

  //iterate over places add marker for earch and adjust bounds of map
  //places.forEach(function(p) {
  //check for geo attr or data for postion; if not
  //if (!p.geometry) return;

  // marker.push(
  // new google.maps.Marker({
  // map: map,
  //title: p.name,
  //position: p.geometry.location
  // })
  // );

  //update bounds of map to take each place into account
  //check if place had geometry view port geomerty ref https://developers.google.com/maps/documentation/javascript/geometry (if it preffered set to combination ref https://developers.google.com/maps/documentation/javascript/reference/coordinates#LatLngBounds)
  // if (p.geometry.viewport) bounds.union(p.geometry.viewport);
  // else bounds.extend(p.geometry.location);
  //});

  //call fit bounds on map object and pass in bounds
  // map.fitBounds(bounds);
  // });
  $(document).on("click", ".cardResults", function() {
    var place = $(this).attr("data-name");
    console.log("place", place);

    var icon = {
      url: "./smbottle.png", // url
      scaledSize: new google.maps.Size(13, 34), // scaled size
      origin: new google.maps.Point(0, 0), // origin
      anchor: new google.maps.Point(0, 0) // anchor
    };

    function codeAddress() {
      geocoder.geocode({ address: place }, function(results, status) {
        if (status == "OK") {
          map.setCenter(results[0].geometry.location);
          var marker = new google.maps.Marker({
            map: map,
            draggable: false,
            position: results[0].geometry.location,
            icon: icon
          });
          console.log("result map", results[0]);
          marker.setMap(map);
          var contentString = $(
            '<div class="marker-info-win">' +
              '<span class="info-content">' +
              `<h3 class="marker-heading">${place}</h3>` +
              "This is a new marker infoWindow" +
              "</span>" +
              "</div>"
          );

          //Create an infoWindow
          var infowindow = new google.maps.InfoWindow();

          //set the content of infoWindow
          infowindow.setContent(contentString[0]);

          //add click event listener to marker which will open infoWindow
          google.maps.event.addListener(marker, "click", function() {
            infowindow.open(map, marker); // click on marker opens info window
          });
        }
      });
    }

    codeAddress();
  });
}

function pinInMap(brewery) {
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode({ address: `${brewery.name}` }, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      var marker = new google.maps.Marker({
        map: map,
        position: results[0].geometry.location
      });
      marker.setMap(map);
      console.log(brewery.name);
      var contentString = $(
        '<div class="marker-info-win">' +
          '<span class="info-content">' +
          `<h3 class="marker-heading">${brewery.name}</h3>` +
          "This is a new marker infoWindow" +
          "</span>" +
          "</div>"
      );

      //Create an infoWindow
      var infowindow = new google.maps.InfoWindow();

      //set the content of infoWindow
      infowindow.setContent(contentString[0]);

      //add click event listener to marker which will open infoWindow
      google.maps.event.addListener(marker, "click", function() {
        infowindow.open(map, marker); // click on marker opens info window
      });
    }
  });
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

//initMap();
//init card
//show card with imputs city state
//drop for number of results
//check mark for tags switch or toggle

//var

//helperfuncitons

//events
//enter input of city and state
//toggle switch to url perimieter
