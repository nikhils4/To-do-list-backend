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