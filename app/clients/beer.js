import axios from 'axios';
import WtoN from 'words-to-num';
import _ from 'lodash';
import moment from 'moment';

const errorMsg = 'Could not get the beer information. Not sure what to do :(';
// beers: 
// give me a random beer
// give me a random beer with hop <GOLDINGS>
// give me a random beer with malt <EXTRA PALE>
// give me a random beer that goes with <FISH>
// give me a list of beers with yeast <WYEAST 1056>
function beerFetch(search, sparam) {
    let url = 'https://api.punkapi.com/v2/beers';

    if (search === 'random') {
        url += '/random';
    } else if (search === 'hop') {
        url += '?hops=' + encodeURI(sparam);
    } else if (search === 'malt') {
        url += '?malt=' + encodeURI(sparam);
    } else if (search === 'food') {
        url += '?food=' + encodeURI(sparam);
    } else if (search === 'yeast') {
        url += '?yeast=' + encodeURI(sparam);
    }
    return axios
        .get(url, {})
        .then(function (response) {
            if (search === 'random') {
                return recipeParser(response.data);
            } else if (search === 'hop' || search === 'malt' || search === 'food') {
                return recipeParser(response.data[Math.floor(Math.random() * response.data.length) + 0]);
            } else if (search === 'yeast') {
                return nameParser(response.data);
            }
        })
        .catch(function (error) {
            return errorMsg + ' ' + error;
        });
}

function beerParser(input) {
    input = input.replace('?', '');
    if (input.indexOf('random') > -1 && input.indexOf('hop') == -1) {
        return beerFetch('random');
    } else if (input.indexOf('random') > -1 && input.indexOf('hop') > -1) {
        return beerFetch('hop', input.substring(input.indexOf('hop') + 4));
    } else if (input.indexOf('random') > -1 && input.indexOf('malt') > -1) {
        return beerFetch('malt', input.substring(input.indexOf('malt') + 5));
    } else if (input.indexOf('goes') > -1) {
        return beerFetch('food', input.substring(input.indexOf('with') + 5));
    } else if (input.indexOf('list') > -1 && input.indexOf('random') == -1) {
        return beerFetch('yeast', input.substring(input.indexOf('yeast') + 6));
    }
    return errorMsg;
}

function nameParser(beers) {
    let resp = '';
    for (let beer of beers) {
        resp += `${beer.name} \n`;
    }
    return resp;
}

function recipeParser(beers) {
    let resp = '';
    for (let beer of beers) {
        resp += beer.name + ' - ' + beer.tagline + '\n';
        resp += `Boil volume ${beer.boil_volume.value} ${beer.boil_volume.unit}\n`;
        resp += `Volume ${beer.volume.value} ${beer.volume.unit}\n`;

        for (let mashtemp of beer.method.mash_temp) {
            resp += `Mash temperature ${mashtemp.temp.value} ${mashtemp.temp.unit} for ${mashtemp.duration}\n`;
        }

        resp += `Fermentation temperature is ${beer.method.fermentation.temp.value} ${beer.method.fermentation.temp.unit}\n`;

        resp += 'Malts: \n';
        for (let ing of beer.ingredients.malt) {
            resp += `  ${ing.name} ${ing.amount.value} ${ing.amount.unit}\n`;
        }
        resp += 'Hops: \n';
        for (let ing of beer.ingredients.hops) {
            resp += `  ${ing.name} ${ing.amount.value} ${ing.amount.unit} with attribute ${ing.attribute} => ${ing.add} \n`;
        }

        resp += `Yeast to be used:  ${beer.ingredients.yeast}\n`;
        resp += `Tips: \n ${beer.brewers_tips} \n`;
    }




    return resp;
}


module.exports = {
    beerParser
}