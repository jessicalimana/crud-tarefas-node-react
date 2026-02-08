const express = require('express');
const app = express();
app.use(express.json());

app.get('/',(req, res)=> {
    res.send('Hello World!');
});

const tarefasRouter = require('./routes/tarefas');
app.use('/tarefas', tarefasRouter);

app.listen(3000, ()=>{
    console.log('Servidor rodando na porta 3000')
});

require('./db.js');