import chalk from "chalk";
import axios from "axios";
const Configstore = require("configstore");
const log = console.log;
const conf = new Configstore("weather-cli");

exports.today = function() {
  const DARKSKY_API = conf.get("DARKSKYAPIKEY");
  if(!DARKSKY_API) {
    throw new Error("DarkSky API key is not set, use setdarkkey [key] command to set it up");
    return;
  }
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

    const currentTemperatureC: string = String(Math.round(((currentTemperature - 32) * 5) / 9));
    const dailyTempHighC: string = String(Math.round(((dailyTempHigh - 32) * 5) / 9));
    const dailyTempLowC: string = String(Math.round(((dailyTempLow - 32) * 5) / 9));
    const currentTimeConverted: string = new Date(currentTime * 1000).toLocaleTimeString();
    const humidityPercent: string = String(Math.round(currentHumidity * 100));
    const highTime: string = new Date(dailyTempHighTime * 1000).toLocaleTimeString();
    const lowTime: string = new Date(dailyTempLowTime * 1000).toLocaleTimeString();

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
  });
};
