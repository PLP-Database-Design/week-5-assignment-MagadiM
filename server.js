// Declaring dependencies and variables
const express = require('express');
const app = express();
const mysql = require('mysql2');
const dotenv = require('dotenv');
const cors = require('cors');

app.use(express.json());
app.use(cors());
dotenv.config();

// Connecting to database
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) return console.log("Error connecting to the mysql database");

    console.log('Connected to mysql successfully as id: ', db.threadId);

    app.set('view engine', 'ejs');
    app.set('views', __dirname + '/views');

    app.get('/patient', (req, res) => {
        db.query('SELECT patient_id, first_name, last_name, date_of_birth FROM patients', (err, results) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error retrieving data.');
            } else {
                res.render('patient', {results: results});
            }
        })
    })

    app.get('/providers', (req, res) => {
        db.query('SELECT first_name, last_name, provider_specialty FROM providers', (err, results) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error retrieving data.');
            } else {
                res.render('providers', {results: results});
            }
        })
    })

    app.get('/patient2', (req, res) => {
        db.query('SELECT first_name FROM patients', (err, results) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error retrieving data.');
            } else {
                res.render('patient2', {results: results});
            }
        })
    })

    app.get('/provider2', (req, res) => {
        db.query('SELECT * FROM providers ORDER BY provider_specialty, first_name, last_name DESC', (err, results) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error retrieving data.');
            } else {
                res.render('provider2', {results: results});
            }
        })
    })

    // listen to the server
    const PORT = 3000
    app.listen(process.env.PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);

        console.log('Sending message to the browser...')
        app.get('/', (req, res) => {
            res.send('Server started successfully!')
        })
    })
});