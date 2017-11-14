function help() {
    let help = '';
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
    return help;
}

module.exports = {
    help
};