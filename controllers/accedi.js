const handleAccedi = (req, res, db, bcrypt) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
        message: 'dati richiesti mancanti', 
        color: 'error'
      });
  }

  db('utente')
    .where({ indirizzo_email: email })
    .select('hash')
    .then(hash => {
      bcrypt.compare(password, hash[0].hash, (err, result) => {
        err 
        ? res.send(err) 
        : (
          result 
          ? res.json({
            message: 'accesso effettuato',
            color: 'textPrimary'
          }) 
          : res.json({
            message: 'email o password errati',
            color: 'error'
          })
        );
      })
    })
    .catch(err => res.send(err));

}

module.exports = {
  handleAccedi: handleAccedi
};