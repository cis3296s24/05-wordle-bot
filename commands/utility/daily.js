const { SlashCommandBuilder } = require('discord.js');
const sqlite3 = require('sqlite3').verbose();
const ADMIN = 1;

//* Connect to USER DB
const db = new sqlite3.Database('./userdata.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message);
});

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
module.exports = {
    data: new SlashCommandBuilder()
        .setName('daily')
        .setDescription('See the amount of points available for the day.'),
    async execute(interaction) {
        await interaction.reply('The amount of points available today is ' + (await queryPoints(ADMIN)) + ' points.');
    },
};