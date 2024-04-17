const { SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');
const { OpenAI } = require('openai');
const { apiKey } = require('../../config.json');


async function getRandom5LetterWordFromChatgpt() {

    const openai = new OpenAI({
        apiKey: apiKey,
    });

    try {
        const chatCompletion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ 'role': 'user', 'content': 'Give me a random word that is exactly 5 letters long.' }],
        });
        console.log(chatCompletion.choices[0].message);

        // Extract the word from the response
        const randomWord = chatCompletion.choices[0].message.content;
        // console.log("Generated word:", randomWord);
        return randomWord.trim().toUpperCase();
    }
    catch (error) {
        console.error('Error generating word:', error);
    }

}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('startwordle')
        .setDescription('starts a game of wordle~'),
    async execute(interaction) {
        const dictionary = fs.readFileSync('dictionary.txt', 'utf-8').split('\n').filter(word => word.length === 5).map(word => word.toLowerCase());
        await interaction.reply(`Hi, ${interaction.user}. Starting a game of Wordle (15 minute time limit).`);
        const randomWord = dictionary[Math.floor(Math.random() * dictionary.length)];
        // const randomWord = await getRandom5LetterWordFromChatgpt();
        let numGuesses = 6;
        await interaction.followUp(randomWord);
        const collectorFilter = message => message.content.length == 5 && interaction.user == message.author;
        const collector = interaction.channel.createMessageCollector({ filter: collectorFilter, time: 90000 });
        const responseHistory = [];
        const guessHistory = [];

        collector.on('collect', async (guess) => {
            const guessContents = guess.content.toLowerCase();
            if (!dictionary.includes(guessContents)) {
                interaction.followUp('invalid guess, try again: ');
            }
            else if (guessHistory.includes(guessContents)) {
                interaction.followUp('repeat guess, try again: ');
            }
            else {
                numGuesses--;
                interaction.followUp(`your guess is ${guess.content}.`);
                // now handle the guesses
                const squareArray = [];
                for (let i = 0; i < guessContents.length; i++) {
                    if (guessContents[i] === randomWord[i]) {
                        squareArray.push(':green_square:');
                    }
                    else if (randomWord.includes(guessContents[i])) {
                        squareArray.push(':yellow_square:');
                    }
                    // need to handle edge case for dupes (use count of letters)
                    else {
                        squareArray.push(':black_large_square:');
                    }
                }
                let letter_square_combo = '';
                letter_square_combo += (guessContents[0]);
                for (let i = 1; i < guessContents.length; i++) {
                    letter_square_combo += ('     ' + guessContents[i]);
                }
                letter_square_combo += '\n';
                for (let i = 0; i < squareArray.length; i++) {
                    letter_square_combo += squareArray[i];
                }
                guessHistory.push(guessContents);
                responseHistory.push(letter_square_combo);
                let response = '';
                for (let i = 0; i < responseHistory.length; i++) {
                    response += responseHistory[i];
                    response += '\n';
                }
                await interaction.followUp(response);
                if (guessContents == randomWord) {
                    interaction.followUp('you win');
                    collector.stop();
                }
                else if (numGuesses == 0) {
                    interaction.followUp(`you lose. the word was ${randomWord}`);
                    collector.stop();
                }
            }
        });
        // handle "time-out" situations -- if no time left, then they automatically lose
        collector.on('end', collected => {
            // store information about whether the person won or not, points awarded, etc.
            console.log(`Collected ${collected.size} items`);
        });
    },
};