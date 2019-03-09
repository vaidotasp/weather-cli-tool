#!/usr/bin/env node
const program = require("commander");
const apiActions = require("./apiActions");
import chalk from "chalk";
const log = console.log;

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

// display help if no arguments were provided
if (process.argv.length < 3) {
  program.help();
}

program.command("*").action(() => {
  log(chalk`{red Unknown Command}`);
  program.help();
});

program.parse(process.argv);
