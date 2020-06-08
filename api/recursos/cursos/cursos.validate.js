const Joi = require('joi');
const log = require('../../../utils/logger');

const bluePrintInscripcion = Joi.object().keys(
    {
        id:Joi.number().min(1).integer().required().error(()=>"El id del curso para inscribir es obligatorio y debe ser un número válido"),
        id_alumno:Joi.number().min(1).integer().required().error(()=>"El id del alumno a inscribir es obligatorio y debe ser un número válido"),
        id_tipo_cursada:Joi.number().min(1).integer().required().error(()=>"El id del tipo de inscripción es obligatorio y debe ser un número válido"),
        tipo:Joi.string().valid(['INDIVIDUAL','GRUPAL']).required().error(()=>"Debe especificar el tipo de curso: GRUPAL o INDIVIDUAL"),
        hora_individual:Joi.string().when('tipo',{is:'INDIVIDUAL',then:Joi.string().trim().regex(/^[0-9]|0[0-9]|1[0-9]|2[0-3]:[0-5][0-9]$/).required().error(()=>"Debe especificar un horario si el curso a inscribir es INDIVIDUAL"),otherwise: Joi.string().trim().valid([""])})
     }
)

let validarInscripcion = (req,res,next)=>{
    const resultado = Joi.validate(req.body,bluePrintInscripcion,{abortEarly:false,convert:false})

    if (resultado.error===null){
        next()
    }else{
        let erroresDeValidacion = resultado.error.details.reduce((acumulador,error)=>{
            return acumulador + ` ${error.message}` 
        },"")

        res.status(400).send(erroresDeValidacion)
    }
}

const bluePrintCambioHorario = Joi.object().keys(
    {
        id:Joi.number().min(1).integer().required().error(()=>"El id del curso para inscribir es obligatorio y debe ser un número válido"),
        id_alumno:Joi.number().min(1).integer().required().error(()=>"El id del alumno a inscribir es obligatorio y debe ser un número válido"),
        nuevohorario:Joi.string().trim().regex(/^[0-9]|0[0-9]|1[0-9]|2[0-3]:[0-5][0-9]$/).length(5).required(),
    }
)
let validarCambioHorario = (req,res,next)=>{

    const resultado = Joi.validate(req.body,bluePrintCambioHorario,{abortEarly:false,convert:false})

    if (resultado.error===null){
        next()
    }else{
        let erroresDeValidacion = resultado.error.details.reduce((acumulador,error)=>{
            return acumulador + ` ${error.message}` 
        },"")
        res.status(400).send(erroresDeValidacion)
    }

}

module.exports = {validarInscripcion,validarCambioHorario};