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

First up - let's make this data presentable.

1. Temperature needs to be converted to Celcius for convienience to display both C and F.
2. Humidity needs to be shown in percentage
3. Time indications need to be shown in human readable form

```javascript
const currentTemperatureC: string = String(Math.round(((currentTemperature - 32) * 5) / 9));
const dailyTempHighC: string = String(Math.round(((dailyTempHigh - 32) * 5) / 9));
const dailyTempLowC: string = String(Math.round(((dailyTempLow - 32) * 5) / 9));
const currentTimeConverted: string = new Date(currentTime * 1000).toLocaleTimeString();
const humidityPercent: string = String(Math.round(currentHumidity * 100));
const highTime: string = new Date(dailyTempHighTime * 1000).toLocaleTimeString();
const lowTime: string = new Date(dailyTempLowTime * 1000).toLocaleTimeString();
```

Let's unpack what is going on above. We are doing a few conversions and rounding results with a handy Math.round() method. Time conversions are also simply done with build in `new Date()` object. You may notice something strange next to the variable declarations `const currentTemperatureC: string = ...`. Those are TypeScript types. We indicate that the result of that particular assignment should always be a string. It seems trivial at this point, but if we ever want to change our program and how we calculate temperature, this will help us to make sure we do not change the type from `string` to `number` for example. You may also be asking why are we forcing some of the numbers to be converted to strings with `String()` -> that is needed because to print out the results we will be using JavaScript template literals (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) which will make TypeScript yell at us if we try to pass `number` to a string literal like this:

```javascript
const someCalculation: number = 14;
console.log(`Print my calculation ${someCalculation}`); //TS yelling at us here!
```

I am not entirely sure why that is so if you have idea, do let me know in the comment below! 👇

Our last step in this part is to print the results in a nice and presentable fashion. `chalk` module comes to the resque!

```javascript
log(chalk`
|-|  {blue ╦ ╦┌─┐┌─┐┌┬┐┬ ┬┌─┐┬─┐}
|-|  {blue ║║║├┤ ├─┤ │ ├─┤├┤ ├┬┘}
|-|  {blue ╚╩╝└─┘┴ ┴ ┴ ┴ ┴└─┘┴└─}
|-|   🌎 {blue Washington DC, USA} ${currentTimeConverted}            
|-|   🐡 ${currentSummary}                                        
|-|   ☀️ {yellow.bold ${currentTemperature}F}/{blue.bold ${currentTemperatureC}C}                       
|-|   🌊 ${humidityPercent}%                              
|-|   📇 ${dailySummary}                                    
|-|   📈 High: {yellow.bold ${dailyTempHigh}F}/{blue.bold ${dailyTempHighC}C} At: ${highTime} 
|-|   📉 Low : {yellow.bold ${dailyTempLow}F}/{blue.bold ${dailyTempLowC}C} At: ${lowTime}     
`);
return;
```

## Part X - Publish to NPM
