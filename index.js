require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const dns = require('dns');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use(bodyParser.urlencoded({extended: false}));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

let urlDatabase = {};
let counter = 1;

const checkUrlValidity  = (url, callback) => {
  try {
    const hostname = new URL(url).hostname;
    dns.lookup(hostname, (error) => {
      callback(!error);
    })
  }catch(err){
    callback(false);
  }
}

app.post('/api/shorturl', (req, res) => {
  const url = req.body.url;

  checkUrlValidity(url, (isValid) => {
    if(isValid == false){
      return res.json({ error: 'invalid url' });
    }
  });

  const shorturl = counter++;
  urlDatabase[shorturl] = original_url;

  res.json({original_url: url, short_url: shorturl});
});

app.get('/api/shorturl/:shorturl', (req, res) => {
  const shortURL = req.params.shorturl;
  const originalUrl = urlDatabase[shortUrl];

  if(originalUrl){
    res.redirect(originalUrl);
  }
  else{
    res.json({error: 'Short url not found in db!'});
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
