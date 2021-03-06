const Usuario = require('../model/Usuario');
const bcryptjs = require('bcryptjs');
const {validationResult} = require('express-validator');
const jwt = require('jsonwebtoken'); 

exports.autenticarUsuario = async (request, response) => {
     //revisar si hay errores
     const errores = validationResult(request);
     if(!errores.isEmpty()){
         return response.status(400).json({errores: errores.array()})
     }

     //Extraer el email y password
     const {email, password} = request.body;

     try {
         //Revisar que sea un usuario registrado
         let usuario = await Usuario.findOne({email});
         if(!usuario){
             return response.status(400).json({msg: 'El usuario no existe'});
         }

         //Revisar su password
         const passCorrecto = await bcryptjs.compare(password, usuario.password);
         if(!passCorrecto){
            return response.status(400).json({msg: 'Password Incorrecto'});
         }

         //Si todo es correcto, generar el JWT
        //Crear y Firmar el JWT
        const payload = {
            usuario: {
                id: usuario.id
            }
        };

        //Firmar el JWT
        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 3600//Una hora está en segundos

        }, (error, token) => {
            if(error) throw error;            

            response.json({token});
        });


     } catch (error) {
         console.log(error);
     }
}

//Obtiene que usuario está autenticado
exports.usuarioAutenticado = async (request, response) => {
    try {
        const usuario = await Usuario.findById(request.usuario.id).select('-password');
        response.json({usuario});
    } catch (error) {   
        console.log(error);
        response.status(500).json({msg: 'Hubo un error'});
    }
}

