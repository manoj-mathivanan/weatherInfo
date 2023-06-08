// server.js File
const express = require('express'); // Importing express module

const app = express(); // Creating an express object

const port = 3000; // Setting an port for this application

app.use('/', express.static('public'))
app.use(express.json());

// Starting server using listen function
app.listen(port, function (err) {
if(err){
	console.log("Error while starting server");
}
else{
	console.log("Server has been started at "+port);
}
})

app.get('/map', function (req, res) {
    res.sendFile(__dirname + "/map.html");
  })

  app.get('/', function (req, res) {
    res.sendFile(__dirname + "/input.html");
  })
  
  app.post('/weather', function (req, res) {
    var city = req.body.location;
    var API_KEY = "e0360095b776d6b2688d2fae45d63fe6";
    var url = `http://api.openweathermap.org/geo/1.0/direct?q=`
            +`${city}&limit=1&appid=${API_KEY}`;

fetch(url)
  .then((response) => response.json())
  .then((json) => {
    var latitude = json[0].lat;
    var longitude = json[0].lon;
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
      res.setHeader('content-type', 'application/json');
      res.send(jsonString);
    });
  });
  
  })