const handleRegistrati = (req, res, db, bcrypt) => {
  const { nome, cognome, email, password } = req.body;

  if (!nome || !cognome || !email || !password) {
    return res.status(400).json({
        message: 'dati richiesti mancanti', 
        color: 'error'
      });
  }

  const saltRounds = 10;

  db.select('indirizzo_email')
    .from('utente')
    .then(allEmails => allEmails.filter(indirizzoEmail => {
      return email === indirizzoEmail.indirizzo_email
    }))
    .then(matches => {
      matches.length > 0 
      ? res.status(400).json({
          message: `l'indirizzo email ${email} è già in uso`, 
          color: 'error'
        }) 
      : bcrypt.hash(password, saltRounds, (err, hash) => {
          db('utente')
            .returning('id_utente')
            .insert({
              nome: nome,
              cognome: cognome,
              indirizzo_email: email,
              hash: hash
            })
            .then(utente => res.status(200).json({
              message: "utente registrato", 
              color: 'textPrimary'
            }))
            .catch(() => res.json(err))
        })
    })
    .catch(err => res.json(err));

}

module.exports = {
  handleRegistrati: handleRegistrati
};