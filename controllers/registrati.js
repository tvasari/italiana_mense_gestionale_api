const handleRegistrati = (req, res, db, bcrypt, nodemailer, jwt) => {
  const { nome, cognome, email, password } = req.body;

  if (!nome || !cognome || !email || !password) {
    return res.status(400).json({
        message: 'dati richiesti mancanti', 
        color: 'error'
      });
  }

  const saltRounds = 10;
  const emailToken = jwt.sign(email, "@_CuriousDrawer60");

  let url = `http://localhost:3001/conferma/${emailToken}`;

  async function main() {
    let transporter = nodemailer.createTransport({
      host: "smtp.dreamhost.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.USER,
        pass: process.env.PASS
      }
    })

    let info = await transporter.sendMail({
      from: '"Tommaso" <tommasovasari@tommasovasari.com>',
      to: email,
      subject: 'Italiana Mense Gestionale',
      html: `Clicca sul link per confermare la tua email: <a href=${url}>${url}</a>`
    })

    console.log("Messaggio inviato: %s", info.messageId);

  }
 
  main().catch(console.error);

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