const { SlashCommandBuilder } = require('discord.js');
const sqlite3 = require('sqlite3').verbose();

//* Connect to USER DB
const db = new sqlite3.Database('./userdata.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message);
});

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

//* UPDATE extraPoints
async function updateAfterExtraPoints(extraPoints, id){
    let sql = 'UPDATE users SET extraPoints = ? WHERE id = ?';
    let newExtraPoints = (await extraPoints);
    newExtraPoints = newExtraPoints - 1;
    db.run(sql, [newReveal, id], (err) =>{
        if (err) return console.error(err.message);
    });
}

//* query checkExtraPoints
function queryCheckExtraPoints(id){
    return new Promise((resolve,reject) => {
        let sql
        sql = ' SELECT checkExtraPoints FROM users WHERE id = ?';
        db.all(sql, [id], (err,rows)   => {
            if (err) {
                console.error(err.message);
                reject(err);
            }
                resolve(rows[0].reveals);
        });
    });
}

//* UPDATE checkExtraPoints
async function updateAfterCheckExtraPoints(checkExtraPoints, id){
    let sql = 'UPDATE users SET checkExtraPoints = ? WHERE id = ?';
    let newCheckExtraPoints = (await checkExtraPoints);
    newCheckExtraPoints = newCheckExtraPoints + 1;
    db.run(sql, [newReveal, id], (err) =>{
        if (err) return console.error(err.message);
    });
}

// implement /extra_points
module.exports = {
    data: new SlashCommandBuilder()
        .setName('extra_points')
        .setDescription('Get 100 extra points in your next  game.'),
    async execute(interaction) {
        if((await queryExtraPoints(interaction.user.id)) > 0){
            updateAfterExtraPoints(queryExtraPoints(interaction.user.id),interaction.user.id);
            updateAfterCheckExtraPoints(queryCheckExtraPoints(interaction.user.id),interaction.user.id);
        }
        else{
            await interaction.reply('You do not have the double points feature.');
        }
    },
};