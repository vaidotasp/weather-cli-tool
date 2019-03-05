#!/usr/bin/env node

const program = require("commander");

program.version("1.0.0").description("Weather Forecast CLI");

program
  .command("today")
  .alias("t")
  .description("Show weather information for today")
  .action(() => {
    console.log("Today is a nice day");
  });

program.parse(process.argv);
