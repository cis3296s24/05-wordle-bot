const { SlashCommandBuilder } = require('discord.js');
const sqlite3 = require('sqlite3').verbose();

//* Connect to USER DB
const db = new sqlite3.Database('./userdata.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message);
});
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
//* UPDATE guess
async function updateAfterGuess(guesses, id){
    let sql = 'UPDATE users SET guesses = ? WHERE id = ?';
    let newGuesses = (await guesses) - 1;
    db.run(sql, [newGuesses, id], (err) =>{
        if (err) return console.error(err.message);
    });
}
module.exports = {
    data: new SlashCommandBuilder()
        .setName('extra_guess')
        .setDescription('Use an extra guess for your next game.'),
    async execute(interaction) {
        if((await queryGuess(interaction.user.id)) > 0){
            updateAfterGuess(queryGuess(interaction.user.id),interaction.user.id);
            await interaction.reply('Using an extra guess for your next game.');
        }
        else{
            await interaction.reply('You do not have any guesses.');
        }
    },
};