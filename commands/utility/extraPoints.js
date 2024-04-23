const { SlashCommandBuilder } = require('discord.js');
const sqlite3 = require('sqlite3').verbose();

//* Connect to USER DB
const db = new sqlite3.Database('./userdata.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err.message);
    }
});

//* query extraPoints
function queryExtraPoints(id){
    return new Promise((resolve,reject) => {
        let sql = 'SELECT extraPoints FROM users WHERE id = ?';
        db.get(sql, [id], (err,row)   => {
            if (err) {
                console.error(err.message);
                reject(err);
            } else {
                resolve(row ? row.extraPoints : 0);
            }
        });
    });
}

//* UPDATE extraPoints
async function updateAfterExtraPoints(extraPoints, id){
    let sql = 'UPDATE users SET extraPoints = ? WHERE id = ?';
    let newExtraPoints = await extraPoints - 1;
    db.run(sql, [newExtraPoints, id], (err) =>{
        if (err) {
            console.error(err.message);
        }
    });
}

//* query checkExtraPoints
function queryCheckExtraPoints(id){
    return new Promise((resolve,reject) => {
        let sql = 'SELECT checkExtraPoints FROM users WHERE id = ?';
        db.get(sql, [id], (err,row)   => {
            if (err) {
                console.error(err.message);
                reject(err);
            } else {
                resolve(row ? row.checkExtraPoints : 0);
            }
        });
    });
}

//* UPDATE checkExtraPoints
async function updateAfterCheckExtraPoints(checkExtraPoints, id){
    let sql = 'UPDATE users SET checkExtraPoints = ? WHERE id = ?';
    let newCheckExtraPoints = await checkExtraPoints + 1;
    db.run(sql, [newCheckExtraPoints, id], (err) =>{
        if (err) {
            console.error(err.message);
        }
    });
}

// implement /extra_points
module.exports = {
    data: new SlashCommandBuilder()
        .setName('extra_points')
        .setDescription('Get 100 extra points in your next  game.'),
    async execute(interaction) {
        try {
            const extraPoints = await queryExtraPoints(interaction.user.id);
            if(extraPoints > 0){
                await updateAfterExtraPoints(extraPoints, interaction.user.id);
                const checkExtraPoints = await queryCheckExtraPoints(interaction.user.id);
                await updateAfterCheckExtraPoints(checkExtraPoints, interaction.user.id);
                await interaction.reply('You have redeemed 100 extra points for your next game.');
            } else {
                await interaction.reply('You do not have the extra 100 points feature.');
            }
        } catch (error) {
            console.error(error.message);
            await interaction.reply('An error occurred while processing your request.');
        }
    },
};