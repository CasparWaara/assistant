import axios from 'axios';
import WtoN from 'words-to-num';
import _ from 'lodash';
// weather:
// what's the weather in <oulu, finland>
// <five> day forecast for <oulu, finland>
// when will sunset at <oulu, finland>
// when will sunrise at <oulu, finland>
// will it rain tomorrow in <oulu, finland>
function weatherCurrent(location, search = '', days = 0) {
    if (location === '') {
        return 'Hmm, seems that you didn\'t provide location...or at least I don\'t know it';
    }
    const yquery = 'select * from weather.forecast ' +
        'where woeid in (select woeid from geo.places(1) ' +
        'where text="' + location + '")  and u="c"';
    return axios
        .get('https://query.yahooapis.com/v1/public/yql', {
            params: {
                q: yquery,
                format: 'json'
            }
        })
        .then(function (response) {
            let weather = '';
            if (_.get(response.data, 'query.results.channel')) {
                const w = response.data.query.results.channel;
                if (w !== undefined) {
                    if (search === '') {
                        weather += w.description + '\n';
                        weather += `It's ${w.item.condition.temp} C and it is ${w.item.condition.text}`;
                    } else if (search === 'sunset') {
                        weather += w.description + '\n';
                        weather += `Sun will set at ${w.astronomy.sunset}`;
                    } else if (search === 'sunrise') {
                        weather += w.description + '\n';
                        weather += `Sun will rise at ${w.astronomy.sunrise}`;
                    } else if (search === 'forecast') {
                        weather += w.description + '\n';
                        for (let i = 0; i < days; i++) {
                            weather += `${w.item.forecast[i].day} ${w.item.forecast[i].date} \n ${w.item.forecast[i].high} / ${w.item.forecast[i].low} C, ${w.item.forecast[i].text}\n`;
                        }
                    } else if (search === 'rain') {
                        const substrings = ['rain', 'snow', 'shower'];
                        if (substrings.some(function (v) {
                                return w.item.forecast[1].text.toLowerCase().indexOf(v) >= 0;
                            })) {
                            weather += 'Yes';
                        } else {
                            weather += 'No';
                        }
                    }
                }
            }
            if (weather === '') {
                weather = 'Could not get the weather information. Not sure what to do :(';
            }
            return weather;
        })
        .catch(function (error) {
            return 'Could not get the weather information. Not sure what to do :(';
        });
}

function weatherParser(input) {
    if (input.startsWith('what')) {
        return weatherCurrent(getLocation(input));
    } else if (input.startsWith('when')) {
        return weatherCurrent(getLocation(input), input.split(' ')[2]);
    } else if (input.startsWith('will')) {
        return weatherCurrent(getLocation(input), 'rain');
    } else if (isNumber(input) !== NaN) {
        return weatherCurrent(getLocation(input), 'forecast', isNumber(input));
    }
    return 'Could not get the weather information. Not sure what to do :(';
}

function isNumber(input) {
    const val = input.split(' ')[0];
    if (!isNaN(val)) {
        return val;
    } else if (WtoN.convert(val) !== NaN) {
        return WtoN.convert(val)
    } else {
        return NaN;
    }
}

// silly function to get the location from string...not anywhere near good implementation
// but get's the job done in the way it was specified.
function getLocation(input) {
    if (input.split(' ').indexOf('in') > 0) {
        return input.substring(input.indexOf('in') + 3);
    } else if (input.split(' ').indexOf('at') > 0) {
        return input.substring(input.indexOf('at') + 3);
    } else if (input.split(' ').indexOf('to') > 0) {
        return input.substring(input.indexOf('to') + 3);
    } else if (input.split(' ').indexOf('for') > 0) {
        return input.substring(input.indexOf('for') + 3);
    } else {
        return '';
    }

}

module.exports = {
    weatherParser
}