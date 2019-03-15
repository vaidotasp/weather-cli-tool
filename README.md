# CLI Tool for Weather Forecast

Deliver accurate and well formatted weather forecast right in your terminal.
![](https://thepracticaldev.s3.amazonaws.com/i/89fopmm9lehlmql0rmem.png)

### Usage/Installation

- Install as a global module
  `npm i -g @vaidotasp/weather`
- Get [DarkSky](https://darksky.net/dev) API key for personal use.
- Set Weather CLI to use your DarkSky key

```javascript
$ weather-cli -setdarkkey [key]
```

- Set your locations coordinates manually

```javascript
$ weather-cli setcoords [long, lat]
```

- Use anywhere in your terminal

```javascript
weather-cli - t; //shows current temperature
```
