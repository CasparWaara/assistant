import readline from 'readline';
import parser from './app/parser';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'HAL9000: '
});


rl.prompt();

rl
    .on('line', line => {
        parser.virtual_assistant(line.trim().toLowerCase()).then((result) => {
            console.log(result);
            rl.prompt();
        }).catch((error) => {
            console.log('What???', error);
            rl.prompt();
        })
    })
    .on('close', () => {
        console.log('Have a great day!');
        process.exit(0);
    });