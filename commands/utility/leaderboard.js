const { SlashCommandBuilder } = require('discord.js');
const sqlite3 = require('sqlite3').verbose();

// Connect to DB
const db = new sqlite3.Database('./userdata.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message);
});
//* query Users Win rate
function queryHighestWinRate(){
    return new Promise((resolve,reject) => {
        let sql
        sql = ' SELECT MAX(win_rate) FROM users';
        db.all(sql, [], (err,rows)   => {
            if (err) {
                console.error(err.message);
                reject(err);
            }
                resolve(rows[0].win_rate);
        });
    });
    
}
async function displayHighestWinRate(data){
    let highestUser = await data;
    return highestUser;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Displays the highest win rate in the server'),
    async execute(interaction) {
        let highestWin = await queryHighestWinRate();
        await interaction.reply('The highest win rate in the server is ' + displayHighestWinRate(queryHighestWinRate()) );
    },
};