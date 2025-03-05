require('dotenv').config();

const express = require('express');
const cors = require('cors');

//Rutas 
const authRoutes = require('./routes/auth.js'); //importa las rutas de auth

const app = express();

//Midlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Rutas
app.use('/auth',authRoutes);// Monta las rutas bajo el prefijo de  '/auth'

//Mensaje que confirma las rutas
console.log("Rutas de autenticación cargadas en /auth");

module.exports = app;