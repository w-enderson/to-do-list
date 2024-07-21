const express = require('express');
const db = require('./db');
const Task = require('./Task')

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

db.connect(() => {
    db.createDatabase('todo_list_db', () => {
        const selectQuery = 'SELECT * FROM membro;';

        db.connection.query(selectQuery, (err, results) => {
            if (err) {
                console.error('Erro ao buscar membros:', err);
                return;
            }
            console.log('Dados dos membros:', results);
        });
    });
});


app.get('/', (req, res) => {
    res.send('Todo list');
});

app.post('/addTask', (req, res) => {
    const { name, desc, isDone, priority } = req.body;
    const newtask = new Task();
    newtask.insert_db((err, result) => {
        if (err) {
            console.error('Erro ao inserir a tarefa:', err);
        } else {
            console.log('Tarefa inserida com sucesso:', result);
        }
    });
})



app.listen(PORT, () => {
    console.log(`Server running in http://localhost:${PORT}`)
})