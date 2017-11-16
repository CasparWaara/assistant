function help() {
    let help = '';
    help += 'Replace <> with your value.\n\n';
    help += 'Weather information: \n';
    help += '  what\'s the weather in <oulu, finland> \n';
    help += '  <five> day forecast for <oulu, finland> \n';
    help += '  when will sunset at <oulu, finland> \n';
    help += '  when will sunrise at <oulu, finland> \n';
    help += '  will it rain tomorrow in <oulu, finland> \n';

    help += 'Currency information: \n';
    help += '  how many <EUR> can I get with <100> <USD> \n';
    help += '  which is more valuable, <EUR> or <USD> \n';
    help += '  what is <EUR> rate \n';
    help += '  which was more valuable, <EUR> or <USD> in <2017-01-01> \n';
    help += '  has <USD> risen or fallen? \n';

    help += 'Stock information: \n';
    help += '  quote for <AAPL> \n';
    help += '  has <AAPL> gone up? \n';
    help += '  who is ceo of <AAPL> \n';
    help += '  how much revenue <AAPL> made \n';
    help += '  any news on <AAPL> \n';
    return help;
}

module.exports = {
    help
};