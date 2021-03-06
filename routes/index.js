var express = require('express');
var router = express.Router();
var key = require('./keys.js').omdb_api;
var request = require('request');

var movie = [];

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', { title: 'Rest Example', movie: movie });
});

router.post('/', function(req, res){
    var query = req.body.query;
    var url = 'http://www.omdbapi.com/?apikey=' + key + '&t=' + query + '&y=&plot=short&r=json';

    //Clear out movie
    movie = [];

    request(url, function(error, response, body){
        //Check for HTTP Status OK
        if (response.statusCode === 200){
            //Convert the body to a JSON object
            var json = JSON.parse(body);

            //Check if it has an error
            if(json.Error){
                movie = json.Error;
            } else {
                //Otherwise, add our movie information to movie
                movie.push({
                    title: json.Title,
                    year: json.Year,
                    imdb: json.Ratings[0].Value,
                    tomatoes: json.Ratings[1].Value,
                    country: json.Country,
                    plot: json.Plot,
                    actors: json.Actors
                });
            }
        } else {
            //We had something other than HTTP OK
            //Push an error to movie and just pass the body
            movie.push({Error: body});
        }
        //Render the index page
        res.render('index', {title: 'Rest Example', movie: movie[0]});
    });
});

module.exports = router;
