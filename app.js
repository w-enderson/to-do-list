const express = require('express');
const db = require('./db');
const Task = require('./Task')
const Member = require('./Member')
const session = require('express-session');


const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(session({
    secret: 'ODM32IQJE0923JE0QDX02D9J3E33',
    resave: false,
    saveUninitialized: true,
}));


db.connect(() => {
    db.createDatabase('todo_list_db');
});

function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next(); 
    }
    res.redirect('/'); 
}

app.get('/', (req, res) => {
    res.render('login');
});


app.post('/login', (req, res) => {
    const { email } = req.body;

    const selectQuery = 'SELECT * FROM members WHERE email = ?';
    db.connection.query(selectQuery, [email], (err, results) => {
        if (err) {
            console.error('Erro ao verificar email:', err);
            return res.status(500).send('Erro ao verificar email');
        }
        
        if (results.length > 0) {
            const member = results[0];
            req.session.user = { username: member.name, email: member.email, id: member.id }; 
            res.redirect('/home'); 
        } else {
            res.send('Credenciais inválidas');
        }
    });
});
app.get('/home', isAuthenticated, (req, res) => {
    res.render('home', {username: req.session.user.username} );
});

app.get('/tasks', isAuthenticated, (req, res) => {
    const selectQuery = `
        SELECT tasks.*, members.id AS memberId, members.name AS memberName
        FROM tasks
        LEFT JOIN members ON tasks.idmembro = members.id 
    `;
    db.connection.query(selectQuery, (err, results) => {
        if (err) {
            console.error('Erro ao buscar tarefas:', err);
            return res.status(500).send('Erro ao buscar tarefas');
        }
        res.render('taskList', { tasks: results, currentUserId: req.session.user.id });
    });
});
app.get('/newtask', isAuthenticated, (req, res) => {
    res.render('newTask');
})

app.post('/addTask', isAuthenticated, (req, res) => {
    const { name, desc, isDone, priority } = req.body;

    const newtask = new Task(name, desc, isDone, priority, req.session.user.id);
    
    newtask.insert_db((err, result) => {
        if (err) {
            console.error('Erro ao inserir a tarefa:', err);
        } else {
            console.log('Tarefa inserida com sucesso:', result);
        }
    });

    res.redirect('/tasks');
})


app.get('/editTask/:id', isAuthenticated, (req, res) => {
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
app.post('/editTask/:id', isAuthenticated, (req, res) => {
    const { name, desc, isDone, priority } = req.body;
    const newtask = new Task(name, desc, isDone, priority, req.session.user.id);
    newtask.update_db(req.params.id, (err, result) => {
        if (err) {
            console.error('Erro ao atualizar a tarefa:', err);
        } else {
            console.log('Tarefa atualizada com sucesso:', result);
        }
    });

    res.redirect('/tasks');
});
app.post('/updateTaskStatus/:id', isAuthenticated, (req, res) => {
    const taskId = req.params.id;
    const { is_done } = req.body;

    const newtask = new Task('', '', is_done, '', req.session.user.id);
    newtask.update_isdone_db(taskId, (err, result) => {
        if (err) {
            console.error('Erro ao atualizar o status da tarefa:', err);
        } else {
            console.log('Status da tarefa atualizado com sucesso:', result);
        }
    });

    res.redirect('/tasks');
});


app.post('/deleteTask/:id', isAuthenticated, (req, res) => {
    const { name, desc, isDone, priority } = req.body;
    const newtask = new Task(name, desc, isDone, priority, req.session.user.id);
    newtask.delete_db(req.params.id, (err, result) => {
        if (err) {
            console.error('Erro ao deletar a tarefa:', err);
        } else {
            console.log('Tarefa deletada com sucesso:', result);
        }
    });

    res.redirect('/tasks');
});


app.get('/newMember',(req, res) => {
    res.render('newMember'); 
});
app.post('/newMember', (req, res) => {
    const { name, email } = req.body;

    const newMember = new Member(name, email);
    newMember.insert_db((err, result) => {
        if (err) {
            console.error('Erro ao inserir membro:', err);
            return res.status(500).send('Email já existe');
        }
        console.log('Membro cadastrado com sucesso:', result);
        res.redirect('/'); 
    });
});



app.listen(PORT, () => {
    console.log(`Server running in http://localhost:${PORT}`)
})