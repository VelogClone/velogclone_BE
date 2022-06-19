const jwt = require('jsonwebtoken')
const User = require('../schemas/usersSchema')

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
        const { userId } = jwt.verify(tokenValue, 'my-secret-key')
        User.findById(userId).exec().then((user) => {
                res.locals.user = user
                //console.log('res.locals 를 했어요')
                //console.log(res.locals.user)
                next();
            })
    } catch (error) {
        res.status(401).rend({
            errorMessage: '로그인 후 사용하세요',
        })
    }
}