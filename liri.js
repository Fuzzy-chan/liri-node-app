
require("dotenv").config();
var fs = require('fs');
var request = require('request');
var nodeArg = process.argv;
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var keys = require('./key.js')
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
var command = nodeArg[2];
var title = nodeArg[3];

var params = {
    screen_name: 'fuzzybootcamp',
    count: 20
};

if (command === undefined){
    var info = fs.readFileSync('random.txt','utf8')
    var choices = info.split(',');
    command = choices[0];
    title = choices[1];
    
}

if (command === 'my-tweets') {
    client.get('statuses/user_timeline', params, function (err, tweets, response) {
        if (err) {
            return console.log(err)
        }
        for (var i = 0; i < tweets.length; i++) {
            console.log(tweets[i].text)
            console.log(tweets[i].created_at)
            fs.appendFile('log.txt',tweets[i].text + tweets[i].acreated_at+'\n')
        }
    })
}

 else if (command === 'spotify-this-song') {
    if (title === undefined){
        title = 'The Sign'
    }
    spotify.search({ type: 'track', query: title, limit: 1 }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        console.log(data.tracks.items[0].artists[0].name);
        console.log(data.tracks.items[0].name);
        console.log(data.tracks.items[0].album.name);
        console.log(data.tracks.items[0].preview_url);
        fs.appendFile('log.txt',data.tracks.items[0].artists[0].name+'\n'+data.tracks.items[0].name+'\n'+data.tracks.items[0].album.name+'\n'+data.tracks.items[0].preview_url+'\n')
    });
}

else if (command === 'movie-this'){
    if (title === undefined){
        title = 'Mr. Nobody'
    }
    

    request('http://www.omdbapi.com/?t=' + title + '&y=&plot=short&apikey=trilogy', function (error, response, body) {
        var info = JSON.parse(body)
        console.log(info.Title)
        console.log(info.Year)
        console.log(info.imdbRating)
        console.log(info.Ratings[1].value)
        console.log(info.Country)
        console.log(info.Language)
        console.log(info.Plot)
        console.log(info.Actors)
        fs.appendFile('log.txt',info.Title+'\n'+info.Year+'\n'+info.imdbRating+'\n'+info.Ratings[1].value+'\n'+info.Country+'\n'+info.Language+'\n'+info.Plot+'\n'+info.Actors+'\n')        

})
}
else {
    console.log("Not an expected response. Please try one of the following:")
    console.log("my-tweets")
    console.log("spotify-this-song")
    console.log("movie-this")
}

