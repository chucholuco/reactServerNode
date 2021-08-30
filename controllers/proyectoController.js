const Proyecto = require('../model/Proyecto');
const { validationResult} = require('express-validator');

exports.crearProyecto = async (request, response) => {

    //Revisar si hay errores
    const errores = validationResult(request);
    if(!errores.isEmpty()){
        return response.status(400).json({errores:errores.array()})
    }

    try {
        //Crear un nuevo proyecto
        const proyecto = new Proyecto(request.body);
        
        //Guardar el creador vía JWT
        proyecto.creador = request.usuario.id; 
        
        //Guardar el proyecto
        proyecto.save();
        response.json(proyecto);
        
    } catch (error) {
        console.log(error);
        response.status(500).send('Hubo un error');
    }
}

//Obtiene todos los proyectos del usuario actual
exports.obtenerProyectos = async (request, response) => {
    try {
        const proyectos = await Proyecto.find({creador: request.usuario.id}).sort({creado:-1});
        response.json({proyectos});
    } catch (error) {
        console.log(error);
        response.status(500).send('Hubo un error');
    }

}

//Actualiza proyectos
exports.actualizarProyecto = async (request, response) => {

    //Revisar si hay errores
    const errores = validationResult(request);
    if(!errores.isEmpty()){
        return response.status(400).json({errores:errores.array()})
    }

    //Extraer la información del proyecto
    const {nombre} = request.body;
    const nuevoProyecto = {};

    if(nombre){
        nuevoProyecto.nombre = nombre;
    }

    try {
        //Revisar el ID
        let proyecto = await Proyecto.findById(request.params.id);
        
        //SI el pryecto existe o no
        if(!proyecto){
            return response.status(404).json({msg: 'Proyecto no encontrado'});
        }

        //Verificar el creador del proyecto
        if(proyecto.creador.toString() !== request.usuario.id){
            return response.status(401).json({msg: 'No Autorizado'});
        }

        //Actualizar
        proyecto = await Proyecto.findOneAndUpdate({_id: request.params.id}, {$set: nuevoProyecto}, {new: true});
        response.json({proyecto});

    } catch (error) {
        console.log(error);
        response.status(500).send('Hubo un error');
    }
}

exports.eliminarProyecto = async (request, response) => {
    try {
        //Revisar el ID
        let proyecto = await Proyecto.findById(request.params.id);
        
        //SI el pryecto existe o no
        if(!proyecto){
            return response.status(404).json({msg: 'Proyecto no encontrado'});
        }

        //Verificar el creador del proyecto
        if(proyecto.creador.toString() !== request.usuario.id){
            return response.status(401).json({msg: 'No Autorizado'});
        }

        //Eliminar el proyecto
        await Proyecto.findOneAndRemove({_id: request.params.id});
        response.json({msg:'Proyecto Eliminado'});
    } catch (error) {
        console.log(error);
        response.status(500).send('Hubo un error');
    }
}


