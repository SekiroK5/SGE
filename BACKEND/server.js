require("dotenv").config(); // cargar variables de entorno

const app = require('./index.js') // importacion de la app express
const conectarDB = require('./config/mongo.js');// importacion de la coneccion a la bd

conectarDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>{
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
})