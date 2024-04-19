const { SlashCommandBuilder } = require('discord.js');
const { execute } = require('../../events/ready');
const sqlite3 = require('sqlite3');


// Connect to DB
const db = new sqlite3.Database('./userdata.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message);
});

function queryGuesses(){
    return new Promise((resolve,reject) => {
        let sql
        sql = ' SELECT extraGuesses FROM users';
        db.all(sql, [id], (err,rows)   => {
            if (err) {
                console.error(err.message);
                reject(err);
            }
                resolve(rows[0].points);
        });
    });
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('buy_extra_guess')
        .setDescription('Purchase an extra guess for game.'), 
    async execute(interaction) {
        const userId = interaction.user.id;
        const extraGuesses = await queryGuesses(userId);
        await interaction.reply('Congrats, you bought an extra guess for a game of your choice. \nYou now have  ${extraGuesses} guesses.');
    },
};