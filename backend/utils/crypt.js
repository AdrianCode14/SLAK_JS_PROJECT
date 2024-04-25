const bcrypt = require("bcrypt");

const saltRounds = 10;

module.exports.genPasswordHash = (passwordPlain) => {
    return bcrypt.hashSync(passwordPlain, saltRounds);
};

module.exports.comparePasswords = (passwordPlain, passwordHash) => {
    return bcrypt.compareSync(passwordPlain, passwordHash);
};
