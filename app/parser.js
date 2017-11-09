import weather from './clients/weather';

async function virtual_assistant(input) {
    const res = await identifyQuestion(input);
    return res;
}

async function identifyQuestion(input) {
    return weather.weatherCurrent('Oulu, fi');
}

module.exports = {
    virtual_assistant
};