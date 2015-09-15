var fs = require('fs');

function getRandomJoke(jokes) {
    var randomLine = Math.floor(Math.random() * jokes.length);
    return jokes[randomLine];
}

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
    var prefix = lang == 'de' ? 'Deine' : 'Yo'; //TODO: make sure everything starts with Deine or Yo
    return joke.replace(prefix, userName + '\'s');
}

//TODO: think about personalization
function getJoke() {
    var lines = readLinesFromFile('de');
    return getRandomJoke(lines);
}

module.exports = {
  getJoke: getJoke
};

//module.exports = function (req, res, next) {
//    var userName = req.body.user_name;
//    var botPayload = {
//        text : joke
//    };
//
//    // avoid infinite loop
//    if (userName !== 'slackbot') {
//        return res.status(200).json(botPayload);
//    } else {
//        return res.status(200).end();
//    }
//}