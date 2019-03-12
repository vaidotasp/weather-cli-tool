const Configstore = require("configstore");
import chalk from "chalk";
const log = console.log;

//initialize two keys with null values
const conf = new Configstore("weather-cli", { GOOGLEAPIKEY: null, DARKSKYAPIKEY: null });

exports.getKey = function(type: string) {
  if (type !== "google" && type !== "darksky") {
    return new Error("No such api type exists");
  }
  const key = type === "google" ? conf.get("GOOGLEAPIKEY") : conf.get("DARKSKYAPIKEY");
  if (key === null) {
    log(chalk`
    {yellow Api key for ${type} is not set, use setdarkkey [key] or setgooglekey [key] command to set it up.}
  `);
    return;
  }
  log(chalk`
    {green DarkSky API Key: ${key}}
  `);
  return key;
};

exports.setKey = function(type: string, key: string) {
  if (type !== "google" && type !== "darksky") {
    return new Error("No such api type exists");
  }

  if (type === "google") {
    conf.set("GOOGLEAPIKEY", key);
  } else if (type === "darksky") {
    conf.set("DARKSKYAPIKEY", key);
  }

  log(chalk`
    {green DarkSky API Key: ${key}}
  `);

  return;
};
