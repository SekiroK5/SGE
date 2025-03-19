const mongoose = require('mongoose');

const puestoSchema = new mongoose.Schema({
  Nombre: String,
  Descripcion: String
});

const departamentoSchema = new mongoose.Schema({
  NombreDepartamento: { type: String, required: true },
  Descripcion: { type: String, required: true },
  Puestos: [puestoSchema] // Este es el arreglo de puestos
});

const Departamento = mongoose.model('Departamento', departamentoSchema,'Departamento');

module.exports = Departamento;