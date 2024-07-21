const db = require('./db');

class Task {
    constructor(name, desc, isDone, priority) {
        this.name = name;
        this.desc = desc;
        this.isDone = isDone;
        this.priority = priority;
    };


    insert_db(callback) {
        const doneDate = this.isDone ? new Date() : null;
        this.isDone = this.isDone=="true" ? true : false;

        const insertQuery = `
            INSERT INTO tasks (name, description, is_done, priority, done_date)
            VALUES (?, ?, ?, ?, ?)
        `;

        const values = [this.name, this.desc, this.isDone, this.priority, doneDate];
        db.connection.query(insertQuery, values, (err, results) => {
            if (err) {
                console.error('Erro ao inserir tarefa:', err);
                if (callback) callback(err);
                return;
            }
            console.log('Tarefa inserida com sucesso, ID:');
            if (callback) callback(null, results);
        });
    }
    update_db(taskId, callback) {
        const doneDate = this.isDone ? new Date() : null;
        this.isDone = this.isDone=="true" ? true : false;

        const updateQuery = `
            UPDATE tasks
            SET name = ?, description = ?, is_done = ?, priority = ?, done_date = ?
            WHERE id = ?
        `;
        const values = [this.name, this.desc, this.isDone, this.priority, doneDate, taskId];
    
        db.connection.query(updateQuery, values, (err, results) => {
            if (err) {
                console.error('Erro ao atualizar tarefa:', err);
                if (callback) callback(err);
                return;
            }
            console.log('Tarefa atualizada');
            if (callback) callback(null, results);
        });
    }

    delete_db(taskId, callback) {
        const deleteQuery = 'DELETE FROM tasks WHERE id = ?';
        db.connection.query(deleteQuery, [taskId], (err, results) => {
            if (err) {
                console.error('Erro ao deletar tarefa:', err);
                if (callback) callback(err);
                return;
            }
            console.log('Tarefa removida');
            if (callback) callback(null, results);
        });
    }
}

module.exports = Task;