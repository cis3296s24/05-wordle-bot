const { SlashCommandBuilder } = require('discord.js');
const sqlite3 = require('sqlite3').verbose();

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
    let newReveal = await win;
    newReveal = newReveal - 1;
    db.run(sql, [newReveal, id], (err) =>{
        if (err) return console.error(err.message);
    });
}
module.exports = {
    data: new SlashCommandBuilder()
        .setName('reveal')
        .setDescription('Reveal the first letter of the word in your next  game.'),
    async execute(interaction) {
        if((await queryReveal(interaction.user.id)) > 0){
            updateAfterReveal(queryReveal(interaction.user.id),interaction.user.id);
            await interaction.reply('Revealing the first letter of the word in your next game.');
        }
        else{
            await interaction.reply('You do not have a reveal.');
        }
    },
};