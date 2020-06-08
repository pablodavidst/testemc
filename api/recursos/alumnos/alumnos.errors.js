class ErrorDeBaseDeDatos extends Error {
    constructor(message){ // el mensaje es opcional...se incluye o no al hacer new...
        super(message);
        this.message = message || 'Error en la base de datos';
        this.status=500;
        this.name='basededatos'
    }
}

class ParametrosEntradaIncompletos extends Error {
    constructor(message){ // el mensaje es opcional...se incluye o no al hacer new...
        super(message);
        this.message = message || 'Los parámetros de la petición son insuficientes';
        this.status=400;
        this.name='parametrosEntrada'
    }
}

module.exports = {
    ErrorDeBaseDeDatos,
    ParametrosEntradaIncompletos
}