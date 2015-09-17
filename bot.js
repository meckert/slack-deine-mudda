var fs = require('fs');

var jokesCache;
var currentLanguage;
var fallbackLanguage = 'en';

function getRandomJoke(jokes) {
    var randomLine = Math.floor(Math.random() * jokes.length);
    return jokes[randomLine];
}

function readLinesFromFile(language) {
    var lang = language ? language : fallbackLanguage;

    try {
        var filename = __dirname + "/jokes/" + lang + ".txt"
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

    if (username && lang === 'en') {
        personalized = joke.replace(/yo/i, username + '\'s');
    }

    return personalized;
}

function getUserLanguage(text) {
    return text.length > 0
            ? text.toLowerCase().indexOf('mudda') > -1 ? 'de' : fallbackLanguage
            : fallbackLanguage;
}

function hasUserLanguageChanged(userLang) {
    return userLang !== currentLanguage;
}

//TODO: support insulting other users moms :)
function getJoke(username, lang) {
    var lines = !jokesCache || hasUserLanguageChanged(lang)
                    ? readLinesFromFile(lang)
                    : jokesCache;

    var joke = getRandomJoke(lines);
    return personalizeJoke(joke, username, lang);
}

function handlePost(req, res, next) {
    var text = !req.body.text ? '' : req.body.text;
    var username = req.body.user_name;
    var language = getUserLanguage(text);
    var joke = getJoke(username, language);
    currentLanguage = language;
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