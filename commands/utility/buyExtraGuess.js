const { SlashCommandBuilder } = require('discord.js');
const sqlite3 = require('sqlite3').verbose();
let numGuesses = require('./startwordle.js');

//* Connect to USER DB
const db = new sqlite3.Database('./userdata.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message);
});

//* query points
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
//* UPDATE points
async function updatePointsAfterGuess(points, id){
    let sql = 'UPDATE users SET points = ? WHERE id = ?';
    let newTotal = (await points) - 100;
    db.run(sql, [newTotal, id], (err) =>{
        if (err) return console.error(err.message);
    });
}
//* UPDATE guess
async function updateGuess(guesses, id){
    let sql = 'UPDATE users SET guesses = ? WHERE id = ?';
    let newGuesses = (await guesses) + 1;
    db.run(sql, [newGuesses, id], (err) =>{
        if (err) return console.error(err.message);
    });
}
//* query guesses
function queryGuess(id){
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
module.exports = {
    data: new SlashCommandBuilder()
        .setName('buy_extra_guess')
        .setDescription('Purchase an extra guess for game.'),
    async execute(interaction) {
        if((await queryPoints(interaction.user.id)) < 100){
            await interaction.reply('Sorry you do not have enough points to buy a guess');
        }else{
            updateGuess(queryGuess(interaction.user.id),interaction.user.id);
            updatePointsAfterGuess(queryPoints(interaction.user.id), interaction.user.id);
            //* fix this to increment guesses
            numGuesses++;
            await interaction.reply('Congrats, you now have an extra guess for a game of your choice.');
        }
    },
};