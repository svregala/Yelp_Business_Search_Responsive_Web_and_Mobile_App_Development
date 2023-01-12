const { request } = require('express');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const axios = require('axios');

const YELP_KEY = "THIS IS HIDDEN FROM PUBLIC"
const GOOGLE_KEY = "THIS IS HIDDEN FROM PUBLIC"

const TEMP_PORT = 3080;

yelp_headers = {'Authorization': 'Bearer ' + YELP_KEY}

/*const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:4200'
}));*/

//app.use(express.static(process.cwd()+"/app_hw8/src/"));
//app.use(express.static(process.cwd()+"/app_hw8/dist/app"));
app.use(express.static(process.cwd()+"/dist/app"));

/* Landing page */
app.get('/', (req, res) => {
  //res.send('Hello from App Engine!');
  //res.sendFile(process.cwd() + "/app_hw8/src/index.html")
  //res.sendFile(process.cwd() + "/app_hw8/dist/app/index.html")
  res.sendFile(process.cwd() + "/dist/app/index.html")
});

/* Add another app.get with /search */
app.get('/search', (req, res) => {
  //res.send('Hello from App Engine!');
  //res.sendFile(process.cwd() + "/app_hw8/src/index.html")
  //res.sendFile(process.cwd() + "/app_hw8/dist/app/index.html")
  res.sendFile(process.cwd() + "/dist/app/index.html")
});


/* Autocomplete */
app.get('/api/autocomplete', (req, res) => {
  var url = 'https://api.yelp.com/v3/autocomplete?text=' + req.query.text;
  const head = {headers: yelp_headers};
  axios.get(url, head).then(function(response){
    console.log(JSON.stringify(response.data));
    var final = [];
    if(response.data==undefined || response.data==null){
      res.send(JSON.stringify(final));
    }else{
      ret_obj = response.data;
      var temp_terms = ret_obj.terms;
      var temp_cats = ret_obj.categories;
      for(var i=0; i<temp_terms.length; i++){
        final.push(temp_terms[i].text);
      }
      for(var i=0; i<temp_cats.length; i++){
        final.push(temp_cats[i].title);
      }
      console.log(JSON.stringify(final));
      res.send(JSON.stringify(final));
    }
  }).catch(function(err){
    console.log(err.error);
  })
});

/* Search */
app.get('/api/searchBusiness', (req, res) => {
  var url = 'https://api.yelp.com/v3/businesses/search?term='+req.query.term+'&latitude='+req.query.latitude+'&longitude='+req.query.longitude+'&category='+req.query.category+'&radius='+req.query.radius;
  const head = {headers: yelp_headers};
  axios.get(url, head).then(function(response){
    console.log(JSON.stringify(response.data));
    var final = response.data.businesses;
    if(response.data.businesses.length==0){
      res.send(JSON.stringify(""));
    }else{
      res.send(JSON.stringify(final));
    }
  }).catch(function(err){
    console.log(err.error);
  })
});

/* Details */
app.get('/api/details', (req, res) => {
  var url = 'https://api.yelp.com/v3/businesses/'+req.query.id;
  const head = {headers: yelp_headers};
  axios.get(url, head).then(function(response){
    console.log(JSON.stringify(response.data));
    var final = response.data;
    if(response.data==undefined || response.data==null){
      res.send(JSON.stringify(""));
    }else{
      res.send(JSON.stringify(final));
    }
  }).catch(function(err){
    console.log(err.error);
  })
});

/* Google Location */
app.get('/api/googlelocation', (req, res) => {
  var url = 'https://maps.googleapis.com/maps/api/geocode/json?address='+req.query.address+'&key='+GOOGLE_KEY;
  console.log('ENTERED GOOGLE LOCATION');
  console.log('req.address is: ', req.query.address);
  axios.get(url).then(function(response){
    console.log(JSON.stringify(response.data));
    var final = [];
    if(response.data.status=='ZERO_RESULTS'){
      console.log(final);
      res.send(JSON.stringify(final));
    }else{
      final.push(response.data.results[0].geometry.location.lat);
      final.push(response.data.results[0].geometry.location.lng);
      console.log("This is final array: ", final);
      res.send(JSON.stringify(final));
    }
  }).catch(function(err){
    console.log(err.error);
  })
});


/* Reviews */
app.get('/api/reviews', (req, res) => {
  var url = 'https://api.yelp.com/v3/businesses/'+req.query.id+'/reviews';
  const head = {headers: yelp_headers};
  axios.get(url, head).then(function(response){
    console.log(JSON.stringify(response.data));
    if(response==undefined || response==null){
      res.send(JSON.stringify(final));
    }else{
      res.send(JSON.stringify(response.data.reviews));
    }
  }).catch(function(err){
    console.log(err.error);
  })
});


// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});

/*app.listen(TEMP_PORT, () => {
  console.log(`Server listening on port ${TEMP_PORT}...`);
});*/