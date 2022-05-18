const client = require("./database");

const insertdata = async(id, name, qua, email, username, password) => {
    try {
        client.connect();
        client.quary(`INSERT INTO "regdetails" ("id","name","qua","email","username","password")
         VALUES ($1,$2,$3,$4,$5,$6)`, [id, name, qua, email, username, password]);
        return true;
    } catch (error) {
        console.error(error.stack);
        return false;
    }

};
module.exports = { insertdata: insertdata };
// insert.insertdata(data.id, data.name, data.qua, data.email, data.username, data.password).then(result => {

//     if (result) {
//         console.log("user inserted");
//     } else {
//         console.log("error");
//     }
// });
// console.log(req.body);