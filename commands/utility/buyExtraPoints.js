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
async function updatePointsAfterExtraPoints(points, id){
    let sql = 'UPDATE users SET points = ? WHERE id = ?';
    let newTotal = (await points) - 75;
    db.run(sql, [newTotal, id], (err) =>{
        if (err) return console.error(err.message);
    });
}

//* UPDATE extraPoints
async function updateExtraPoints(extraPoints, id){
    let sql = 'UPDATE users SET extraPoints = ? WHERE id = ?';
    let newDoublePoints = (await extraPoints) + 1;
    db.run(sql, [newDoublePoints, id], (err) =>{
        if (err) return console.error(err.message);
    });
}

//* query extraPoints
function queryExtraPoints(id){
    return new Promise((resolve,reject) => {
        let sql
        sql = ' SELECT extraPoints FROM users WHERE id = ?';
        db.all(sql, [id], (err,rows)   => {
            if (err) {
                console.error(err.message);
                reject(err);
            }
                resolve(rows[0].reveals);
        });
    });
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('buy_extra_points')
        .setDescription('Purchase 100 extra points for a game.'), 
    async execute(interaction) {
        if((await queryPoints(interaction.user.id)) < 75){
            await interaction.reply('Sorry you do not have enough points to buy double points.');
        }else{
            // they have purchases extra 100 points
            updateExtraPoints(queryExtraPoints(interaction.user.id),interaction.user.id);
            updatePointsAfterExtraPoints(queryPoints(interaction.user.id), interaction.user.id);
            await interaction.reply('Congrats, you now have double points for a game of your choice.');
        }

    },
};