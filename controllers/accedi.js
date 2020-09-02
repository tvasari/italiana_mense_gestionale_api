const handleAccedi = (req, res, db, bcrypt) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
        message: 'dati richiesti mancanti', 
        color: 'error'
      });
  }

  db('utente')
    .select('indirizzo_email', 'hash', 'confermato')
    .where(db.raw('?? = ?', ['indirizzo_email', email]))
    .then(utente => {
      (utente.length > 0)
      ? (utente[0].confermato)
        ? (bcrypt.compare(password, utente[0].hash, (err, result) => {
            (err) 
            ? (res.send(err.message)) 
            : (result 
              ? (res.json({
                  message: 'accesso effettuato',
                  color: 'textPrimary'
                }))
              : (res.json({
                  message: 'email o password errati',
                  color: 'error'
                }))
              )
          }))
        : (res.status(400).json({
            message: "conferma l'email del tuo account per accedere",
            color: 'error'
          }))
      : (res.status(400).json({
          message: "l'indirizzo email che hai inserito non è ancora associato ad un account",
          color: 'error'
        }))
    })
    .catch(err => res.send(err.message));

}

module.exports = {
  handleAccedi: handleAccedi
};