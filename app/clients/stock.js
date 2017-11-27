import axios from 'axios';
import WtoN from 'words-to-num';
import _ from 'lodash';
import moment from 'moment';

const errorMsg = 'Could not get the stock information. Not sure what to do :(';
// stocks: https://iextrading.com/developer/docs/
// quote for <AAPL>
// has <AAPL> gone up?
// who is ceo of <AAPL>
// how much revenue <AAPL> made
// any news on <AAPL>
function stockFetch(search, sparam) {
    let url = 'https://api.iextrading.com/1.0';

    if (search === 'quote' || search === 'up') {
        url += '/stock/' + sparam + '/quote';
    } else if (search === 'ceo') {
        url += '/stock/' + sparam + '/company';
    } else if (search === 'revenue') {
        url += '/stock/' + sparam + '/stats';
    } else if (search === 'news') {
        url += '/stock/' + sparam + '/news/last/1';
    }
    return axios
        .get(url, {

        })
        .then(function (response) {
            if (search === 'quote') {
                return `Last price for ${response.data.companyName} is ${response.data.latestPrice}`;
            } else if (search === 'up') {
                if (response.data.change > 0) {
                    return 'Yes';
                } else {
                    return 'Nope';
                }
            } else if (search === 'ceo') {
                return `CEO of ${response.data.companyName} is ${response.data.CEO}`;
            } else if (search === 'revenue') {
                return `Revenue per share for trailing 12 months is ${response.data.revenuePerShare}`;
            } else if (search === 'news') {
                return moment(response.data[0].datetime).format('DD.MM.YYYY') + ' : ' +
                    response.data[0].headline + '\n' +
                    response.data[0].summary;
            }

        })
        .catch(function (error) {
            if (error.response.data !== undefined) {
                if (error.response.data === 'Unknown symbol') {
                    return 'Unknown symbol :(';
                } else {
                    return errorMsg;
                }
            } else {
                return errorMsg + ' ' + error;
            }

        });
}

function stockParser(input) {
    input = input.replace('?', '');
    if (input.startsWith('quote')) {
        return stockFetch('quote', input.split(' ')[2]);
    } else if (input.startsWith('has')) {
        return stockFetch('up', input.split(' ')[1]);
    } else if (input.startsWith('who')) {
        return stockFetch('ceo', input.split(' ')[4]);
    } else if (input.indexOf('revenue') > -1) {
        return stockFetch('revenue', input.split(' ')[3]);
    } else if (input.indexOf('news') > -1) {
        return stockFetch('news', input.split(' ')[3]);
    }
    return errorMsg;
}


module.exports = {
    stockParser
}