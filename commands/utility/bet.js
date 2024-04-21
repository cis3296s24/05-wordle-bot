const { SlashCommandBuilder } = require('discord.js');
const sqlite3 = require('sqlite3').verbose();

//* Connect to USER DB
const db = new sqlite3.Database('./userdata.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message);
});
let wageredAmount;
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

async function updateBetting(betting, id){
    let sql = 'UPDATE users SET betting = ? WHERE id = ?';
    db.run(sql, [betting, id], (err) =>{
        if (err) return console.error(err.message);
    });
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bet')
        .setDescription('Allows users to wager points on the game.'),
    async execute(interaction) {
        await interaction.reply(`Hi, ${interaction.user}. Wager points. Beware: you may double your points or lose what you wagered. Answer with "yes" or "no" '`);
   
        console.log(interaction.user.id);
        const collectorFilter = message => message.content.length < 4 && interaction.user == message.author;
        const collector = interaction.channel.createMessageCollector({ filter: collectorFilter, time: 90000 });

        collector.on('collect', async (betValue) => {
            betAns = (betValue.content);
            interaction.followUp(`your bet is ${betAns}.`);
            console.log(betAns);
            updateBetting(betAns, interaction.user.id);
            collector.stop();
        });

        collector.on('end', collected => {
            // store information about whether the person won or not, points awarded, etc.
            console.log(`Collected ${collected.size} items`);
        });
    },
};