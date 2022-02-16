const jwt = require('jsonwebtoken')
const secret = "AF52NAKN654GQWA77JTYLJ3214MRV"

module.exports = function(req, res, next) {

    const authToken = req.headers['authorization']

    if (authToken !== undefined) {
        const bearer = authToken.split(' ')
        let token = bearer[1]

        try {
            const decoded = jwt.verify(token, secret)
            
            if (decoded.role === 1) {
                next()
            } else {
                res.status(403)
                res.send("Você não têm permissão para acessar!")
                return
            }
            
        } catch (error) {
            res.status(403)
            res.send("Você não está autenticado")
            return
        }    
        
    } else {
        res.status(403)
        res.send("Você não está autenticado")
        return
    }
}