const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const jwtAuthenticate = passport.authenticate('jwt',{session:false});
const procesarErrores = require('./../../libs/errorHandler').procesarErrores;
const log = require('../../../utils/logger');
const cursosController = require('../../recursos/cursos/cursos.controller')
const config = require('./../../../config')
const cursoRouter = express.Router();
const validarInscripcion = require('./cursos.validate').validarInscripcion;
const validarCambioHorario = require('./cursos.validate').validarCambioHorario;
const validarCurso = require('./cursos.validate').validarCurso;
const ErrorYaInscripto = require('./cursos.errors').ErrorYaInscripto;
const ErrorInscripcionNoViable = require('./cursos.errors').ErrorInscripcionNoViable

const validarYaInscripto = (req,res,next)=>{

    const id_curso = req.body.id;
    const id_alumno = req.body.id_alumno;

    const alumnosDelCurso = cursosController.obtenerAlumnosDelCurso(id_curso)
    .then(alumnos=>{
        const verificarPresencia = alumnos.recordset.findIndex(item=>item.id_alumno===id_alumno)

        if(verificarPresencia===-1){
            next();
        }else{
            res.status(400).send(`El alumno con id ${id_alumno} ya está inscripto en el curso ${id_curso}`)
        }
    }).catch(err=>{
        res.status(500).send(err.message)
    })
    
}

const validarPosibilidadesInscripcion = (req,res,next)=>{
    const {id,id_alumno,hora_individual} = req.body;

    cursosController.verificarPosibilidadInscripcion(id,id_alumno,hora_individual)
    .then(posibilidades=>{
        const resultado = posibilidades.recordset;

        if(resultado[0].error===null){
            next();
        }else{
            throw new ErrorInscripcionNoViable(resultado[0].error)
        }
    }).catch(err=>{
        res.status(500).send(err.message)
    })
}

cursoRouter.get('/all/:id_cuatrimestre',jwtAuthenticate,procesarErrores((req,res)=>{
    const cuatrimestre = req.params.id_cuatrimestre;

    return cursosController.obtenerCursos(cuatrimestre)
    .then(cursos=>{
        res.status(200).json(cursos.recordset)
    })
}))

cursoRouter.get('/cuatrimestre/:id',jwtAuthenticate,procesarErrores((req,res)=>{
    const id_cuatrimestre = req.params.id;

    return cursosController.obtenerCuatrimestreMoverAotraRuta(id_cuatrimestre)
    .then(cuatrimestre=>{
        res.status(200).json(cuatrimestre.recordset)
    })
}))

cursoRouter.get('/cuatrimestres/all',jwtAuthenticate,procesarErrores((req,res)=>{
    return cursosController.obtenerCuatrimestresMoverAotraRuta()
    .then(cuatrimestres=>{
        res.status(200).json(cuatrimestres.recordset)
    })
}))

/*
cursoRouter.get('/:id',(req,res)=>{
    const id = req.params.id;
    res.status(200).send(`get del curso ${id}`)
})
*/

cursoRouter.get('/curso/:id',jwtAuthenticate,procesarErrores((req,res)=>{
    const id = req.params.id;
    return cursosController.obtenerCurso(id)
    .then(curso=>{
        res.status(200).json(curso.recordset[0])
    })
}))

cursoRouter.get('/altasrecientes',jwtAuthenticate,procesarErrores((req,res)=>{
    return cursosController.obtenerUltimasAltas()
    .then(curso=>{
        res.status(200).json(curso.recordset)
    })
}))

cursoRouter.get('/curso/abm/:id',jwtAuthenticate,procesarErrores((req,res)=>{
    const id = req.params.id;
    console.log(`${JSON.stringify(req.body)} es el usuario que hace el request`)
    return cursosController.obtenerCursoCompleto(id)
    .then(curso=>{
        res.status(200).json(curso.recordset[0])
    })
}))


cursoRouter.post('/inscripcion',[jwtAuthenticate,
                                validarInscripcion,
                                validarYaInscripto,
                                validarPosibilidadesInscripcion],
     procesarErrores((req,res)=>{

    const {id,id_alumno,id_tipo_cursada,hora_individual} = req.body;
    
    return cursosController.inscribirAlumno(id,id_alumno,id_tipo_cursada,hora_individual)
    .then((resultado)=>{
        log.info(`Se inscribe al alumno con id ${id_alumno} en el curso ${id} con tipo de cursada ${id_tipo_cursada} y hora individual ${hora_individual}`)
        res.status(200).send("Inscripción realizada con éxito")
    })
}))


cursoRouter.post('/alumno/cambiohora',[jwtAuthenticate,validarCambioHorario],procesarErrores((req,res)=>{
    const {id,id_alumno,nuevohorario}= req.body;

    return cursosController.modificarHorarioIndividual(id,id_alumno,nuevohorario)
            .then((resultado)=>{
                res.status(200).send("Modificación realizada con éxito")
            })
}))

cursoRouter.delete('/alumno/:curso/:alumno',[jwtAuthenticate],procesarErrores((req,res)=>{
    const id = req.params.curso;
    const id_alumno = req.params.alumno;

    return cursosController.borrarAlumnoInscripto(id,id_alumno)
            .then((resultado)=>{
                res.status(200).send("El alumno fue eliminado del curso")
            })
}))

cursoRouter.get('/alumnos/:id',jwtAuthenticate,procesarErrores((req,res)=>{
    const id = req.params.id;

    return cursosController.obtenerAlumnosDelCurso(id)
    .then(alumnos=>{
        res.status(200).json(alumnos.recordset)
    })
}))

cursoRouter.get('/test',jwtAuthenticate,procesarErrores((req,res)=>{

    return cursosController.test()
    .then(respuesta=>{
        res.status(200).json(respuesta.recordset)
    })
}))


cursoRouter.post('/',[jwtAuthenticate,validarCurso],procesarErrores((req,res)=>{

    const curso = req.body;
    return cursosController.grabarCurso({curso:curso}) // paso los parámetros como un objeto, es otra forma de pasar parametros cuando uno o mas son opcionales. Aqui se aplica porque grabarCurso puede recibir o no el id segúns sea una modificación o un alta 
    .then((respuesta)=>{
        log.info(`Se crea el curso ${respuesta.nro_curso}`);
        log.info(`Curso creado ${JSON.stringify(respuesta)}`);
        res.status(200).json(respuesta.recordset[0])
        }
    )
}))

cursoRouter.put('/:id',[jwtAuthenticate,validarCurso],procesarErrores((req,res)=>{
   
    const curso = req.body;

    const idCursoRecibido = req.params.id;

    return cursosController.grabarCurso({curso:curso, id:idCursoRecibido}) // paso los parámetros como un objeto, es otra forma de pasar parametros cuando uno o mas son opcionales. Aqui se aplica porque grabarCurso puede recibir o no el id segúns sea una modificación o un alta 
    .then((respuesta)=>{
        log.info(`Se modifica el curso ${respuesta.nro_curso}`);
        log.info(`Curso modificado ${JSON.stringify(respuesta)}`);
        res.status(200).json(respuesta)
        }
    )

}))

module.exports = cursoRouter;