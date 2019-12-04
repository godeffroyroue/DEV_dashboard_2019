let request = require('request');
var express = require('express');
var bodyParser = require('body-parser');
var root = express.Router();

let apiKey = '2f91c0f641afba950de4b2968f52224d';

var server = express();

server.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
  next();
});

server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
      
root.post('/api/weather', (req, res) => {
  console.log('POST /')
  console.log('body', req.body)
  city = req.body.city
  url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
  request(url, function (err, response, body) {
    if(err){
      console.log('merde');
      console.log('error:', error);
      res.status(400).end()
    } else {
      let weather = JSON.parse(body)
      if (!weather.main) {
        console.log("null tu es")
        res.status(200).send('error')
      }
      else {
        let message = `It's ${weather.main.temp} degrees in ${weather.name}!`;
        console.log(message)
        res.status(200).send(weather)
      }
    }
  });
});

root.post('/api/weatherUV', (req, res) => {
  console.log('POST /')
  console.log('body', req.body)
  city = req.body.city
  url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
  request(url, function (err, response, body) {
    if(err){
      console.log('merde');
      console.log('error:', error);
      res.status(400).end()
    } else {
      let weather = JSON.parse(body)
      if (!weather.main) {
        console.log("null tu es")
        res.status(200).send('error')
      }
      else {
        let message = `It's ${weather.main.temp} degrees in ${weather.name}!`;
        console.log(message)
        let lat = weather.coord.lat
        let lon = weather.coord.lon
        url2 = `http://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`
        request(url2, function (err, response, body) {
          if(err){
            console.log('merde');
            console.log('error:', error);
            res.status(400).end()
          } else {
            let weather = JSON.parse(body)
            if (!weather) {
              console.log("null tu es")
              res.status(200).send('error')
            }
            else {
              res.status(200).send(weather)
            }
          }
        });
      }
    }
  });
});

root.get('/', (req, res) => {
  console.log('GET /')
  res.writeHead(200, {"Content-Type" : "text/html"});
  res.write("ici weather")
  res.end()
});

server.use('/', root);
server.listen(7575);
console.log('start on port 7575')