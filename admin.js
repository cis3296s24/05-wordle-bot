const sqlite3 = require('sqlite3').verbose();
const fs = require('node:fs');
const { OpenAI } = require('openai');
const { apiKey } = require('./config.json');
const ADMIN = 1;
//* Connect to USER DB
const db = new sqlite3.Database('./userdata.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message);
});
function getRandomWordFromDictionary(){
    const dictionary = fs.readFileSync('dictionary.txt', 'utf-8').split('\n').filter(word => word.length === 5).map(word => word.toLowerCase());
    const randomWord = dictionary[Math.floor(Math.random() * dictionary.length)];
    return randomWord;
}
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
//* Insert data into database
function insertUser(id, username, wins, losses, points, score, streak, lastWord, winRate, guesses, items, reveals,) {
    let sql = 'INSERT INTO users(id, username, wins, losses, points, leader_score, win_streak, last_word, win_rate, guesses, items, reveals) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    db.run(sql, [id, username, wins, losses, points, score, streak,lastWord,winRate,guesses,items, reveals], (err) => {
        if (err) return console.error(err.message);
    });
}
function updateADMIN(points, dailyWord, id){
    let sql = 'UPDATE users SET points = ?, last_word = ? WHERE id = ?';
    let dailyPoint = points;
    let newWord = dailyWord;
    db.run(sql, [dailyPoint, newWord, id], (err) =>{
        if (err) return console.error(err.message);
    });
}
function setDailyPoints(){
    return Math.floor(Math.random() * 100);
}
function updateItem(){
    let sql = 'UPDATE users SET items = ?';
    let newItems = 0;
    db.run(sql, [newItems], (err) =>{
        if (err) return console.error(err.message);
    });
}
updateADMIN(setDailyPoints(),getRandomWordFromDictionary(),ADMIN);