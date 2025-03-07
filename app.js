const express = require('express');

const hbs = require('hbs');
const path = require('path');
const PunkAPIWrapper = require('punkapi-javascript-wrapper');

const app = express();
const punkAPI = new PunkAPIWrapper();

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

// Register the location for handlebars partials here:

hbs.registerPartials(__dirname + '/views/partials')

// Add the route handlers here:

app.get('/', (req, res) => res.render('index'));

app.get('/beers', (req, res) => {
  let beers = punkAPI.getBeers();
  beers.then(function (beersData) {
    res.render('beers', {beers:beersData});
  });
  beers.catch(error => console.log(error));
});

app.get('/beers/beer-:id', (req, res) => {
  let id = req.params.id;
  let beers = punkAPI.getBeers();
  beers.then(function (beerData) {
    beerData[id].displayDetails = true;
    res.render('randomBeer', {beer:beerData[id]})
  })
  beers.catch(error => console.log(error));
})

app.get('/random-beer', (req, res) => {
  let beers = punkAPI.getBeers();
  beers.then(function (beersData) {
    let i = Math.floor(Math.random()*beersData.length)
    let data = {
      beer: beersData[i],
      title: 'Random Beer'
    }
    beersData[i].displayDetails = true;
    res.render('randomBeer', data);
  });
  beers.catch(error => console.log(error));
})


app.listen(3000, () => console.log('🏃‍ on port 3000'));
