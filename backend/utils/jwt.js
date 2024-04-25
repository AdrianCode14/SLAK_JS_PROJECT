const jwt = require("jsonwebtoken");

module.exports.sign = (userType, email, firstName, name) => {
    return jwt.sign(
        {
            data: {
                userType: userType,
                email: email,
                firstName: firstName,
                name: name,
            },
        },
        process.env.CRYPT_PASSWORD,
        {
            expiresIn: "1d",
        }
    );
};

module.exports.verify = (token) => {
    return jwt.verify(token, process.env.CRYPT_PASSWORD);
};
