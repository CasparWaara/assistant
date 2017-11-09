import weather from './clients/weather';

async function virtual_assistant(input) {
    const res = await identifyQuestion(input);
    return res;
}

async function identifyQuestion(input) {
    if (input.includes('weather')) {
        return weather.weatherParser(input);
    }
    return 'no habla';
}

module.exports = {
    virtual_assistant
};