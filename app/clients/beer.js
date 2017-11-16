import axios from 'axios';
import WtoN from 'words-to-num';
import _ from 'lodash';
import moment from 'moment';

const errorMsg = 'Could not get the beer information. Not sure what to do :(';
// beers: 
// give me random beer
// has <AAPL> gone up?
// who is ceo of <AAPL>
// how much revenue <AAPL> made
// any news on <AAPL>
function beerFetch(search, sparam) {
    let url = 'https://api.punkapi.com/v2/beers/';

    if (search === 'random') {
        url += 'random';
    }
    return axios
        .get(url, {

        })
        .then(function (response) {
            if (search === 'random') {
                return recipeParser(response.data);
            }

        })
        .catch(function (error) {
            if (error.data !== undefined) {
                if (error.data === 'Unknown symbol') {
                    return 'Unknown symbol :(';
                }
            } else {
                return errorMsg + ' ' + error;
            }

        });
}

function beerParser(input) {

    if (input.indexOf('random') > -1) {
        return beerFetch('random', input.split(' ')[3]);
    }
    return errorMsg;
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
            resp += `  ${ing.name} ${ing.amount.value} ${ing.amount.unit} => ${ing.add} \n`;
        }

        resp += `Yeast to be used:  ${beer.ingredients.yeast}\n`;
        resp += `Tips: \n ${beer.brewers_tips} \n`;
    }




    return resp;
}


module.exports = {
    beerParser
}