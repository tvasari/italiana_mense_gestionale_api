const handleRegistrati = (req, res, db, bcrypt) => {

  const { nome, cognome, email, password } = req.body;

  if (!nome || !cognome || !email || !password) {
    return res.status(400).json('dati richiesti mancanti');
  }

  const saltRounds = 10;

  bcrypt.hash(password, saltRounds, (err, hash) => {
    db('utente')
      .returning('id_utente')
      .insert({
        nome: nome,
        cognome: cognome,
        indirizzo_email: email,
        hash: hash
      })
      .then(utente => res.json(utente))
      .catch(() => res.json(err))
  })

}

module.exports = {
  handleRegistrati: handleRegistrati
};