const jwt = require('jsonwebtoken')
const User = require('../schemas/usersSchema')
require("dotenv").config();


module.exports = (req, res, next) => {
    //console.log('passed')
    const { authorization } = req.headers
   //console.log(authorization)

    const [tokenType, tokenValue] = authorization.split(" ");
    console.log[tokenType, tokenValue]
    if (tokenValue == 'null') {
        res.locals.user = null
        next()
        return;
    }
    if (tokenType !== 'Bearer') {
        res.status(401).send({
            errorMessage: '로그인 후 사용하세요',
        })
        return; 
    }
  
    try {
        const { email } = jwt.verify(tokenValue, JWT_SECRET_KEY);
        User.findOne({ email })
            .exec()
            .then((user) => {
                res.locals.user = user;
                next();
            });
    } catch (error) {
        res.status(401).send({
            errorMessage: "로그인 후 사용하세요.",
        });
        return;
    }
};