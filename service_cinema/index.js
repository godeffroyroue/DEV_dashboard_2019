var axios = require('axios');
var express = require('express');
var bodyParser = require('body-parser');
var root = express.Router();

const KEY = 'AIzaSyAO_i1FyQVoUX57g_BNd_IeYeCLEuw4vlo';

var server = express();

server.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
  next();
});

server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

root.post('/api/cinema', (req, res) => {
  console.log('GET /')
  console.log('body', req.body)
  termFromSearchBar = req.body.termFromSearchBar
  axios({
    method: 'get',
    url: `https://api.internationalshowtimes.com/v4/movies?include_upcomings=true&countries=FR`,
    params: {
        release_date_from: termFromSearchBar,
    },
    headers: {
        'X-API-Key' : 'dkzX1ABroSzqNmtdu57mZ3IDhGcE0A7T',
    }
  }).then((response) => {
    res.status(200).send(response.data)
  });
});

root.get('/', (req, res) => {
  console.log('GET /')
  res.writeHead(200, {"Content-Type" : "text/html"});
  res.write("ici weather")
  res.end()
});

server.use('/', root);
server.listen(7777);
console.log('start on port 7777')