
const { sql,poolPromise } = require('./../../../database/db')
const {ErrorDeBaseDeDatos,ErrorInscripcionNoViable} = require('./cursos.errors');
const procesarErrores = require('./../../libs/errorHandler').procesarErrores;
const log = require('../../../utils/logger');
const dbconfig = require('./../../../config').dbconfig;

async  function obtenerAlumnosDelCurso(id){
    try{
        const pool = await poolPromise
        
        return pool.request() 
        .input('nro_curso', sql.Int, id)
        .execute('spListarCursoIndividualConDisponibilidad_new')
    }catch(err){
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async  function obtenerCurso(id){
    try{
        const pool = await poolPromise
        
        return pool.request() 
        .input('NroCurso', sql.Int, id)
        .execute('spCargarCursoDetalle_new')
    }catch(err){
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async  function obtenerCuatrimestreMoverAotraRuta(id){
    try{
        const pool = await poolPromise
        
        return pool.request() 
        .input('NroCuatrimestre', sql.Int, id)
        .execute('spCargarCuatrimestre_new')
    }catch(err){
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async  function obtenerCuatrimestresMoverAotraRuta(){
    try{
         const pool = await poolPromise
        
        return pool.request() 
        .execute('spListarCuatrimestres')
    }catch(err){
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async function verificarPosibilidadInscripcion(id,id_alumno,horario){
    try{

        const pool = await poolPromise

        return pool.request()
        .input('NroCurso',sql.Int, id)
        .input('NroAlumno',sql.Int, id_alumno)
        .input('HoraIndividualDestino',sql.VarChar,horario)
        .execute('spVerificarPosibilidadAlta_new')
    }catch(err){
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async function inscribirAlumno(id,id_alumno,id_tipo_cursada,horaIndividual){
    try{
        const pool = await poolPromise

        return pool.request()
        .input('NroCurso', sql.Int, id)
        .input('NroAlumno', sql.Int, id_alumno)
        .input('NroTipoCursada', sql.Int, id_tipo_cursada)
        .input('HoraIndividual', sql.VarChar, horaIndividual)
        .execute('spGrabarInscripcion')
    }catch{
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async function borrarAlumnoInscripto(id,id_alumno){
    try{
        const pool = await poolPromise

        return pool.request()
        .input('NroCurso', sql.Int, id)
        .input('NroAlumno', sql.Int, id_alumno)
        .execute('spBorrarAlumnoInscripto')
    }catch(err){
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async function modificarHorarioIndividual(id,id_alumno,nuevoHorario){
    try{
        const pool = await poolPromise

        return pool.request()
        .input('NroCurso', sql.Int, id)
        .input('NroAlumno', sql.Int, id_alumno)
        .input('HoraIndividualDestino', sql.VarChar, nuevoHorario)
        .execute('spGrabarInscripcion_new')
    }catch(err){
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async  function obtenerCursos(cuatrimestre){
    try{
        const pool = await poolPromise
        
        const cualquiera = 0;   // El campo MesaExamen no tiene efecto cuando NroMateria y id_prof son iguales a -1
                                // se listan todos regulares y recuperatorios
        return pool.request() 
        .input('NroCuatrimestre', sql.Int, cuatrimestre)
        .input('NroMateria', sql.Int, -1)
        .input('MesaExamen', sql.Bit, cualquiera)
        .input('id_prof', sql.Int, -1)
        .execute('spListarCursosSegunProfMat_new')
    }catch(err){
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

module.exports={
    obtenerCursos,
    obtenerAlumnosDelCurso,
    inscribirAlumno,
    modificarHorarioIndividual,
    borrarAlumnoInscripto,
    obtenerCuatrimestreMoverAotraRuta,
    obtenerCuatrimestresMoverAotraRuta,
    verificarPosibilidadInscripcion,
    obtenerCurso
}