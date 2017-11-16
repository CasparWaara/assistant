import axios from 'axios';
import WtoN from 'words-to-num';
import _ from 'lodash';
import moment from 'moment';

const errorMsg = 'Could not get the patent information. Not sure what to do :(';
// patents: 
// how many patents does inventor <Jobs, Steve> have
// how many patents does applicant <Jobs, Steve> have
// give me a patent with number <US9748552>
// how many patents can you find with <IPHONE>
// how many patents does <APPLE> have
function patentFetch(search, sparam) {
    let url = 'https://developer.uspto.gov/ibd-api/v1/patent/application';

    if (search === 'inventor') {
        url += '?inventor=' + encodeURI('"' + sparam + '"') + '&start=0&rows=10';
    } else if (search === 'patent') {
        url += '?applicationNumber=' + encodeURI(sparam) + '&start=0&rows=10';
    } else if (search === 'applicant') {
        url += '?applicant=' + encodeURI('"' + sparam + '"') + '&start=0&rows=10';
    } else if (search === 'find') {
        url += '?searchText=' + encodeURI(sparam) + '&start=0&rows=10';
    } else if (search === 'assignee') {
        url += '?assignee=' + encodeURI(sparam) + '&start=0&rows=10';
    }
    return axios
        .get(url, {})
        .then(function (response) {
            if (search === 'inventor') {
                return `Inventor ${sparam} has ${response.data.response.numFound} patents`;
            } else if (search === 'patent') {
                if (response.data.response.numFound > 0) {
                    const pat = response.data.response.docs[0];
                    return `${pat.title}`;
                } else {
                    return 'No patent with number ' + sparam;
                }
            } else if (search === 'applicant') {
                return `Applicant ${sparam} has ${response.data.response.numFound} patents`;
            } else if (search === 'find') {
                return `I could find ${response.data.response.numFound} patents with text ${sparam}`;
            } else if (search === 'assignee') {
                return `${sparam} has ${response.data.response.numFound} patents`;
            }
        })
        .catch(function (error) {
            return errorMsg + ' ' + error;
        });
}

function patentParser(input) {
    input = input.replace('?', '');
    if (input.indexOf('inventor') > -1) {
        return patentFetch('inventor', input.substring(input.indexOf('inventor') + 8).replace(' have', ''));
    } else if (input.indexOf('give') > -1 && input.indexOf('number') > -1) {
        return patentFetch('patent', input.substring(input.indexOf('number') + 7));
    } else if (input.indexOf('applicant') > -1) {
        return patentFetch('applicant', input.substring(input.indexOf('applicant') + 10).replace(' have', ''));
    } else if (input.indexOf('find') > -1) {
        return patentFetch('find', input.substring(input.indexOf('with') + 5));
    } else if (input.indexOf('patents does') > -1 && input.indexOf('inventor') === -1 && input.indexOf('applicant') === -1) {
        return patentFetch('assignee', input.substring(input.indexOf('does') + 5).replace(' have', ''));
    }
    return errorMsg;
}


module.exports = {
    patentParser
}