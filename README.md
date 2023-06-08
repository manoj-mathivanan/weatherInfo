# Swagger generated server

## Overview
Weather forecasting application that integrates with the OpenWeatherMap API and Google Maps API. The application allows users to retrieve weather information for a given location and visualize the weather conditions on a map.

### Running the server
To run the server, run:

```
npm install

node server.js
```

Open URL
```
open http://localhost:3000
```

API
```
curl --location --request POST 'http://localhost:3000/weather' \
--header 'Content-Type: application/json' \
--data-raw '{ "location": "chennai" }'
```

Pending/Next steps
 - modularization
 - caching
 - error handling
 - test cases
 - add billing for API