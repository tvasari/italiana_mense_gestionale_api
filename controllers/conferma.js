const handleConferma = (req, res, db, jwt) => {
  
  jwt.verify(req.params.token, "@_CuriousDrawer60", (err, verifiedToken) => {
    err
    ? res.send(err.message)
    : db('utente')
        .where('indirizzo_email', '=', verifiedToken)
        .update({confermato: true}, ['indirizzo_email', 'confermato'])
        .then(utente => res.redirect('http://localhost:3000/accedi'))
  });
  
};

module.exports = {
  handleConferma: handleConferma
};