var city = "";
var state = "";

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

    var brewDiv = $(
      `<div class="cardResults" data-name="${response[i].name}" data-lat="${response[i].latitude}" data-lon="${response[i].longitude}" id="result">
    <h3>
        ${response[i].name}
    </h3>
    <div>
        ${response[i].street}
    </div>
    
    <input type="checkbox">
    </input>
    </div>`
    );

    // <div>
    //     ${response[i].phone}
    // </div>
    // <div>
    //     ${response[i].website_url}
    // </div>

    $("#resultBrew").prepend(brewDiv);
  }
}

function initMap(city) {
  var geocoder = new google.maps.Geocoder();

  var options = {
    center: /* { lat: 0, lng: 0 },*/ { lat: 41.8781, lng: -87.6298 },
    zoom: 12
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

  var marker = [];

  $(document).on("click", ".cardResults", function() {
    var lat = parseFloat($(this).attr("data-lat"));
    var lon = parseFloat($(this).attr("data-lon"));
    var place = $(this).attr("data-name");

    console.log("lat", lat);
    console.log("lon", lon);
    console.log("place", place);

    var icon = {
      url: "./smbottle.png", // url
      scaledSize: new google.maps.Size(13, 34), // scaled size
      origin: new google.maps.Point(0, 0), // origin
      anchor: new google.maps.Point(0, 0) // anchor
    };

    var infowindow = new google.maps.InfoWindow({
      content: "contentString"
    });

    codeAddress();

    function codeAddress() {
      geocoder.geocode({ address: place }, function(results, status) {
        if (status == "OK") {
          map.setCenter(results[0].geometry.location);
          marker = new google.maps.Marker({
            map: map,
            draggable: false,
            position: results[0].geometry.location,
            icon: icon
          });

          console.log("result map", results[0]);
          marker.setMap(map);
        }
      });
    }
  });

  marker.addListener("click", function() {
    infowindow.open(map, marker);
  });

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
      }
    });
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
