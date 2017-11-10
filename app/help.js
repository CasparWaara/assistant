function help() {
    let help = '';
    help += 'Weather information: \n';
    help += '  what\'s the weather in <oulu, finland> \n';
    help += '  <five> day forecast for <oulu, finland> \n';
    help += '  when will sunset at <oulu, finland> \n';
    help += '  when will sunrise at <oulu, finland> \n';
    help += '  will it rain tomorrow in <oulu, finland> \n';

    return help;
}

module.exports = {
    help
};