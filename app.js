const Discord = require('discord.js');
const sqlite3 = require('sqlite3').verbose();
//const client = new Discord.Client();
// connect to DB
const db = new sqlite3.Database('./userdata.db', sqlite3.OPEN_READWRITE,(err)=>{
    if (err) return console.error(err.message);
});
// Create table
//db.run('CREATE TABLE users(id INTEGER PRIMARY KEY,password,username,wins,losses,points,leader_score,win_streak)');
// Drop Table
queryData();
//* Insert data into database
function insertUser(){
    // in array brackets is where we'll store the user information
    /**
     * Couple things to note the user's 
     * streaks, win_rate, and points
     * should all be 0 upon creation
     * 
     * user's leader_score should be the lowest number 
     * maybe AI everytime one is entered and cause a switch statement
     * once a users points is greater.
     */
    let sql;
    sql = 'INSERT INTO users(password,username,wins,losses,points,leader_score,win_streak) VALUES(?,?,?,?,?,?,?)';
    db.run(sql,["huh","coolguymike", "0","0","0","1","0"],(err)=>{
        if (err) return console.error(err.message);
    });
}

//* UPDATE data
// sql = 'UPDATE users SET username = ? WHERE id = ?';
// db.run(sql, ['Jake', 1], (err) =>{
//     if (err) return console.error(err.message);
// });

//* DELETE data
function deleteUser(){
    let sql;
    sql = 'DELETE FROM users WHERE id = ?'
    db.run(sql, [1], (err) =>{
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
