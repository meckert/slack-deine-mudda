var fs = require('fs');

var jokesCache;

function getRandomJoke(jokes) {
    var randomLine = Math.floor(Math.random() * jokes.length);
    return jokes[randomLine];
}

function readLinesFromFile(language) {
    try {
        var filename = __dirname + "/jokes/" + language + ".txt"
        var jokes = fs.readFileSync(filename, 'UTF8');
        jokesCache = jokes.trim().split(/\n/);
        return jokesCache;
    } catch(e) {
        console.log(e);
    }
}

function personalizeJoke(joke, username, lang) {
    var personalized = joke;

    if (username && lang === 'de') {
        personalized = joke.replace(/deine/i, username + '\'s'); //TODO: add case for deiner
    }

    return personalized;
}

function getJoke(username) {
    var lines = !jokesCache
                    ? readLinesFromFile('de')
                    : jokesCache;

    var joke = getRandomJoke(lines);
    return personalizeJoke(joke, username, 'de');
}

function handlePost(req, res, next) {
    var username = req.body.user_name;
    var joke = getJoke(username);
    var botPayload = {
        text : joke
    };

    // avoid infinite loop
    if (username !== 'slackbot') {
        return res.status(200).json(botPayload);
    } else {
        return res.status(200).end();
    }
}

module.exports = {
    getJoke: getJoke,
    callback: handlePost
};