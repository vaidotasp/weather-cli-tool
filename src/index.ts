#!/usr/bin/env node
const program = require("commander");
const apiActions = require("./apiActions");
const weatherActions = require("./weatherActions");
import chalk from "chalk";
const log = console.log;

program.version("1.0.0").description("Weather Forecast CLI");

program
  .command("today")
  .alias("t")
  .description("Show weather information for today")
  .action(() => {
    weatherActions.today();
  });

program
  .command("getdarkkey")
  .description("Show Darksky API key if set")
  .action(() => {
    apiActions.getKey("darksky");
  });

program
  .command("getgooglekey")
  .description("Show Google API key if set")
  .action(() => {
    apiActions.getKey("google");
  });

program
  .command("setdarkkey")
  .description("Set Darksky API key")
  .action(() => {
    apiActions.setKey("darksky", program.args[0]);
  });

program
  .command("setgooglekey")
  .description("Set Google API key")
  .action(() => {
    apiActions.setKey("google", program.args[0]);
  });

program
  .command("setcoords")
  .description("Set Coordinates [lat, long] for your location, if it is a negative number you should be using '--' in front of it. For example: setcoords 33.23123 -- -74.213123")
  .action(() => {
    if(program.args.length !== 3) {
        console.log('Please provide both, latitude and longtitude');
        return;
    }
    apiActions.setCoords(program.args[0], program.args[1]);
  });

// display help if no arguments were provided
if (process.argv.length < 3) {
  program.help();
}

program.command("*").action(() => {
  log(chalk`{red Unknown Command}`);
  program.help();
});

program.parse(process.argv);
