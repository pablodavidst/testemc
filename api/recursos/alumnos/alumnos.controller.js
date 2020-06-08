
const { sql,poolPromise } = require('./../../../database/db')
const {ErrorDeBaseDeDatos} = require('./alumnos.errors');
const procesarErrores = require('./../../libs/errorHandler').procesarErrores;
const log = require('../../../utils/logger');
const dbconfig = require('./../../../config').dbconfig;

async  function obtenerAlumno(id){
    try{
        const pool = await poolPromise
        
        return pool.request() 
        .input('NroAlumno', sql.Int, id)
        .execute('spCargarAlumno_new')
    }catch{
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async  function obtenerHistorialAlumno(id,cuatrimestreActual){
    try{
        const pool = await poolPromise
        
        return pool.request() 
        .input('NroAlumno', sql.Int, id)
        .input('Puntero', sql.Int, 1)
        .input('activo', sql.Bit, cuatrimestreActual)
        .execute('spListarHistorialAlumno_new')
    }catch{
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async  function obtenerCursosAnaliticoFinalAlumno(id){
    try{
        const pool = await poolPromise
        
        return pool.request() 
        .input('NroAlumno', sql.Int, id)
        .execute('spListarCursosParaAnaliticosFinales_new')
    }catch{
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async  function obtenerCursosAnaliticoParcialAlumno(id){
    try{
        const pool = await poolPromise
        
        return pool.request() 
        .input('NroAlumno', sql.Int, id)
        .execute('spListarCursosParaAnaliticosParciales_new')
    }catch{
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async  function obtenerInstrumentosAlumno(id){
    try{
        const pool = await poolPromise
        
        return pool.request() 
        .input('NroAlumno', sql.Int, id)
        .execute('spCargarAlumno_InstrumentosPorAlumno_new')
    }catch{
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}


async  function obtenerMateriasAprobadasTestAlumno(id){
    try{
        const pool = await poolPromise
        
        return pool.request() 
        .input('NroAlumno', sql.Int, id)
        .execute('spCargarAlumno_MateriasAprobadasPorTest')
    }catch{
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async  function obtenerAlertasAlumno(id,id_materia){
    try{
        const pool = await poolPromise
        
        return pool.request() 
        .input('NroAlumno', sql.Int, id)
        .input('NroMateria', sql.Int, id_materia)
        .execute('spCargarAlertasyCorrelatividad_new')
    }catch{
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async  function obtenerAlumnos(){
    try{
        const pool = await poolPromise
        
        return pool.request() 
        .input('ID', sql.Int, 0)
        .input('Apellidos', sql.VarChar, '')
        .input('Nombres', sql.VarChar, '')
        .input('Activos', sql.Bit, true)
        .input('Egresado', sql.Bit, false)
        .execute('spListarAlumnos_new')
    }catch{
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

module.exports={
    obtenerAlumnos,
    obtenerAlumno,
    obtenerHistorialAlumno,
    obtenerInstrumentosAlumno,
    obtenerAlertasAlumno,
    obtenerMateriasAprobadasTestAlumno,
    obtenerCursosAnaliticoFinalAlumno,
    obtenerCursosAnaliticoParcialAlumno
}