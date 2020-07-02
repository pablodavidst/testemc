
const { sql,poolPromise } = require('./../../../database/db')
const {ErrorDeBaseDeDatos,ErrorInscripcionNoViable} = require('./cursos.errors');
const procesarErrores = require('./../../libs/errorHandler').procesarErrores;
const log = require('../../../utils/logger');
const dbconfig = require('./../../../config').dbconfig;
const utilFechas = require('../../../utils/fechas')

function transformarHoraMinAfecha(hora,min)
{
    let fecha = new Date(0)

    fecha.setHours(Number(hora),Number(min))

    const fechaSQL = fecha.toISOString()

    log.info(hora + ' : ' + min)
    log.info(fechaSQL)

    return fechaSQL
    //return "1899-12-30 " + hora + ":" + min + ":00:000";
}

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

async  function obtenerCursoCompleto(id){
    try{
        const pool = await poolPromise
        
        return pool.request() 
        .input('NroCurso', sql.Int, id)
        .execute('spCargarCurso_new')
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

async  function obtenerUltimasAltas(){
    try{
         const pool = await poolPromise
        
        return pool.request() 
        .execute('spListarUltimosCursosCreados_new')
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

async function test(id,id_alumno){
    try{
        const pool = await poolPromise

        return pool.request()
        .execute('spTest')
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

async function grabarCurso({curso:curso,id:id}){ // recibo los parámetros como un objeto, es otra forma de pasar parametros cuando uno o mas son opcionales. Aqui se aplica porque grabarCurso puede recibir o no el id segúns sea una modificación o un alta 

    try {
        const pool = await poolPromise

        const idCurso = id ? id : -1;

        const hora_desde_new = utilFechas.transformarHoraMinutoAfechaSQL(curso.horai,curso.minutoi)
        const hora_hasta_new = utilFechas.transformarHoraMinutoAfechaSQL(curso.horaf,curso.minutof)

        log.error('esta es la hora formateada ' + hora_desde_new)
        log.error('esta es la hora formateada ' + hora_hasta_new)

        return pool.request() 
        .input('NroCurso', sql.Int, idCurso)
        .input('NroProfesor', sql.Int, curso.profesor)
        .input('Capacidad', sql.Int, curso.capacidad)
        .input('NroAula', sql.Int, curso.aula)
        .input('Dia', sql.VarChar, curso.diaString)
        .input('HoraInicio', sql.VarChar, hora_desde_new)
        .input('HoraFin', sql.VarChar, hora_hasta_new)
        .input('MesaExamen', sql.Bit, curso.recuperatorio)
        .input('NroRegimen', sql.Int, curso.regimen)
        .input('NroEncabezado', sql.Int, curso.encabezado)
        .input('NroCuatrimestre', sql.Int, curso.cuatrimestre)
        .input('NroMateria', sql.Int, curso.materia)
        .input('NroNivelInstrumental', sql.Int, curso.nivelI)
        .input('NroNivelEnsamble', sql.Int, curso.nivelE)
        .input('NroTipoCurso', sql.Int, curso.tipoCurso)
        .input('NroDia', sql.Int, curso.dia)
        .input('NroIntervalo', sql.Int, curso.subdivisioni ? 1 : 0)
        .execute('spGrabarCurso_new')

    }catch(err){
        log.error('se produjo un error '+ err.stack + err.message)
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
    obtenerCurso,
    obtenerCursoCompleto,
    grabarCurso,
    test,
    obtenerUltimasAltas
}