const Tarea = require("../model/Tarea");
const Proyecto = require("../model/Proyecto");
const { validationResult } = require("express-validator");

//Crea una nueva Tarea
exports.crearTarea = async (request, response) => {
  //Revisar si hay errores
  const errores = validationResult(request);
  if (!errores.isEmpty()) {
    return response.status(400).json({ errores: errores.array() });
  }

  //Extraer el proyecto y comprobar si existe
  const { proyecto } = request.body;

  try {
    const existeProyecto = await Proyecto.findById(proyecto);
    if (!existeProyecto) {
      return response.status(404).json({ msg: "Proyecto no encontrado" });
    }

    //Revisar si el proyecto actual pertenece al usuario autenticado
    //Verificar el creador del proyecto
    if (existeProyecto.creador.toString() !== request.usuario.id) {
      return response.status(401).json({ msg: "No Autorizado" });
    }

    //Creamos la Tarea
    const tarea = new Tarea(request.body);
    await tarea.save();
    response.json({ tarea });
  } catch (error) {
    console.log(error);
    response.status(500).send("Hubo un error");
  }
};

//Listar Tareas
exports.obtenerTareas = async (request, response) => {
  //Extraer el proyecto y comprobar si existe
  const { proyecto } = request.query;
  try {
    const existeProyecto = await Proyecto.findById(proyecto);
    if (!existeProyecto) {
      return response.status(404).json({ msg: "Proyecto no encontrado" });
    }

    //Revisar si el proyecto actual pertenece al usuario autenticado
    //Verificar el creador del proyecto
    if (existeProyecto.creador.toString() !== request.usuario.id) {
      return response.status(401).json({ msg: "No Autorizado" });
    }
  } catch (error) {
    console.log(error);
    response.status(500).send("Hubo un error");
  }

  //Obtener las Tareas por proyecto
  const tareas = await Tarea.find({ proyecto }).sort({creado: -1});
  response.json({ tareas });
};

exports.actualizarTarea = async (request, response) => {
  try {
    const { proyecto, nombre, estado } = request.body;
    
    //Verificar si la tarea existe o no
    let tarea = await Tarea.findById(request.params.id);
    if (!tarea) {
      return response.status(404).json({ msg: "Tarea no encontrado" });
    }

    //Extraer proyecto
    const existeProyecto = await Proyecto.findById(proyecto);
    

    //Revisar si el proyecto actual pertenece al usuario autenticado
    if (existeProyecto.creador.toString() !== request.usuario.id) {
      return response.status(401).json({ msg: "No Autorizado" });
    }

    //Crear un objeto con la nueva info
    const nuevaTarea = {}
    nuevaTarea.nombre = nombre;
    nuevaTarea.estado = estado;
    

    //Actualizar Tarea
    tarea = await Tarea.findOneAndUpdate({_id: request.params.id}, nuevaTarea, {new:true});

    response.json({tarea});

  } catch (error) {
    console.log(error);
    response.status(500).send("Hubo un error");
  }
};

exports.eliminarTarea = async (request, response) => {
    try {        
        const { proyecto } = request.query;
        
        //Verificar si la tarea existe o no
        let tarea = await Tarea.findById(request.params.id);
        if (!tarea) {
          return response.status(404).json({ msg: "Tarea no encontrado" });
        }
    
        //Extraer proyecto
        const existeProyecto = await Proyecto.findById(proyecto);
        
    
        //Revisar si el proyecto actual pertenece al usuario autenticado
        if (existeProyecto.creador.toString() !== request.usuario.id) {
          return response.status(401).json({ msg: "No Autorizado" });
        }
        
        //Eliminar
        await Tarea.findOneAndRemove({_id: request.params.id} );

        response.json({msg: 'Tarea Eliminada'});
        
    
      } catch (error) {
        console.log(error);
        response.status(500).send("Hubo un error");
      }
  
}