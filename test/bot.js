const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('node:fs');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
client.login(process.env.DISCORD_BOT_TOKEN);

client.once('ready', () => console.log(client.user.tag+' 준비 완료!'));
const dictionary = fs.readFileSync('dictionary.txt', 'utf-8').split('\n').filter(word => word.length === 5).map(word => word.toLowerCase());
let gameActive = false;
let randomWord = '';
let numGuesses = 0;

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async message => {
    if (!message.guild || message.author.bot) return;

    if (message.content === '!startwordle') {
        if (gameActive) {
            message.channel.send('A game is already in progress!');
            return;
        }
        gameActive = true;
        numGuesses = 6;
        randomWord = dictionary[Math.floor(Math.random() * dictionary.length)];
        message.channel.send('Wordle game started! You have 6 guesses to find the right 5-letter word.');
    } else if (gameActive && message.content.match(/^[a-zA-Z]{5}$/)) {
        let guess = message.content.toLowerCase();
        if (!dictionary.includes(guess)) {
            message.channel.send('Word not found in dictionary, please try again.');
            return;
        }
        numGuesses--;
        let response = '';
        for (let i = 0; i < guess.length; i++) {
            if (guess[i] === randomWord[i]) {
                response += ':green_square:';
            } else if (randomWord.includes(guess[i])) {
                response += ':yellow_square:';
            } else {
                response += ':black_large_square:';
            }
        }
        message.channel.send(`${response} (${numGuesses} guesses left)`);

        if (guess === randomWord) {
            message.channel.send(`Congratulations, you've guessed the word correctly: ${randomWord}`);
            gameActive = false;
        } else if (numGuesses <= 0) {
            message.channel.send(`Game over! The correct word was: ${randomWord}`);
            gameActive = false;
        }
    }
});

