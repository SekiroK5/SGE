const mongoose = require('mongoose');

const DocumentoSchema = new mongoose.Schema({
    TipoDocumento: String,
    Descripcion: String
});

module.exports = mongoose.model('Documento', DocumentoSchema);
