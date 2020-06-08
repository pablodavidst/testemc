const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const jwtAuthenticate = passport.authenticate('jwt',{session:false});
const procesarErrores = require('./../../libs/errorHandler').procesarErrores;
const log = require('../../../utils/logger');
const alumnosController = require('../../recursos/alumnos/alumnos.controller')
const config = require('./../../../config')
const alumnoRouter = express.Router();
const ParametrosEntradaIncompletos = require('./alumnos.errors').ParametrosEntradaIncompletos;

alumnoRouter.get('/',jwtAuthenticate,procesarErrores((req,res)=>{

    return alumnosController.obtenerAlumnos()
    .then(alumnos=>{
        res.status(200).json(alumnos.recordset)
    })
}))

alumnoRouter.get('/alertas/:id/:materia',jwtAuthenticate,procesarErrores((req,res)=>{

    const id_alumno = req.params.id;
    const id_materia = req.params.materia;


    if (!id_alumno || !id_materia){
        throw new ParametrosEntradaIncompletos('Falta especificar id de alumno o id de materia')
    }
    
    return alumnosController.obtenerAlertasAlumno(id_alumno,id_materia)
    .then(alertas=>{
        res.status(200).json(alertas.recordset)
    })
}))

alumnoRouter.get('/instrumentos/:id',jwtAuthenticate,procesarErrores((req,res)=>{

    const id_alumno = req.params.id;

    if (!id_alumno){
        throw new ParametrosEntradaIncompletos('Falta especificar id de alumno')
    }
    
    return alumnosController.obtenerInstrumentosAlumno(id_alumno)
    .then(instrumentos=>{
        res.status(200).json(instrumentos.recordset)
    })
}))

alumnoRouter.get('/materiastest/:id',jwtAuthenticate,procesarErrores((req,res)=>{

    const id_alumno = req.params.id;

    if (!id_alumno){
        throw new ParametrosEntradaIncompletos('Falta especificar id de alumno')
    }
    
    return alumnosController.obtenerMateriasAprobadasTestAlumno(id_alumno)
    .then(materiasTest=>{
        res.status(200).json(materiasTest.recordset)
    })
}))

alumnoRouter.get('/analitico/parcial/:id',jwtAuthenticate,procesarErrores((req,res)=>{

    const id_alumno = req.params.id;

    if (!id_alumno){
        throw new ParametrosEntradaIncompletos('Falta especificar id de alumno')
    }
    
    return alumnosController.obtenerCursosAnaliticoParcialAlumno(id_alumno)
    .then(cursos=>{
        res.status(200).json(cursos.recordset)
    })
}))

alumnoRouter.get('/analitico/final/:id',jwtAuthenticate,procesarErrores((req,res)=>{

    const id_alumno = req.params.id;

    if (!id_alumno){
        throw new ParametrosEntradaIncompletos('Falta especificar id de alumno')
    }
    
    return alumnosController.obtenerCursosAnaliticoFinalAlumno(id_alumno)
    .then(cursos=>{
        res.status(200).json(cursos.recordset)
    })
}))

alumnoRouter.get('/historial/:id/:cuatrimestreactualsino',jwtAuthenticate,procesarErrores((req,res)=>{

    const id_alumno = req.params.id;
    const cuatrimestreactualsino = Number(req.params.cuatrimestreactualsino);

    log.info("El cuatrimestre actual es " + cuatrimestreactualsino)
    if (!id_alumno){
        throw new ParametrosEntradaIncompletos('Falta especificar id de alumno')
    }
    
    return alumnosController.obtenerHistorialAlumno(id_alumno,cuatrimestreactualsino)
    .then(historial=>{
        res.status(200).json(historial.recordset)
    })
}))

alumnoRouter.get('/:id',(req,res)=>{
    const id = req.params.id;

    return alumnosController.obtenerAlumno(id)
    .then(alumno=>{
        res.status(200).json(alumno.recordset)
    })
})

module.exports = alumnoRouter;