import weather from './clients/weather';
import money from './clients/money';
import help from './help';

async function virtual_assistant(input) {
    const res = await identifyQuestion(input);
    return res;
}

async function identifyQuestion(input) {
    if (isWeather(input)) {
        return weather.weatherParser(input);
    } else if (isMoney(input)) {
        return money.moneyParser(input);
    } else if (input === 'help') {
        return help.help();
    }
    return randomdk();
}

function isWeather(input) {
    const substrings = ['weather', 'rain', 'snow', 'forecast', 'sunset', 'sunrise'];
    if (substrings.some(function (v) {
            return input.indexOf(v) >= 0;
        })) {
        return true;
    } else {
        return false;
    }
}

function isMoney(input) {
    const substrings = ['get', 'valuable', 'rate', 'risen', 'fallen'];
    if (substrings.some(function (v) {
            return input.indexOf(v) >= 0;
        })) {
        return true;
    } else {
        return false;
    }
}

function randomdk() {
    let sel = Math.floor(Math.random() * (5 - 1 + 1) + 1);
    switch (sel) {
        case 1:
            return 'Not yet ready to dominate world or I didn\'t understand your question (try help)';
        case 2:
            return 'What did you mean? (try help)'
        case 3:
            return 'That was unexpected. Don\'t know what to say (try help)';
        case 4:
            return 'Try something else (try help)';
        case 5:
            return 'I\'m still learning... (try help)';
        default:
            return 'Ma ei mõista teie küsimust (try help)';
    }

}

module.exports = {
    virtual_assistant
};