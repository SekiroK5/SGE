const bcryptjs = require('bcryptjs');

/**
 * Contrasena para encriptar
 * @param {*} paswordPlane
 */

const encript = async (passwordPlane, salt) =>{
    const hash = await bcryptjs.hash(passwordPlane, 10)

    return hash
}

/**
 * Pasar la contrasena sin encriptar y pasar contrasena encriptada
 * @param {*} passwordPlane
 * @param {*} hashPassword
 */

const compare = async (passwordPlane, hashPassword) => {
    return await bcryptjs.compare(passwordPlane,hashPassword)
}

module.exports = {encript, compare};