import weather from './clients/weather';

async function virtual_assistant(input) {
    const res = await identifyQuestion(input);
    return res;
}

async function identifyQuestion(input) {
    if (isWeather(input)) {
        return weather.weatherParser(input);
    }
    return 'no habla';
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

module.exports = {
    virtual_assistant
};