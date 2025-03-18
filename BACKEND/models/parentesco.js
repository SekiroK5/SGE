const mongoose = require('mongoose');

const parentescoSchema = new mongoose.Schema({
  TipoParentesco: { type: String, required: true }
});

const Parentesco = mongoose.model('Parentesco', parentescoSchema,'Parentesco');

module.exports = Parentesco;