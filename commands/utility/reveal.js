const { SlashCommandBuilder } = require('discord.js');
const sqlite3 = require('sqlite3').verbose();
let randomWord = require('./startwordle.js');

//* Connect to USER DB
const db = new sqlite3.Database('./userdata.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message);
});

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
//* UPDATE reveal
async function updateAfterReveal(reveal, id){
    let sql = 'UPDATE users SET reveals = ? WHERE id = ?';
    let newReveal = await reveal;
    newReveal = newReveal - 1;
    db.run(sql, [newReveal, id], (err) =>{
        if (err) return console.error(err.message);
    });
}
function queryLastWord(id){
    return new Promise((resolve,reject) => {
        let sql
        sql = ' SELECT last_word FROM users WHERE id = ?';
        db.all(sql, [id], (err,rows)   => {
            if (err) {
                console.error(err.message);
                reject(err);
            }
                resolve(rows[0].last_word);
        });
    });
}
module.exports = {
    data: new SlashCommandBuilder()
        .setName('reveal')
        .setDescription('Reveal the first letter of the word in your next  game.'),
    async execute(interaction) {
        if((await queryReveal(interaction.user.id)) > 0){
            updateAfterReveal(queryReveal(interaction.user.id),interaction.user.id);
            let wordOfDay = (await queryLastWord(1));
            const squareArray = [];
            squareArray.push(':green_square:');
            for (let i=0; i<4; i++){
                squareArray.push(':black_large_square:');
            }
            await interaction.reply('Revealing the first letter of the word in your next game:\n ' + (wordOfDay[0])+'\n' + squareArray.join(""));
        }
        else{
            await interaction.reply('You do not have a reveal.');
        }
    },
};