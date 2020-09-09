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
app.use((req, res, next) => {
  db('utente')
    .select("nome", "cognome")
    .where("indirizzo_email", req.body.email)
    .then(matches => {
      if (matches.length > 0) {
        req.session.name = matches[0].nome
        req.session.surname = matches[0].cognome
      }
    })
    .catch(err => console.log("errore durante l'aggiornameto della sessione", err))
    
  next();
})

app.get('/', (req, res) => res.send('works'));
app.post('/registrati', (req, res) => registrati.handleRegistrati(req, res, db, bcrypt, nodemailer, jwt));
app.post('/accedi', (req, res) => accedi.handleAccedi(req, res, db, bcrypt));
app.get('/conferma/:token', (req, res) => conferma.handleConferma(req, res, db, jwt));
app.get('/esci', (req, res) => req.session.destroy(err => {
  if (err) {
    return console.log(err)
  }
  res.send('Sessione conclusa')
}))

app.listen(3001, () => 'listening on port 3001');
