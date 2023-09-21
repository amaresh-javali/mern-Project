const jwt = require ('jsonwebtoken')
const authenticateUser = (req, res, next) =>{
    let token = req.headers['authorization']
    if(token) {
        token = token.split(' ')[1]
        try{
            const tokenData = jwt.verify(token, process.env.JWT_SECRET)
            req.user = {
                _id: tokenData._id
            }
            //console.log('User authenticated. User ID:', req.user._id);
            next()
        } catch (e) {
            res.status(404).json({
                error: 'invalid token'
            })
        }
    } else {
        res.status(400).json({
            error: 'token not provided'
        })
    }
}

module.exports = authenticateUser