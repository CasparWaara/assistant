import axios from 'axios';
import WtoN from 'words-to-num';
import _ from 'lodash';
import moment from 'moment';

const errorMsg = 'Could not get the currency information. Not sure what to do :(';
// money:
// how many <EUR> can I get with <100> <USD>
// which is more valuable, <EUR> or <USD>
// what is <EUR> rate
// which was more valuable, <EUR> or <USD> in <2017-01-01>
// has <USD> risen or fallen?
async function currencyFetch(from, to, date = '', question = '', amount) {
    let url = 'https://api.fixer.io';
    let symbols = '';
    let base = '';
    from = from.toUpperCase();
    to = to.toUpperCase();
    if (date === '') {
        url += '/latest'
    } else {
        if (moment(date).isValid()) {
            url += '/' + moment(date).format('YYYY-MM-DD');
        } else {
            return errorMsg;
        }
    }

    if (question === 'convert') {
        symbols = from;
        base = to;
    } else if (question === 'valuable' || question === 'hisval') {
        symbols = from + ',' + to;
        base = 'EUR';
    } else if (question === 'rate') {
        if (from === 'EUR') {
            return '1 EUR is 1 EUR';
        }
        symbols = from;
        base = 'EUR';
    } else if (question === 'fallen') {
        if (from === 'EUR') {
            return 'We just compare to EUR value...so...that is a bit silly question';
        }
        symbols = from;
        base = 'EUR';
    }
    return axios
        .get(url, {
            params: {
                symbols: symbols,
                base: base
            }
        })
        .then(function (response) {
            if (question === 'convert') {
                const respValue = _.get(response.data, 'rates.' + from);
                if (!isNaN(respValue)) {
                    return `You get ${(respValue * amount)} ${from}'s`;
                } else {
                    return errorMsg;
                }
            } else if (question === 'valuable' || question === 'hisval') {
                const add = (question == 'hisval' ? ' was ' : ' is ');
                let a = 1;
                let b = 1;
                if (base !== from) {
                    a = _.get(response.data, 'rates.' + from);
                }
                if (base !== to) {
                    b = _.get(response.data, 'rates.' + to);
                }
                if (!isNaN(a) && (!isNaN(b))) {
                    if (a > b) {
                        return `${to} ${add} more valuable`;
                    } else {
                        return `${from} ${add} more valuable`;
                    }
                } else {
                    return errorMsg;
                }
            } else if (question === 'rate') {
                const respValue = _.get(response.data, 'rates.' + from);
                return `1 ${base} is ${respValue} ${from}`;
            } else if (question === 'fallen') {
                const a = _.get(response.data, 'rates.' + from);
                return yesterday(a, from);
            }
        })
        .catch(function (error) {
            return errorMsg + ' ' + error;
        });
}

function moneyParser(input) {
    if (input.startsWith('how many')) {
        const from = input.split(' ')[2];
        const to = input.split(' ')[8];
        const value = isNumber(input.split(' ')[7]);
        if (value !== NaN) {
            return currencyFetch(from, to, '', 'convert', value);
        } else {
            return errorMsg;
        }
    } else if (input.startsWith('which is more valuable')) {
        const from = input.split(' ')[4];
        const to = input.split(' ')[6];
        return currencyFetch(from, to, '', 'valuable');
    } else if (input.startsWith('which was')) {
        const from = input.split(' ')[4];
        const to = input.split(' ')[6];
        const date = input.split(' ')[8];
        return currencyFetch(from, to, date, 'hisval');
    } else if (input.startsWith('has')) {
        const from = input.split(' ')[1];
        return currencyFetch(from, '', '', 'fallen');
    }
    return errorMsg;
}

async function yesterday(a, from) {
    let url = 'https://api.fixer.io/' + moment().subtract(1, 'days').format('YYYY-MM-DD');
    return axios
        .get(url, {
            params: {
                symbols: from,
                base: 'EUR'
            }
        })
        .then(function (response) {
            const b = _.get(response.data, 'rates.' + from);
            if (a > b) {
                return 'Risen';
            } else if (a === b) {
                return 'Same';
            } else {
                return 'Fallen';
            }

        })
        .catch(function (error) {
            return errorMsg + ' ' + error;
        });
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


module.exports = {
    moneyParser
}