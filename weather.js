import axios from 'axios';

function weatherCurrent(location) {
    const yquery = 'select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="' + location + '")';
    return axios
        .get('https://query.yahooapis.com/v1/public/yql', {
            params: {
                q: yquery
            }
        })
        .then(function (response) {
            return response;
        })
        .catch(function (error) {
            return error;
        });
}

function weatherParser(input) {
    if (input === 'weather') {
        return weatherCurrent('Oulu, fi');
    }
}

module.exports = {
    weatherParser
}