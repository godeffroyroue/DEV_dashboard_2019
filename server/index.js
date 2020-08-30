var express = require('express');
var bodyParser = require('body-parser');
var sequelize = require('sequelize');
var request = require('request');
const axios = require('axios');
var root = express.Router();
var pg = require('pg');
var async = require('async');
var nodemailer = require('nodemailer');
var xoauth2 = require('xoauth2');
const TokenGenerator = require('uuid-token-generator');
const tokgen = new TokenGenerator();
var server = express();
var ip = require('ip');
var client
const KEY = 'AIzaSyAFUNYmE1gfydRFrlb3Q05gXlPSgQmiY6I';


server.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
  next();
});


root.get('/about.json', function(req, res) {
  var data_client = {
    host: ip.address()
  };
  
  var widgets_weather = {
    name: "city_temperature",
    description: "Display temperature for a city",
    params: [city = {
      name: "city",
      type: "string"
    }]
  }
  
  var widgets_weather_uv = {
    name: "city_uv",
    description: "Display UV for a city and sunburn description",
    params: [city = {
      name: "city",
      type: "string"
    }]
  }
  
  var service_weather = {
    name: "weather",
    widgets: [widgets_weather, widgets_weather_uv]
  }
  
  var widgets_youtube1 = {
    name: "channel_description",
    description: "Display informations about a channel on youtube",
    params: [youtube = {
      name: "channel",
      type: "string"
    }]
  }
  
  var widgets_youtube2 = {
    name: "last_video_for_channel",
    description: "Display and render the last video for a channel",
    params: [youtube = {
      name: "channel",
      type: "string"
    }]
  }
  
  var service_youtube = {
    name: "youtube",
    widgets: [widgets_youtube1, widgets_youtube2]
  }
  
  var widgets_clock1= {
    name: "time_for_city",
    description: "Display the current time for a city",
    params: [city = {
      name: "city",
      type: "string"
    }]
  }
  
  var service_clock = {
    name: "clock",
    widgets: [widgets_clock1]
  }
  
  var widgets_cinema1= {
    name: "upcoming movie",
    description: "Display the upcoming movie for specific date",
    params: [data = {
      name: "date",
      type: "string"
    }]
  }
  
  var service_cinema = {
    name: "cinema",
    widgets: [widgets_cinema1]
  }
  
  var data_server = {
    current_time: parseInt(new Date().getTime()/1000),
    services: [service_weather, service_youtube, service_clock, service_cinema]
  };
  about['client'] = data_client;
  about['server'] = data_server;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(about));
});

async.retry(
  {times: 1000, interval: 1000},
  function(callback) {
      pg.connect('postgres://postgres:password@db/db', function(err, cli, done) {
          if (err) {
              console.error("Waiting for db");
          }
          callback(err, cli);
      });
  },
  function(err, cli) {
    if (err) {
      return console.error("Giving up");
    }
    console.log("Connected to db");
    client = cli
  }
);

var smtpTransport = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: "god.justin.dashboard@gmail.com",
    pass: "**********"
  }
});
var rand,mailOptions,host,link;

root.get('/send',function(req,res){
  rand=Math.floor((Math.random() * 100) + 54);
  host=req.get('host');
  link="http://"+req.get('host')+"/verify?id="+req.id;
  mailOptions={
    to : req.query.to,
    subject : "Please confirm your Email account",
    html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>" 
}
console.log(mailOptions);
smtpTransport.sendMail(mailOptions, function(error, response){
  if(error){
        console.log(error);
    res.end("error");
  }else{
        console.log("Message sent: " + response.message);
    res.end("sent");
    }
  });
});

root.get('/verify',function(req,res){
  console.log(req.protocol+":/"+req.get('host'));
  if((req.protocol+"://"+req.get('host'))==("http://"+host)) {
    console.log("Domain is matched. Information is from Authentic email");
    console.log("req.query.id:" + req.query.id);
    const query = client.query('SELECT * FROM users WHERE token = $1', [req.query.id], (err, result) => {
      if (result) {
        if (result.rows[0]) {
          client.query('UPDATE users SET comfirm = $1 WHERE token = $2', [true, req.query.id], (err, result) => {
            res.end("<h1>Email is been Successfully verified");
            console.log("email is verified");
          });
        }
        else {
          res.end("<h1>Bad Request</h1>");
          console.log("email is not verified");
        }
      }
    else
      res.status(200).send("Error");
    });
  }
});

// server.use(cors())
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

var loguser, logpwd
var reguser, regpwd, regemail

root.post('/login', (req, res) => {
  console.log('POST /login')
  console.log('body', req.body)
  loguser = req.body.username;
  logpwd = req.body.password;
  const query = client.query('SELECT * FROM users WHERE username = $1 AND password = $2 AND type_account = $3', [loguser, logpwd, "db"], (err, result) => {
    if (result) {
      if (result.rows[0]) {
        console.log(result.rows[0].username);
        console.log(result.rows[0].password);
        console.log(result.rows[0].token);
        res.status(200).send(result.rows[0]);
      }
      else {
        res.status(200).send("Wrong Password");
      }
    }
    else
      res.status(200).send("Error");
  });
});

