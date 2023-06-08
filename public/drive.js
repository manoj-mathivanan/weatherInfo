// Initialize and add the map
let map;

let params = (new URL(document.location)).searchParams;
let API_KEY = 'e0360095b776d6b2688d2fae45d63fe6';
var source = params.get("source");
var rain = false;
var destination = params.get("destination");

var sourceurl = `http://api.openweathermap.org/geo/1.0/direct?q=`
        +`${source}&limit=1&appid=${API_KEY}`;
var destinationurl = `http://api.openweathermap.org/geo/1.0/direct?q=`
        +`${destination}&limit=1&appid=${API_KEY}`;

fetch(sourceurl)
.then((response) => response.json())
.then((json) => {
  var sourcelat = json[0].lat;
  var sourcelon = json[0].lon;
  fetch(destinationurl)
  .then((response) => response.json())
  .then((json) => {
    var destinationlat = json[0].lat;
    var destinationlon = json[0].lon;
    var url = `http://api.openweathermap.org/data/2.5/weather?`
    +`lat=${sourcelat}&lon=${sourcelon}&appid=${API_KEY}`;
    fetch(url)
    .then((response) => response.json())
    .then(async (json) => {
      var condition = json.weather[0].main;
      if(condition.includes("rain")){
        rain = true;
      }
      url = `http://api.openweathermap.org/data/2.5/weather?`
      +`lat=${destinationlat}&lon=${destinationlon}&appid=${API_KEY}`;
      fetch(url)
      .then((response) => response.json())
      .then(async (json) => {
        var condition = json.weather[0].main;
        if(condition.includes("rain")){
          rain = true;
        }
        const bounds = new google.maps.LatLngBounds();
        const markersArray = [];
        const map = new google.maps.Map(document.getElementById("map"), {
          center: { lat: sourcelat, lng: destinationlon },
          zoom: 10,
        });
        // initialize services
        const geocoder = new google.maps.Geocoder();
        const service = new google.maps.DistanceMatrixService();
        // build request
        const origin = { lat: sourcelat, lng: sourcelon };
        const destination = { lat: destinationlat, lng: destinationlon };
        const request = {
          origins: [origin],
          destinations: [destination],
          travelMode: google.maps.TravelMode.DRIVING,
          unitSystem: google.maps.UnitSystem.METRIC,
          avoidHighways: false,
          avoidTolls: false,
          rain: rain
        };

        // put request on page
        document.getElementById("request").innerText = JSON.stringify(
          request,
          null,
          2
        );
        // get distance matrix response
        service.getDistanceMatrix(request).then((response) => {
          // put response
          document.getElementById("response").innerText = JSON.stringify(
            response,
            null,
            2
          );

          // show on map
          const originList = response.originAddresses;
          const destinationList = response.destinationAddresses;

          deleteMarkers(markersArray);

          const showGeocodedAddressOnMap = (asDestination) => {
            const handler = ({ results }) => {
              map.fitBounds(bounds.extend(results[0].geometry.location));
              markersArray.push(
                new google.maps.Marker({
                  map,
                  position: results[0].geometry.location,
                  label: asDestination ? "D" : "O",
                })
              );
            };
            return handler;
          };

          for (let i = 0; i < originList.length; i++) {
            const results = response.rows[i].elements;

            geocoder
              .geocode({ address: originList[i] })
              .then(showGeocodedAddressOnMap(false));

            for (let j = 0; j < results.length; j++) {
              geocoder
                .geocode({ address: destinationList[j] })
                .then(showGeocodedAddressOnMap(true));
            }
          }
        });
              
            });
          });
        });
      });

      function deleteMarkers(markersArray) {
        for (let i = 0; i < markersArray.length; i++) {
          markersArray[i].setMap(null);
        }

        markersArray = [];
      }