const express = require('express');
const db = require('./db');
const Task = require('./Task')

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

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
    res.render('index');
});

app.get('/tasks', (req, res) => {
    const selectQuery = 'SELECT * FROM tasks'; 

    db.connection.query(selectQuery, (err, results) => {
        if (err) {
            console.error('Erro ao buscar tarefas:', err);
            return res.status(500).send('Erro ao buscar tarefas');
        }

        res.render('taskList', { tasks: results });
    });
});

app.get('/newtask', (req, res) => {
    res.render('newTask');
})
app.post('/addTask', (req, res) => {
    const { name, desc, isDone, priority } = req.body;
    const newtask = new Task(name, desc, isDone, priority);
    newtask.insert_db((err, result) => {
        if (err) {
            console.error('Erro ao inserir a tarefa:', err);
        } else {
            console.log('Tarefa inserida com sucesso:', result);
        }
    });

    res.redirect('/tasks');
})


app.get('/editTask/:id', (req, res) => {
    const taskId = req.params.id;

    const selectQuery = 'SELECT * FROM tasks WHERE id = ?';
    db.connection.query(selectQuery, [taskId], (err, results) => {
        if (err) {
            console.error('Erro ao buscar tarefa:', err);
            return res.status(500).send('Erro ao buscar tarefa');
        }
        if (results.length === 0) {
            return res.status(404).send('Tarefa não encontrada');
        }
        res.render('editTask', { task: results[0] });
    });
});
app.post('/editTask/:id', (req, res) => {
    const { name, desc, isDone, priority } = req.body;
    const newtask = new Task(name, desc, isDone, priority);
    newtask.update_db(req.params.id, (err, result) => {
        if (err) {
            console.error('Erro ao atualizar a tarefa:', err);
        } else {
            console.log('Tarefa atualizada com sucesso:', result);
        }
    });

    res.redirect('/tasks');
});

app.post('/deleteTask/:id', (req, res) => {
    const { name, desc, isDone, priority } = req.body;
    const newtask = new Task(name, desc, isDone, priority);
    newtask.delete_db(req.params.id, (err, result) => {
        if (err) {
            console.error('Erro ao deletar a tarefa:', err);
        } else {
            console.log('Tarefa deletada com sucesso:', result);
        }
    });

    res.redirect('/tasks');
});

app.listen(PORT, () => {
    console.log(`Server running in http://localhost:${PORT}`)
})