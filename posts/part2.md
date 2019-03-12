# Building Weather Forecast CLI tool Part 2

(Link to part 1 - [www.google.com])

This is the second part of the Building CLI tools series that will go into detail how to call Darksky API from your command line and print out the results and then publish our CLI to npm.

Just to recap from the Part 1 - We will be building something that will look similar to this image:

[linklink]

## Part A - Call the API and retrieve info

Let's get the invocation of today's weather forecast from our main entry file

```javascript
// index.ts
program
  .command("today")
  .alias("t")
  .description("Show weather information for today")
  .action(() => {
    weatherActions.today();
  });
```

Our weather API logic we will be sitting in a single file - `weatherActions.ts` where we will be calling DarkSky API, normalizing the data and printing it out. Calling API will be done through `axios` package and printing it out to the console will be done with `chalk`, be sure to have those installed before continuing.

```javascript
//weatherActions.ts
import chalk from "chalk";
import axios from "axios";
const Configstore = require("configstore");
const log = console.log;
const conf = new Configstore("weather-cli");

exports.today = function() {
  const DARKSKY_API = conf.get("DARKSKYAPIKEY");
  //DC - 38.889102, -77.050637
  let URL = `https://api.darksky.net/forecast/${DARKSKY_API}/38.889102,-77.050637?exclude=minutely`;
  axios.get(URL).then(response => {
    if (response.status !== 200) {
      return new Error(`Darksky API error ${response.status}`);
    }
    //deconstruct current weather data
    const {
      time: currentTime,
      summary: currentSummary,
      temperature: currentTemperature,
      humidity: currentHumidity
    } = response.data.currently;

    //deconstruct today's weather data
    const {
      summary: dailySummary,
      temperatureHigh: dailyTempHigh,
      temperatureHighTime: dailyTempHighTime,
      temperatureLow: dailyTempLow,
      apparentTemperatureLowTime: dailyTempLowTime
    } = response.data.daily.data[0];
  });
};
```

OK, let's unpack what is going on in the file above. We are importing previously mentioned dependencies, and API key which we set up in the Part 1 (link).
`configstore` has a handy method `.get` to retrieve whichever key you have set previously. We will be using it to call our API endpoint. You will notice that I hardcoded longtitude and latitude to my location, we can implement city search as a future goal but for now you can just put your own coordinates instead.

Axios works as normal, after we check that response status is `200` (meaning everything is OK), we proceed to extract relevant data fields from the response payload. We are using object destructuring and [rename feature](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) of ES6.

Now if we simply `console.log` that received information, results will not be great, you may see something like this:

We clearly need to do some time conversion, temperature adjustments to include Celsius and Farenheit and basically make it much more appealing.

## Part Y - Pretty print please

## Part X - Publish to NPM