root.post('/register', (req, res) => {
  console.log('POST /register')
  console.log('body', req.body)
  reguser = req.body.username;
  regpwd = req.body.password;
  regemail = req.body.email;
  var token = tokgen.generate();
  const query = client.query('INSERT INTO users(username, password, token, type_account, mail, widgets, comfirm) VALUES($1, $2, $3, $4, $5, $6, $7)', [reguser, regpwd, token, "db", regemail,"", false], (err, result) => {
    console.log("result:" + result);
    if (result) {
      rand=Math.floor((Math.random() * 100) + 54);
      host=req.get('host');
      link="http://localhost:7070/verify?id="+token;
      mailOptions={
        to : regemail,
        subject : "Please confirm your Email account | Dashboard EPITECH Godeffroy & Justin",
        html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>" 
      }
      console.log(mailOptions);
      smtpTransport.sendMail(mailOptions, function(error, response){
        if(error){
          console.log(error);
        }else{
          console.log("Message sent: " + response.message);
        }
      });
      res.status(200).send(token);
    }
    else {
      res.status(200).send("This username does already exist");
    }
  });
});

root.post('/auth/facebook', (req, res) => {
  console.log('POST /auth/facebook');
  console.log('body:', req.body);
  const query = client.query('INSERT INTO users(username, password, token, type_account, mail, widgets, comfirm) VALUES($1, $2, $3, $4, $5, $6, $7)', [req.body.username, "facebook-password", req.body.token, "facebook", req.body.email,"", true], (err, result) => {
    console.log("result:" + result);
      const query2 = client.query('SELECT * FROM users WHERE token = $1', [req.body.token], (err, result) => {
      console.log(result);
      if (result) {
        if (result.rows[0]) {
          res.status(200).send(result.rows[0]);
        }
        else {
          res.status(200).send("Wrong Password");
        }
      }
      else
        res.status(200).send("Error");
    });
  });
});

root.post('/api/weather', (req, res) => {
  console.log('POST /api/weather')
  console.log('body', req.body)
  city = req.body.city
  axios({
    method: 'post',
    url: 'http://service_weather:7575/api/weather',
    data: JSON.stringify({
      city: city
    }),
    headers: {
      'Content-Type' : 'application/json',
    }
  }).then((response) => {
      if(response.data === 'error')
        res.status(200).send('error')
      else
        res.status(200).send(response.data)
  });
});

root.post('/api/weatherUV', (req, res) => {
  console.log('POST /api/weather/uv')
  console.log('body', req.body)
  city = req.body.city
  axios({
    method: 'post',
    url: 'http://service_weather:7575/api/weatherUV',
    data: JSON.stringify({
      city: city
    }),
    headers: {
      'Content-Type' : 'application/json',
    }
  }).then((response) => {
    if(response.data === 'error')
      res.status(200).send('error')
    else
      res.status(200).send(response.data)
  });
});

root.post('/api/youtube', (req, res) => {
  console.log('post /api/youtube')
  termFromSearchBar = req.body.termFromSearchBar
  itemParam = req.body.itemParam
  axios({
    method: 'post',
    url: 'http://service_youtube:7676/api/youtube',
    data:{
      termFromSearchBar: termFromSearchBar,
      itemParam: itemParam
    },
  }).then((response) => {
    console.log("all data :" + response.data)
    res.status(200).send(response.data)
  });
});

root.post('/api/youtube/channel', (req, res) => {
  console.log('GET /')
  console.log('body', req.body)
  console.log("ici 1")
  termFromSearchBar = req.body.termFromSearchBar
  // itemParam = req.body.itemParam
  axios({
    method: 'post',
    url: 'http://service_youtube:7676/api/youtube/channel',
    data:{
      termFromSearchBar: termFromSearchBar
    },
  }).then((response) => {
    res.status(200).send(response.data)
  });
});

root.post('/api/youtube/lastVideo', (req, res) => {
  console.log('GET /')
  console.log('body', req.body)
  console.log("ici 1")
  termFromSearchBar = req.body.termFromSearchBar
  // itemParam = req.body.itemParam
  axios({
    method: 'post',
    url: 'http://service_youtube:7676/api/youtube/lastVideo',
    data:{
      termFromSearchBar: termFromSearchBar
    },
  }).then((response) => {
    res.status(200).send(response.data)
  });
});

root.post('/api/cinema', (req, res) => {
  console.log('GET /')
  console.log('body', req.body)
  termFromSearchBar = req.body.termFromSearchBar
  axios({
    method: 'post',
    url: 'http://service_cinema:7777/api/cinema',
    data:{
      termFromSearchBar: termFromSearchBar
    },
  }).then((response) => {
    res.status(200).send(response.data)
  });
});

root.get('/', (req, res) => {
  console.log('GET /')
  res.writeHead(200, {"Content-Type" : "text/html"});
  res.write("login:" + loguser + "," + logpwd)
  res.write("register:" + reguser + "," + regpwd)
  res.end()
});


server.use('/', root);

server.listen(7070);
console.log('start on port 7070')
