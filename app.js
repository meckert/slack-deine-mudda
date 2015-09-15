var express = require('express');
var bodyParser = require('body-parser');
var bot = require('./bot.js');

var app = express();
var port = process.env.PORT || 3000;

// body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

// test route
app.get('/', function (req, res) {
    var joke = bot.getJoke()
    res.status(200).send(joke);
});

// error handler
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(400).send(err.message);
});

app.listen(port, function () {
    console.log('Slack bot listening on port ' + port);
});

//listen to one of the following words:
// yo mama, your mother, USER mama, USER mother --> show en joke, show personalized en joke
// Deine Mudda, Deine Mutter, USER Mudda, USER Mutter --> show de joke, show personalized de joke

// how do I listen to other commands?
//app.post('/hello', bot);