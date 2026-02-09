const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

app.get('/',(req, res)=> {
    res.send('Hello World!');
});

const tarefasRouter = require('./routes/tarefas');
app.use('/tarefas', tarefasRouter);

const authRouter = require('./routes/auth');
app.use('/auth', authRouter);

app.listen(3000, ()=>{
    console.log('Servidor rodando na porta 3000')
});

require('./db.js');