const { SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');
const { OpenAI } = require('openai');
const { apiKey } = require('../../config.json');
const sqlite3 = require('sqlite3').verbose();

//* Connect to USER DB
const db = new sqlite3.Database('./userdata.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message);
});

//* Connect to DAILY DB
const daily_db = new sqlite3.Database('./dailydata.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message);
});

//* Define the table schemas
db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY, username VARCHAR, wins INTEGER, losses INTEGER, points INTEGER, leader_score INTEGER, win_streak INTEGER, last_word VARCHAR, win_rate DECIMAL, guesses INTEGER, items INTEGER, useExtra INTEGER, useReveal INTEGER)');
});
daily_db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS dailyWordle(id INTEGER PRIMARY KEY, word_of_the_day VARCHAR, avail_points INTEGER');
});
///* working on this func
function setDailyPoints(){
    return Math.floor(Math.random() * 100);
}

//* Insert data into database
function insertUser(id, username, wins, losses, points, score, streak, lastWord, winRate, guesses, items) {
    let sql = 'INSERT INTO users(id, username, wins, losses, points, leader_score, win_streak, last_word, win_rate, guesses, reveals, items, useGuesses, useReveals) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    db.run(sql, [id, username, wins, losses, points, score, streak, lastWord, winRate, guesses, reveals, items, useGuess, useReveal], (err) => {
        if (err) return console.error(err.message);
    });
}

//* Updates the users win rate
async function updateWinRate(wins, losses, id){
    let sql = 'UPDATE users SET win_rate = ? WHERE id = ?';
    let aWin = await wins;
    let aLoss = await losses;
    let newWinRate = (aWin/(aWin+aLoss)) * 100;

    db.run(sql, [newWinRate, id], (err) =>{
        if (err) return console.error(err.message);
    });
}

//* UPDATE WINS
async function updateWin(win, id){
    let sql = 'UPDATE users SET wins = ? WHERE id = ?';
    let newWin = await win;
    newWin = newWin + 1;
    db.run(sql, [newWin, id], (err) =>{
        if (err) return console.error(err.message);
    });
}
//* UPDATE LOSSES
async function updateLoss(losses, id){
    let sql = 'UPDATE users SET losses = ? WHERE id = ?';
    let newLoss = await losses;
    newLoss = newLoss + 1;
    db.run(sql, [newLoss, id], (err) =>{
        if (err) return console.error(err.message);
    });
}
// * update user's streak
async function updateStreak(streak, id, outcome){
    let sql = 'UPDATE users SET win_streak = ? WHERE id = ?';
    let newStreak = await streak;
    if(outcome){
        newStreak = newStreak + 1;
    }
    else{
        newStreak = 0;
    }
    db.run(sql, [newStreak, id], (err) =>{
        if (err) return console.error(err.message);
    });
}
//* UPDATE points
async function updatePoints(points, id){
    let sql = 'UPDATE users SET points = ? WHERE id = ?';
    let newTotal = (await points) + Math.floor(Math.random() * 100);
    db.run(sql, [newTotal, id], (err) =>{
        if (err) return console.error(err.message);
    });
}
//* UPDATE last word
async function updateLastWords(lastWord, id){
    let sql = 'UPDATE users SET last_word = ? WHERE id = ?';
    let newWord = await lastWord;;
    
    db.run(sql, [newWord, id], (err) =>{
        if (err) return console.error(err.message);
    });
}
//* DELETE data
function deleteUser(id){
    let sql;
    sql = 'DELETE FROM users WHERE id = ?'
    db.run(sql, [id], (err) =>{
        if (err) return console.error(err.message);
    });
}
//* Query User data
function queryData(){
    let sql;
    sql = 'SELECT * FROM users';
    db.all(sql, [], (err, rows) => {
        if (err) return console.error(err.message);
        rows.forEach((row) => {
            console.log(row);
        });
    })
}
//* query Users Wins
function queryWin(id){

    return new Promise((resolve,reject) => {
        let sql
        sql = ' SELECT wins FROM users WHERE id = ?';
        db.all(sql, [id], (err,rows)   => {
            if (err) {
                console.error(err.message);
                reject(err);
            }
                resolve(rows[0].wins);
        });
    });
}
// Query extra guesses
function queryGuesses(id){
    return new Promise((resolve,reject) => {
        let sql
        sql = ' SELECT guesses FROM users WHERE id = ?';
        db.all(sql, [id], (err,rows)   => {
            if (err) {
                console.error(err.message);
                reject(err);
            }
                resolve(rows[0].guesses);
        });
    });
}
// Query reveals
function queryReveals(id){

    return new Promise((resolve,reject) => {
        let sql
        sql = ' SELECT reveals FROM users WHERE id = ?';
        db.all(sql, [id], (err,rows)   => {
            if (err) {
                console.error(err.message);
                reject(err);
            }
                resolve(rows[0].guesses);
        });
    });
}

