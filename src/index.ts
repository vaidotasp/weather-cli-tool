#!/usr/bin/env node
const program = require("commander");
const apiActions = require("./apiActions");

program.version("1.0.0").description("Weather Forecast CLI");

program
  .command("today")
  .alias("t")
  .description("Show weather information for today")
  .action(() => {
    console.log("Today is a nice day");
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

program.parse(process.argv);
