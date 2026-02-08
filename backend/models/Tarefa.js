const mongoose = require('mongoose');

const TarefaSchema = new mongoose.Schema({
    titulo: { type: String, requided: true},
    completa: { type: Boolean, default: false}
});

module.exports = mongoose.model('Tarefa', TarefaSchema);