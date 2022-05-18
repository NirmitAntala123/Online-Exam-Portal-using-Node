let { Client } = require('pg');
let client = new Client({
    host: "localhost",
    user: "postgres",
    port: 4050,
    password: "1234",
    database: "Exam"
});
client.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});
module.exports = client;