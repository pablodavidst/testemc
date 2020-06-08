
const { sql,poolPromise } = require('./../../../database/db')
const {ErrorDeBaseDeDatos} = require('./usuarios.errors');
const procesarErrores = require('./../../libs/errorHandler').procesarErrores;


const log = require('../../../utils/logger');
const dbconfig = require('./../../../config').dbconfig;

async function validarLogin(username , password){

    try{

        const pool = await poolPromise

        return pool.request() 
        .input('Usuario', sql.VarChar, username)
        .input('Contraseña', sql.VarChar, password)
        .execute('spLogin_new')
    }catch (err) {
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }

}

async  function obtenerUsuarios(){
    try{
        const pool = await poolPromise
        
        return pool.request() 
        .input('EsProfesor', sql.Bit, true)
        .execute('spListarProfesores_new')
    }catch{
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async function obtenerUsuario(id){

    try {
        const pool = await poolPromise

        return pool.request() 
        .input('NroProfesor', sql.Int, id)
        .execute('spCargarProfesor')

    }catch(err){
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async function grabarUsuario({usuario:usuario,id:id}){

    try {
        const pool = await poolPromise

        const idUsuario = id ? id : -1;

        console.log('el usuario es ', usuario)
        return pool.request() 
        .input('NroProfesor', sql.Int, idUsuario)
        .input('Apellido', sql.NVarChar, usuario.apellido)
        .input('Nombre', sql.NVarChar, usuario.nombre)
        .input('Direccion', sql.NVarChar, usuario.direccion)
        .input('FechaNacimiento', sql.DateTime, usuario.fechaNacimiento)
        .input('Email', sql.NVarChar, usuario.email)
        .input('Telefono', sql.NVarChar, usuario.telefono)
        .input('Documento', sql.NVarChar, usuario.documento)
        .input('Pais', sql.NVarChar, usuario.pais)
        .input('Provincia', sql.NVarChar, usuario.provincia)
        .input('Localidad', sql.NVarChar, usuario.localidad)
        .input('CodigoPostal', sql.NVarChar, usuario.codigoPostal)
        .input('NroTipoUsuario', sql.Int, usuario.tipoUsuarioId)
        .input('NombreUsuario', sql.NVarChar, usuario.nombreUsuario)
        .input('ContraseñaPredet', sql.NVarChar, usuario.password)
        .input('NroPermiso', sql.Int, usuario.permisoId)

        .execute('spGrabarProfesor_new')

    }catch(err){
        log.error('se produjo un error '+ err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}


module.exports={
    validarLogin,
    obtenerUsuario,
    obtenerUsuarios,
    grabarUsuario
}