const express = require('express');
const app = express();
const http = require('http').createServer(app);
const path = require('path');
const io = require('socket.io')(http);

const env = require('../env.json');
const pg = require('pg');
const Pool = pg.Pool;
const pool = new Pool(env);

const argon2 = require('argon2');


// TODO: move these to their own class
class UsernameNotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = 'UsernameNotFoundError';
    };
};


class InvalidPasswordError extends Error {
    constructor() {
        super('Invalid password.');
        this.name = 'InvalidPasswordError';
    };
};


app.get("/", (req, res) => {
    res.status(200);
    res.setHeader("Content-Type", "text/html");
    
    const htmlFilePath = path.join(__dirname, "public", "login.html");
    res.sendFile(htmlFilePath);
});


app.post("/accountcreation", async (req, res) => {
    const username = req.body[username];
    const password = req.body[password];

    // TODO: add server side validation: does the username already exist?
    // query to add new credentials to database (if it is valid)
    // send response to client saying whether creation was succesful or not
});


app.post("/login", async (req, res) => {
    const username = req.body["username"];
    const password = red.body["password"];

    // TODO: catch thrown user error:
    if (username !== undefined && password !== undefined) {
        const storedHashedPassword = getPasswordForUsername(username);
        const enteredHashedPassword = await argon2.hash(password);

        if (isPassWordEqual(enteredHashedPassword, storedHashedPassword)) {
            console.log(`User ${username} has logged in.`);
        }
        else {
            res.status(400).send();
        };
    }
    else {
        res.status(400).send();
    };
});


async function getPasswordForUsername(username) {
    const queryText = 'SELECT password AS pass FROM users WHERE username = $1';
    const queryValue = [username];

    const queryResult = await pool.query(queryText, queryValue);
    const userRow = queryResult.rows[0];

    if (!userRow) {
        throw new UsernameNotFoundError();
    };

    return userRow.pass;
};


async function isPassWordEqual(enteredPassword, storedPassword) {
    return (enteredPassword === storedPassword);
};


http.listen(3000, () => {
    console.log("Now listening on port 3000");
});
