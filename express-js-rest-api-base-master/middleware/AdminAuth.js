const jwt = require('jsonwebtoken');

const JWTSecret = 'ASdkaokad1223zc1f';

module.exports = function (req,res,next) {
    const authToken = req.headers['authorization'];

    if (authToken != undefined) {
        const bearer = authToken.split(' ');
        let token = bearer[1];

        try {
            let decoded = jwt.verify(token,JWTSecret);
    
            if (decoded.role == 1) {
                next()
            } else {
                res.status(401);
                res.json({err: 'Você não tem permissão para acessar essa rota.'});
                return;
            }

        } catch (error) {
            res.status(403);
            res.json({err: 'Você não está authenticado.'});
            return;
        }


    } else {
        res.status(403);
        res.json({err: 'Token inválido.'});
    }
}