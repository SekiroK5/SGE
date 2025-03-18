const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || "GIAVANA8721"; // Usar la misma clave secreta

const verifyToken = (req, res, next) => {
    // Obtener el token del encabezado de autorización
    const bearerHeader = req.headers['authorization'];
    
    if (!bearerHeader) {
        return res.status(403).json({ error: "Se requiere token de autenticación" });
    }
    
    // Extraer el token (formato: "Bearer TOKEN")
    const token = bearerHeader.split(' ')[1];
    
    if (!token) {
        return res.status(403).json({ error: "Formato de token inválido" });
    }
    
    try {
        // Verificar el token
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Guardar los datos del usuario en la solicitud
        req.user = decoded;
        
        // Continuar con la siguiente función
        next();
    } catch (error) {
        console.error("Error al verificar token:", error);
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: "Token expirado, inicie sesión nuevamente" });
        }
        
        return res.status(401).json({ error: "Token inválido" });
    }
};

module.exports = verifyToken;