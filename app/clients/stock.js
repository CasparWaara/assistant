import axios from 'axios';
import WtoN from 'words-to-num';
import _ from 'lodash';
// stocks: https://iextrading.com/developer/docs/
// quote for <AAPL>
// <five> day forecast for <oulu, finland>
// when will sunset at <oulu, finland>
// when will sunrise at <oulu, finland>
// will it rain tomorrow in <oulu, finland>
function stockFetch(search, sparam) {
    let url = 'https://api.iextrading.com/1.0';

    if (search === 'quote') {
        url += '/stock/' + sparam + '/quote'
    }
    return axios
        .get(url, {

        })
        .then(function (response) {
            return 'Last price for ' + response.data.companyName + ' is ' + response.data.latestPrice;
        })
        .catch(function (error) {
            return 'Could not get the weather information. Not sure what to do :(';
        });
}

function stockParser(input) {
    if (input.startsWith('quote')) {
        return stockFetch('quote', 'AAPL');
    }
    return 'Could not get the weather information. Not sure what to do :(';
}


module.exports = {
    stockParser
}