// Query Items
function queryItems(id){
    return new Promise((resolve,reject) => {
        let sql
        sql = ' SELECT items FROM users WHERE id = ?';
        db.all(sql, [id], (err,rows)   => {
            if (err) {
                console.error(err.message);
                reject(err);
            }
                resolve(rows[0].items);
        });
    });
}
// Query Points
function queryPoints(id){
    return new Promise((resolve,reject) => {
        let sql
        sql = ' SELECT points FROM users WHERE id = ?';
        db.all(sql, [id], (err,rows)   => {
            if (err) {
                console.error(err.message);
                reject(err);
            }
                resolve(rows[0].points);
        });
    });
}
// Query win streak
function queryWinStreak(id){
    return new Promise((resolve,reject) => {
        let sql
        sql = ' SELECT win_streak FROM users WHERE id = ?';
        db.all(sql, [id], (err,rows)   => {
            if (err) {
                console.error(err.message);
                reject(err);
            }
                resolve(rows[0].win_streak);
        });
    });
}
// Query last word
function queryLastWord(id){
    return new Promise((resolve,reject) => {
        let sql
        sql = ' SELECT last_word FROM users WHERE id = ?';
        db.all(sql, [id], (err,rows)   => {
            if (err) {
                console.error(err.message);
                reject(err);
            }
                resolve(rows[0].last_word);
        });
    });
}
//* query Users Losses
function queryLoss(id){
    return new Promise((resolve,reject) => {
        let sql
        sql = ' SELECT losses FROM users WHERE id = ?';
        db.all(sql, [id], (err,rows)   => {
            if (err) {
                console.error(err.message);
                reject(err);
            }
                resolve(rows[0].losses);
        });
    });
    
}
//* query Users Win rate
function queryWinRate(id){
    return new Promise((resolve,reject) => {
        let sql
        sql = ' SELECT win_rate FROM users WHERE id = ?';
        db.all(sql, [id], (err,rows)   => {
            if (err) {
                console.error(err.message);
                reject(err);
            }
                resolve(rows[0].win_rate);
        });
    });
    
}
//* query Users use of extra quess
function queryGuesses(id){
    return new Promise((resolve,reject) => {
        let sql
        sql = ' SELECT useGuess FROM users WHERE id = ?';
        db.all(sql, [id], (err,rows)   => {
            if (err) {
                console.error(err.message);
                reject(err);
            }
                resolve(rows[0].win_rate);
        });
    });
    
}
//* query Users use of reveal letter
function queryReveal(id){
    return new Promise((resolve,reject) => {
        let sql
        sql = ' SELECT useReveal FROM users WHERE id = ?';
        db.all(sql, [id], (err,rows)   => {
            if (err) {
                console.error(err.message);
                reject(err);
            }
                resolve(rows[0].win_rate);
        });
    });
    
}

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
        let checkGuess = await queryGuesses();
        let numGuesses = 0;
        if(checkGuess == 1) {
            numGuesses = 7;
        }
        else {
            numGuesses = 6;
        }
        await interaction.followUp(randomWord);
        //inserting user into db
        insertUser(interaction.user.id,interaction.user.username,0,0,0,0,0,null,0.0);
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
                    updateLastWords(randomWord,interaction.user.id);
                    updateWin(queryWin(interaction.user.id),interaction.user.id);
                    updateWinRate(queryWin(interaction.user.id),queryLoss(interaction.user.id),interaction.user.id);
                    updateStreak(queryWinStreak(interaction.user.id),interaction.user.id,true);
                    updatePoints(queryPoints(interaction.user.id), interaction.user.id);
                    collector.stop();
                }
                else if (numGuesses == 0) {
                    interaction.followUp(`you lose. the word was ${randomWord}`);
                    updateLoss(queryLoss(interaction.user.id),interaction.user.id);
                    updateWinRate(queryWin(interaction.user.id),queryLoss(interaction.user.id),interaction.user.id);
                    updateStreak(queryWinStreak(interaction.user.id),interaction.user.id,false);
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
