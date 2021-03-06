const mongoose = require("mongoose");
const Proyecto = require("./Proyecto");

const TareaShema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    estado:{
        type: Boolean,
        default: false
    },
    fechaCreacion:{
        type: Date,
        default: Date.now()
    },
    proyecto:{
        type: mongoose.Schema.Types.ObjectId,
        ref: Proyecto
    }
});

module.exports = mongoose.model('Tarea', TareaShema);