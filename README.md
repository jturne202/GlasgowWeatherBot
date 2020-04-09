# GlasgowWeatherBot
GlasgowWeatherBot is a Twitter bot that reports the weather in Glasgow, UK every couple of hours.  

Example:  
  
Aug 15th 18  
6am: 16°C light rain, 92% cloudy, 15 mph SW  
9am: 17°C light rain, 92% cloudy, 16 mph SW  
12pm: 18°C light rain, 64% cloudy, 19 mph SW  
3pm: 18°C light rain, 68% cloudy, 17 mph SW  

GlasgowWeatherBot uses Node js with the npm packages *request, moment, and twit*.

**request** is used to get hourly weather updates from openweathermap's API.  
**moment** is used to handle date time conversions to more readable formats.  
**Twit** is used to tweet the weather.  
