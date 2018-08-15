const request = require('request');
const moment = require('moment');
const Twit = require('twit');

/*
Example Tweet

Aug 15th 18
6am: 16°C light rain, 92% cloudy, 15 mph SW
9am: 17°C light rain, 92% cloudy, 16 mph SW
12pm: 18°C light rain, 64% cloudy, 19 mph SW
3pm: 18°C light rain, 68% cloudy, 17 mph SW
*/


// Parses weather from openweathermap ready for tweeting
function getWeather() {
    // Gets hourly weather over the next 5 days in JSON
    // from openweathermap for Glasgow UK
    request('http://api.openweathermap.org/data/2.5/forecast?q=Glasgow,UK&APPID={key}', function (error, response, body) {
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        console.log();

        //Store result in JSON Object
        const obj = JSON.parse(body);

        // Gets first result date
        let weather = moment(obj.list[0].dt_txt).format("MMM Do YY") + "\n"; // Aug 15 2018

        // Gets next 4 weather updates and parses relevant data
        for (let i = 0; i < 4; i++) {
            weather +=
                moment(obj.list[i].dt_txt).format("ha") + ": " +        // hours + am/pm Eg: 3am
                Math.round((obj.list[i].main.temp) - 273.15) + "°C " +  //Temperature Eg: 16°C
                obj.list[i].weather[0].description + ", " +             //Weather type Eg: light rain
                obj.list[i].clouds.all + "% cloudy, " +                 //Cloud coverage Eg: 92% cloudy
                Math.round((obj.list[i].wind.speed) *2.2369) + " mph "  //Wind Speed Eg: 15 mph
                + windDirection(obj.list[i].wind.deg) + "\n";           //Wind Direction Eg: SW
        }

        console.log(weather)
    });
}

// Converts wind direction from degrees to cardinal direction
function windDirection(deg) {
    let direction = "";
    switch (true) {
        case (deg < 22.5):
            direction = "N";
            break;
        case (deg < 67.5):
            direction = "NE";
            break;
        case (deg < 112.5):
            direction = "E";
            break;
        case (deg < 157.5):
            direction = "SE";
            break;
        case (deg < 202.5):
            direction = "S";
            break;
        case (deg < 247.5):
            direction = "SW";
            break;
        case (deg < 192.5):
            direction = "W";
            break;
        case (deg < 337.5):
            direction = "NW";
            break;
        case (deg <= 360):
            direction = "N";
            break;
        default:
            console.log("error");
            break;
    }
    return direction;
}

// Twitter account details
const T = new Twit({
    consumer_key:         'YOUR_INFO_HERE',
    consumer_secret:      'YOUR_INFO_HERE',
    access_token:         'YOUR_INFO_HERE',
    access_token_secret:  'YOUR_INFO_HERE',
    timeout_ms:           60 * 1000,
});

// Tweets the Weather
T.post(
    'statuses/update',
    { status: getWeather() },
    (err, data, response) => {
        console.log(err, data, response);
    }
);
