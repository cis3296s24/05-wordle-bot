const Discord = require('discord.js');
const sqlite3 = require('sqlite3').verbose();
//const {token}= require('config.json');
const token = "token";
// Create a new Discord client
const { Client, GatewayIntentBits } = require('discord.js')
const client = new Client({
    intents: [
        Discord.IntentsBitField.Flags.Guilds,
        Discord.IntentsBitField.Flags.GuildMembers,
        Discord.IntentsBitField.Flags.GuildMessages,
        //Discord.IntentsBitField.Flags.MessageContent,
    ]
})
// Connect to DB
const db = new sqlite3.Database('./userdata.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message);
});

// Define the table schema
db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY, username VARCHAR, wins INTEGER, losses INTEGER, points INTEGER, leader_score INTEGER, win_streak INTEGER, last_word VARCHAR, win_rate DECIMAL)');
});

// Event listener for when the bot is ready
client.on('ready', (c) => {
    console.log(`${c.user.username} is ready`);
});

// Event listener for incoming messages
client.on('messageCreate', (message) => {
    console.log('Bot is listening');

    // Check if the message is from a bot
    if (message.author.bot) return;

    // Store the data into the SQLite database
    //console.log(message);
    insertUser(message.member.id, message.member.user.username, 0, 0, 0, 0, 0, null, 0.0); // assuming initial values for wins, losses, points, score, streak
});

client.login(token);


//* Insert data into database
function insertUser(id, username, wins, losses, points, score, streak, lastWord, winRate) {
    let sql = 'INSERT INTO users(id, username, wins, losses, points, leader_score, win_streak, last_word, win_rate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    db.run(sql, [id, username, wins, losses, points, score, streak], (err) => {
        if (err) return console.error(err.message);
    });
}

//* returns the users win rate
function winRate(wins,losses){
    return (wins/(wins+losses)) * 100;
}

//* UPDATE WINS
function updateWin(win, id){
    let sql = 'UPDATE users SET wins = ? WHERE id = ?';
    let newWin = win + 1;
    db.run(sql, [newWin, id], (err) =>{
        if (err) return console.error(err.message);
    });
}
//* UPDATE LOSSES
function updateLoss(losses, id){
    let sql = 'UPDATE users SET losses = ? WHERE id = ?';
    let newLoss = losses + 1;
    db.run(sql, [newLoss, id], (err) =>{
        if (err) return console.error(err.message);
    });
}
// * update user's streak
function updateStreak(streak, id){
    let sql = 'UPDATE users SET win_streak = ? WHERE id = ?';
    let newStreak;

    // if(/**users lost */){
    //     newStreak = 0;
    // }
    // else{
    //     newStreak = streak + 1;
    // }
    db.run(sql, [newStreak, id], (err) =>{
        if (err) return console.error(err.message);
    });

}
// sql = 'UPDATE users SET username = ? WHERE id = ?';
// db.run(sql, ['Jake', 1], (err) =>{
//     if (err) return console.error(err.message);
// });

//* DELETE data
function deleteUser(id){
    let sql;
    sql = 'DELETE FROM users WHERE id = ?'
    db.run(sql, [id], (err) =>{
        if (err) return console.error(err.message);
    });
}
//* Query User data
function queryData(){
    let sql;
    sql = 'SELECT * FROM users';
    db.all(sql, [], (err, rows) => {
        if (err) return console.error(err.message);
        rows.forEach((row) => {
            console.log(row);
        });
    })
}

