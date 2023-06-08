// Initialize and add the map
let map;

let params = (new URL(document.location)).searchParams;
let city = params.get("city");
let API_KEY = 'e0360095b776d6b2688d2fae45d63fe6';

var url = `http://api.openweathermap.org/geo/1.0/direct?q=`
            +`${city}&limit=1&appid=${API_KEY}`;

fetch(url)
  .then((response) => response.json())
  .then((json) => {
    var latitude = json[0].lat
    var longitude = json[0].lon
    url = `http://api.openweathermap.org/data/2.5/weather?`
    +`lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;
    fetch(url)
    .then((response) => response.json())
    .then(async (json) => {
      var temp = json.main.temp;
      var humidity = json.main.humidity;
      var windspeed = json.wind.speed;
      var condition = json.weather[0].main;
      var obj = new Object();
      obj.temp = temp;
      obj.humidity  = humidity;
      obj.windspeed = windspeed;
      obj.condition = condition;
      var jsonString= JSON.stringify(obj);
      const contentString =
    '<div id="content">' +
    '<div id="siteNotice">' +
    "</div>" +
    `<h1 id="firstHeading" class="firstHeading">${city}</h1>` +
    '<div id="bodyContent">' +
    `<p><b>${city}</b>, Weather details: </br> ${jsonString}` +
   "</p>" +
    "</div>" +
    "</div>";

    const citycor = { lat: latitude, lng: longitude };

    const { Map } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
  
    // The map, centered at Uluru
    map = new Map(document.getElementById("map"), {
      zoom: 4,
      center: citycor,
      mapId: "DEMO_MAP_ID",
    });

    const infowindow = new google.maps.InfoWindow({
      content: contentString,
      ariaLabel: city,
    });
    const marker = new google.maps.Marker({
      position: citycor,
      map,
      title: city,
    });
  
    marker.addListener("click", () => {
      infowindow.open({
        anchor: marker,
        map,
      });
    });


    });
  });
