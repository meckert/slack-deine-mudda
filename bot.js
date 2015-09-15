var fs = require('fs');

function getRandomJoke(jokes) {
    var randomLine = Math.floor(Math.random() * jokes.length);
    return jokes[randomLine];
}

//TODO: caching
function readLinesFromFile(language) {
    try {
        var filename = __dirname + "/jokes/" + language + ".txt"
        var jokes = fs.readFileSync(filename, 'UTF8');
        return jokes.trim().split(/\n/);
    } catch(e) {
        console.log(e);
    }
}

function personalizeJoke(joke, userName, lang) {
    //TODO: replacing works only when lower casing first
    var prefix = lang == 'de' ? 'deine' : 'yo';
    return joke.replace(prefix, userName + '\'s');
}

//TODO: think about personalization
function getJoke() {
    var lines = readLinesFromFile('de');
    return getRandomJoke(lines);
}

function handlePost(req, res, next) {
    var userName = req.body.user_name;
    var joke = getJoke();
    var personalizedJoke = personalizeJoke(joke, userName, 'de');
    var botPayload = {
        text : personalizedJoke
    };

    // avoid infinite loop
    if (userName !== 'slackbot') {
        return res.status(200).json(botPayload);
    } else {
        return res.status(200).end();
    }
}

module.exports = {
    getJoke: getJoke,
    callback: handlePost
};