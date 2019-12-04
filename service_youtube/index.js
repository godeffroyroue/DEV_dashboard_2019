var axios = require('axios');
let request = require('request');
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

root.post('/api/youtube', (req, res) => {
  console.log('GET /')
  console.log('body', req.body)
  console.log("ici")
  termFromSearchBar = req.body.termFromSearchBar
  itemParam = req.body.itemParam
  axios({
    method: 'get',
    url: 'https://www.googleapis.com/youtube/v3/search',
    params: {
        part: 'snippet',
        type: itemParam,
        maxResults: 5,
        key: KEY,
        q: termFromSearchBar
    }
  }).then((response) => {
    res.status(200).send(response.data)
  });
});

root.post('/api/youtube/channel', (req, res) => {
  console.log('GET /')
  console.log('body chanel', req.body)
  termFromSearchBar = req.body.termFromSearchBar
  axios({
    method: 'get',
    url: 'https://www.googleapis.com/youtube/v3/channels',
    params: {
        part: 'statistics',
        id: termFromSearchBar,
        key: KEY
    }
  }).then((response) => {
    res.status(200).send(response.data)
  });
});


root.post('/api/youtube/lastVideo', (req, res) => {
  console.log('GET /')
  console.log('body playlist', req.body)
  termFromSearchBar = req.body.termFromSearchBar
  termFromSearchBar = termFromSearchBar.replace('C', 'U')
  console.log('body playlist 2', req.body)
  axios({
    method: 'get',
    url: 'https://www.googleapis.com/youtube/v3/playlistItems',
    params: {
        part: 'snippet',
        playlistId: termFromSearchBar,
        maxResults: 1,
        key: KEY
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
server.listen(7676);
console.log('start on port 7676')