const { Schema, model } = require('mongoose');

const clienteSchema = new Schema({
  idauditoria: Number,
  nombre: String,
  telefono: String,
  

}, {
  timestamps: true
});
// auditoriaSchema.plugin(require('mongoose-autopopulate'));
module.exports = model('Auditoria', clienteSchema, 'auditorias');
