const { SlashCommandBuilder } = require('discord.js');

const sqlite3 = require('sqlite3').verbose();

//* Connect to DB
const db = new sqlite3.Database('./userdata.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message);
});

function queryWinStreak(){
    return new Promise((resolve,reject) => {
        let sql
        sql = ' SELECT MAX(win_streak) AS max_win_streak FROM users';
        db.all(sql, [], (err,rows)   => {
            if (err) {
                console.error(err.message);
                reject(err);
            }
                resolve(rows[0].max_win_streak);
        });
    });
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('streak')
        .setDescription('Displays the highest win streak in the server and the user holding it.'),
    async execute(interaction) {
        console.log( Math.floor(await queryWinStreak()));
        await interaction.reply('The highest win streak is '+ await queryWinStreak());
    },
};