const jwt = require('jsonwebtoken');

module.exports = function(request, response, next) {
    //Leer el token del Header
    const token = request.header('x-auth-token');

    //Revisar si no hay Token
    if(!token){
        return response.status(401).json({msg:'No hay Token, permiso no válido'})
    }

    //Validar el Token
    try {
         const cifrado = jwt.verify(token, process.env.SECRETA);
         request.usuario = cifrado.usuario;
         next();
    } catch (error) {
        response.status(401).json({msg: 'Token no válido'});
    }
} 