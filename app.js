const express = require('express');
const db = require('./db');

const app = express();
const PORT = 3000;


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




app.listen(PORT, () => {
    console.log(`Server running in http://localhost:${PORT}`)
})