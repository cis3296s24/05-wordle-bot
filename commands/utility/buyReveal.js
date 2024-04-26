const { SlashCommandBuilder } = require('discord.js');
const sqlite3 = require('sqlite3').verbose();

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
async function updatePointsAfterReveal(points, id){
    let sql = 'UPDATE users SET points = ? WHERE id = ?';
    let newTotal = (await points) - 50;
    db.run(sql, [newTotal, id], (err) =>{
        if (err) return console.error(err.message);
    });
}

//* UPDATE reveal
async function updateReveal(reveals, id){
    let sql = 'UPDATE users SET reveals = ? WHERE id = ?';
    let newReveal = (await reveals) + 1;
    db.run(sql, [newReveal, id], (err) =>{
        if (err) return console.error(err.message);
    });
}

//* query reveals
function queryReveal(id){
    return new Promise((resolve,reject) => {
        let sql
        sql = ' SELECT reveals FROM users WHERE id = ?';
        db.all(sql, [id], (err,rows)   => {
            if (err) {
                console.error(err.message);
                reject(err);
            }
                resolve(rows[0].reveals);
        });
    });
}

// implement /buy_reveal
module.exports = {
    data: new SlashCommandBuilder()
        .setName('buy_reveal')
        .setDescription('Purchase a feature to reveal the first letter in a game.'),
    async execute(interaction) {

        if((await queryPoints(interaction.user.id)) < 50){
            await interaction.reply('Sorry you do not have enough points to buy a reveal.');
        }else{
            //* they have purchased a reveal
            updateReveal(queryReveal(interaction.user.id),interaction.user.id);
            updatePointsAfterReveal(queryPoints(interaction.user.id),interaction.user.id);
            await interaction.reply('Congrats, you now have the first letter of the word revealed for game of your choice.');
        }

    },
};