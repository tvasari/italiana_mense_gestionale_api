const express = require('express');
const helmet = require('helmet');
const knex = require('knex');
const cors = require('cors');
const bcrypt = require('bcrypt');

const registrati = require('./controllers/registrati');
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

app.get('/', (req, res) => res.send('works'));
app.post('/registrati', (req, res) => registrati.handleRegistrati(req, res, db, bcrypt));
app.post('/accedi', (req, res) => accedi.handleAccedi(req, res, db, bcrypt));

app.listen(3001, () => 'listening on port 3001');
