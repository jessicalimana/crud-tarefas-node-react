const express = require('express');
const router = express.Router();
const Tarefa = require('../models/Tarefa');

//GET - estou usando para listar todas minhas tarefas
router.get('/', async (req, res)=>{
    try {
        const tarefas = await Tarefa.find();
        res.json(tarefas);
    } catch(err){
        res.status(500).json({ message: err.message});
    }
});

//POST - vou usar para criar uma nova tarefa
router.post('/', async (req, res)=> {
    const tarefa = new Tarefa ({
        titulo: req.body.titulo
    });
    try {
        const novaTarefa = await tarefa.save();
        res.status(201).json(novaTarefa);
    } catch (err){
        res.status(400).json({ message: err.message});
    }
});

//PUT - com esse vou atualizar uma tarefa para concluida ou nao
router.put('/:id', async (req, res)=> {
    try {
        const tarefa = await Tarefa.findByIdAndUpdate(
            req.params.id,
            {completa: req.body.completa},
            {new: true}
        );

        if (!tarefa){
            return res.status(404).json({message:'Tarefa não encontrada'});
        }

        res.json(tarefa);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
});

//DELETE
router.delete('/:id', async (req, res)=>{
    try {
        const tarefa = await Tarefa.findByIdAndDelete(req.params.id);

        if(!tarefa) {
            return res.status(404).json({message: 'Tarefa não encontrada'});
        }
        res.json({message: 'Tarefa deletada com sucesso'});
    } catch(err) {
        res.status(500).json({message: err.message});
    }
});

module.exports = router;
