class ErrorDeBaseDeDatos extends Error {
    constructor(message){ // el mensaje es opcional...se incluye o no al hacer new...
        super(message);
        this.message = message || 'Error en la base de datos';
        this.status=500;
        this.name='basededatos'
    }
}

class ErrorYaInscripto extends Error {
    constructor(message){ // el mensaje es opcional...se incluye o no al hacer new...
        super(message);
        this.message = message || 'El alumno ya se encuentra inscripto en el curso';
        this.status=500;
        this.name='yainscripto'
    }
}

class ErrorInscripcionNoViable extends Error {
    constructor(message){ // el mensaje es opcional...se incluye o no al hacer new...
        super(message);
        this.message = message || 'No es posible inscribir al alumno por cupo o por superposición de horarios';
        this.status=401;
        this.name='inscripcionNoViable'
    }
}

module.exports = {
    ErrorDeBaseDeDatos,ErrorYaInscripto,ErrorInscripcionNoViable
}