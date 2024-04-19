const { SlashCommandBuilder } = require('discord.js');

function queryReveals(){
    return new Promise((resolve,reject) => {
        let sql
        sql = ' SELECT reveals FROM users';
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
        .setName('buy_reveal')
        .setDescription('Purchase a feature to reveal the first letter in a game.'),
    async execute(interaction) {
        await interaction.reply('Congrats, you bought a reveal of the first letter of the word revealed for game of your choice.\nYou now have '+ await queryReveals() + '.');
    },
};