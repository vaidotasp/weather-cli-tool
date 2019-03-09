# Building Weather Forecast CLI tool Part 1

## The goal and the setup

Our goal is to build a CLI weather forecast app that shows the local weather information. We are going after something like the image below:

![](Screen_Shot_2019-03-03_at_1-544fa3ce-62c9-45bd-a687-2e33dfec3898.35.25_PM.png)

Disclaimers:

- This will be a step by step guide aimed at beginners that are interested in building CLI tools and learning along the way
- There are existing weather CLI tools that are full featured and robust: [https://github.com/chubin/wttr.in](https://github.com/chubin/wttr.in), [https://github.com/genuinetools/weather](https://github.com/genuinetools/weather). This guide does not come close to feature completion, it merely provides an introduction
- If you notice any mistakes or have suggestions - let me know in the comments below. I am still learning!

Let's dive in.

## Requirements for our app

- User is able to invoke weather CLI tool with a single command - "weather-cli"
- User is able to set API key via command line (we will be using Darksky API for weather)
- User is able to see the following information: time, location, temperature, high temp for the day, low temp for the day, humidity and weather conditions summary

## Tools we will be using

- Node - it will be running our program
- Typescript - No reason in particular except to learn a little bit about Typescript :)
- Commander([https://www.npmjs.com/package/commander](https://www.npmjs.com/package/commander)) - this is a great solution to help us build node based CLI's.

## Step A -Program Init

Let's get setup and started.

```javascript
mkdir cli-weather //let's create a directory to work in
npm init --yes //initialize project and skip the typical questionnaire
---
git init //we want to make sure we can go back when invebitable disaster hits :)
```

Now that we have empty working directory and XXX billions of NPM packages at our disposal, we can begin with few crucial dependencies

To use typescript for this project we will need:

- `typescript` - we will be writing TS so this one is obvious.
- `ts-node` - typescript executable for Node.js that we will run our files on
- `@types/node` - type definitions for Node.js

```
npm install --save typescript ts-node
npm install --save-dev @types/node
```

Next up - create `tsconfig.json` in your root folder for minimal configuration. That's what TypeScript will be using to inform itself about the intent of our program.

```javascript
//tsconfig.json
{
  "include": ["src/**/*"],
  "exclude": ["node_modules"],
  "compilerOptions": {
    "noImplicitAny": true,
    "target": "es5",
    "module": "commonjs",
    "types": ["node"],
    "outDir": "lib",
    "rootDir": "src"
  }
}
```

Noteworthy things about tsconfig file:

- "include" points to the directory that will hold our .ts source files, same as the rootDit
- "outDir" is where TS compiler will output files that will have the target of "es5".
- Setup implies that we will have to have two folders at our root directory, namely "src" and "lib".

`$ mkdir lib src`

## Step B - index.ts - first lines of code

We need to make sure our setup worked and TS compiler works as instructed. Let's create entry file in our "src" folder.

```javascript
$ touch src/index.ts

//index.ts content
const sayHello = () => {
  console.log("hey there");
};

sayHello();
```

Modify the `package.json` to include the typescript run and compile step. "run" we will use for running our program using ts-node and "build" we will utilize TypeScript compiler to convert .ts files to .js so it can be executed later.

```javascript
//package.json
"scripts": {
    "start": "ts-node src/index.ts",
    "build": "tsc -p ."
    //-p invokes the project command that compiles based on tsconfig setup,
    //do not forget the "." to indicate the whole directory
  }
```

Let's test that these two commands work:

```javascript
    npm run start // should output "hey there"
    npm run build // should not output anything but create index.js file in /lib
```

If you navigate to /lib/index.js after running "build" this is what you should see:

```javascript
var sayHello = function() {
  console.log("hey there");
};
sayHello();
```

Notice that this code is transformed to ES5 version of JS like we indicated in tsconfig.json. Typescript not only adds types to JS but can also make your .ts file that target earlier versions of JS (super handy!)

## Step C - Everybody do the shebang

We need to make our program executable, meaning that we can invoke it simply by calling shorthand "weather-cli", without any of that `node lib/index.ts` nonsense. Just like we run `npm` we want to do the same here. To do this we need to add what's called shebang at the top of the file- `#!/usr/bin/env node` which instructs bash to treat the file as an executable in node environment. Next we crack open our package.json file and the `bin` configuration just like shown below:

```javascript
// package.json
"bin": {
    "weather-cli": "./lib/index.js"
}
```

npm will help us out here and create symlink between our index.js file and /usr/local/bin/weather-cli/lib/index.js which will be needed for the `npm link` command that we will be running next. It creates a link between local package and global folder. Also, if you are running windows, it is very important that you run this as it will help you with correctly setting up the PATH.

`npm link`

At this point we are all set and in our terminal typing `weather-cli` should execute the program. We can move on to the actual program logic.

## Step D - Set and Get API keys

We will need npm package `commander` ([https://www.npmjs.com/package/commander](https://www.npmjs.com/package/commander)) to help us with interact with the command line.

`npm install commander`

Replace contents of src/index.ts with the following code:

```javascript
// src/index.ts
#!/usr/bin/env node

const program = require("commander");

program
  .version("1.0.0") //arbitrary version - let's go with 1.0.0
  .description("Weather Forecast CLI"); // name of your program goes here

program
  .command("today") //keyword or command to invoke the program feature that goes after "weather-cli"
  .alias("t") //alias or shortening of the command
  .description("Show weather information for today")
  .action(() => {
    console.log("Today is a nice day"); //actual logic that will be executed
  });

program.parse(process.argv); //parses passed arguments to command line
```

Now if you type `weather-cli today (or just t)` you should see it print out `Today is a nice day`. Pretty cool! You can probably see how we can build out feature set of commands from this point on but let's keep going.

To get the weather information we will need an API key from [DarkSky](https://darksky.net/dev). Feel free to use any other free API provider, but I like Darksky because it has accurate information and more than generous free tier.

Once we have this key we need to store it somehow in our program. It is typically kept in environment variables, which would be the best option, but we will be using an npm module `configstore` which creates a json file in your computer root directory (`/Users/username/.config/configstore`). I use it because it makes convenient not only to keep API keys but also other config for the tool (like custom settings).

`npm install configstore`

Here is a basic implementation of commands that will retrieve API key and will set the key. As you will see below we are using Configstore module to access, and store values. You will notice that instead of simple console.log method we are using something called `chalk` which is a great little tool that helps us with terminal styling. You can find the docs here [https://www.npmjs.com/package/chalk](https://www.npmjs.com/package/chalk) but API is a simple one:

```javascript
//Print out red text in the terminal
console.log(chalk`{red Warning This Text Is Very Red}`);
```

```javascript
// index.ts file
const apiActions = require("./apiActions");

program
  .command("getdarkkey")
  .description("Show Darksky API key if set")
  .action(() => {
    apiActions.getKey("darksky");
  });

program
  .command("setdarkkey")
  .description("Set Darksky API key")
  .action(() => {
    apiActions.setKey("darksky", program.args[0]); //pass the first argument as key
  });
```

```javascript
//apiActions.ts
const chalk = require("chalk");
const log = console.log;
const Configstore = require("configstore");

//initialize key with null value
const conf = new Configstore("weather-cli", { DARKSKYAPIKEY: null });

exports.setKey = function(key: string) {
  conf.set("DARKSKYAPIKEY", key);

  log(chalk`
    {green DarkSky API Key: ${key}}
  `);
  return;
};

exports.getKey = function() {
  const key = conf.get("DARKSKYAPIKEY");
  if (key === null) {
    log(chalk`
    {yellow Api key for Darksky is not set, use setdarkkey [key] command to set it up.}
  `);
    return;
  }
  console.log(key);
  return;
};
```

This concludes the Part 1 of the implementation. We've done:

- Project setup with core dependencies (TypeScript, Commander, Chalk, Configstore)
- Created executable and linked the files so we can invoke `weather-cli` directly in the terminal
- Implemented functionality to `get` and `set` API key for DarkSky

So far we have done a lot of prep which will allow us to build flexible tool that we can easily extend with additional commands in Part 2.
