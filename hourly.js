const request = require('request-promise');
const moment = require('moment');
const Twit = require('twit');
const cron = require("node-cron");
const express = require("express");
// You must create a keys.js file which exports these below.
const { open_weather_map_key, consumer_key, consumer_secret, access_token, access_token_secret, timeout_ms } = require('./keys');

// Parses weather from openweathermap ready for tweeting
function getWeather() {
    // Gets hourly weather over the next 5 days in JSON
    // from openweathermap for Glasgow UK
    return request(`http://api.openweathermap.org/data/2.5/forecast?q=Glasgow,UK&APPID=${open_weather_map_key}`) 
        .then(res => {
            //Store result in JSON Object
            const obj = JSON.parse(res);

            // Gets first result date
            let weather = moment(obj.list[0].dt_txt).format("MMM Do YYYY") + "\n"; // Aug 15 2018

            // Gets next 4 weather updates and parses relevant data
            for (let i = 0; i < 4; i++) {
                weather +=
                    moment(obj.list[i].dt_txt).format("ha") + ": " +        // hours + am/pm Eg: 3am
                    Math.round((obj.list[i].main.temp) - 273.15) + "°C " +  // Temperature Eg: 16°C
                    obj.list[i].weather[0].description + ", " +             // Weather type Eg: light rain
                    obj.list[i].clouds.all + "% cloudy, " +                 // Cloud coverage Eg: 92% cloudy
                    Math.round((obj.list[i].wind.speed) *2.2369) + " mph "  // Wind Speed Eg: 15 mph
                    + windDirection(obj.list[i].wind.deg) + "\n";           // Wind Direction Eg: SW
            }

            weather += '\n#Glasgow #Weather #GlasgowWeather'
            return weather;
        })
        .catch(err => {
            console.log(moment().utc().format(), 'ERROR creating tweet content')
            console.log(moment().utc().format(), err)
        });
};

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
};

// Twitter account details
const T = new Twit({
    consumer_key,
    consumer_secret,
    access_token,
    access_token_secret,
    timeout_ms,
});

// test
// getWeather().then(weather => {console.log(weather)})

app = express();

cron.schedule('* */4 * * *', () => {
    // Tweets the Weather
    getWeather().then(weather => {
        T.post(
            'statuses/update',
            { status: weather },
            (err, data, response) => {
                if (err) {
                    console.log(moment().utc().format(), 'ERROR posting tweet')
                    console.log(moment().utc().format(), err)
                } else {
                    console.log(moment().utc().format(), 'SUCCESSFUL posting tweet')
                };
            }
        );
    });
});

app.listen(process.env.PORT || 3000, () => `Listening on port ${process.env.PORT || 3000}!`);
