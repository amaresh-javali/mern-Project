const authorization = (req, res, next) =>{
    if(req.permittedRoles.includes(req.user.role)){
        next()
    } else {
        res.status(403).join({
            error: 'Access denied'
        })
    }
}
module.exports = authorization