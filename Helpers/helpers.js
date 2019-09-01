const bcrypt = require('bcrypt');

module.exports.hashAndReturn = (password) => {
  console.log(process.env.SALT)
	const hash =  bcrypt.hashSync(password, Number(process.env.SALT));
	return hash;
};

module.exports.emailValidate = (email) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email.toLowerCase());
};

module.exports.passwordAuth = (dbPassword, inputPassword) => {
  if (bcrypt.compareSync(inputPassword, dbPassword)) {
    return true;
  }
  return false;
};

module.exports.createPassword = (length) => {
  var result           = '';
  var characters       = '10827380173487817804787180238017284168541678293818240139461364871840123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
