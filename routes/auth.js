//Rutas para autenticar usuarios
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {check} = require('express-validator');
const authController = require('../controllers/authController');


//Iniciar Sesión 
//  api/auth
router.post('/', 
[
 //   check('email', 'Agrega un email válido').isEmail(),
   // check('password', 'El password debe ser de mínimo 6 caracteres').isLength({min:6})
], authController.autenticarUsuario
);

//Obtiene el usuario autenticado
router.get('/',
    auth,
    authController.usuarioAutenticado
);

module.exports = router;