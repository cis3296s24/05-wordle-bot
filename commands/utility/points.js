const { SlashCommandBuilder } = require('discord.js');
const sqlite3 = require('sqlite3').verbose();

// const { db } = require('./startwordle.js'); 

//* Connect to DB
const db = new sqlite3.Database('./userdata.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message);
});

// query users points
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

// implement /points
module.exports = {
    data: new SlashCommandBuilder()
        .setName('points')
        .setDescription('Display the current points of the user'),
    async execute(interaction) {
        await interaction.reply('You currently have ' + await queryPoints(interaction.user.id) +' points');
    },
};