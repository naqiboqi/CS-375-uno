const express = require('express'); // import express framework
const app = express(); // create instance of express
const http = require('http').createServer(app); // create http server using express instance
const path = require('path'); // import path module for file path handling
const io = require('socket.io')(http); // initialize socket.io for real-time communication

const env = require('../env.json'); // load environment configuration
const pg = require('pg'); // import the PostgreSQL client library
const Pool = pg.Pool; // create a connection pool for managing database connections
const pool = new Pool(env); // initialize a pool using the environment configuration
const argon2 = require('argon2'); // import argon2 for password hashing

app.use(express.static('public')); //use express to serve static files from 'public' folder

// TODO: move these to their own class
// custom error class for handling username not found error
class UsernameNotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = 'UsernameNotFoundError';
    };
};


// custom error class for handling invalid password error
class InvalidPasswordError extends Error {
    constructor() {
        super('Invalid password.');
        this.name = 'InvalidPasswordError';
    };
};


// serve the login.html file at the root path
app.get("/", (req, res) => {
    res.status(200);
    res.setHeader("Content-Type", "text/html");
    
    const htmlFilePath = path.join(__dirname, "public", "login.html");
    res.sendFile(htmlFilePath);
});


// handle account creation POST request
app.post("/accountcreation", async (req, res) => {
    const username = req.body[username];
    const password = req.body[password];

    // TODO: add server side validation: does the username already exist?
    // query to add new credentials to database (if it is valid)
    // send response to client saying whether creation was succesful or not
});


// handle /login POST request
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


// get the hashed password for a given username from the database
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


// compare entered and stored hashed passwords
async function isPassWordEqual(enteredPassword, storedPassword) {
    return (enteredPassword === storedPassword);
};


// start the http server
http.listen(3000, () => {
    console.log("Now listening on port 3000");
});
