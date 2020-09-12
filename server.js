const express = require('express');
const helmet = require('helmet');
const knex = require('knex');
const cors = require('cors');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const session = require("express-session");

const registrati = require('./controllers/registrati');
const conferma = require('./controllers/conferma');
const accedi = require('./controllers/accedi');

const app = express();

const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'postgres',
    password: 'test',
    database: 'italiana_mense'
  }
})

app.use(helmet());
app.use(express.json());
app.use(cors());
app.use(session({
  secret: "non temo nulla",
  saveUninitialized: false,
  resave: false
}))

app.get('/', (req, res) => res.send('works'));
app.post('/registrati', (req, res) => registrati.handleRegistrati(req, res, db, bcrypt, nodemailer, jwt));
app.post('/accedi', (req, res) => accedi.handleAccedi(req, res, db, bcrypt));
app.get('/conferma/:token', (req, res) => conferma.handleConferma(req, res, db, jwt));
app.get('/esci', (req, res) => req.session.destroy(err => {
  err ? res.send(err) : res.send('Sessione conclusa');
}))
app.get('/presenze', (req, res) => {
  db('presenze')
    .select('*')
    .then(data => res.json(data))
})

app.listen(3001, () => 'listening on port 3001');
