const db = require('./db');

class Task {
    constructor(name, desc, isDone, priority, memberId) {
        this.name = name;
        this.desc = desc;
        this.isDone = isDone;
        this.priority = priority;
        this.memberId = memberId;
    }    


    insert_db(callback) {
        const doneDate = this.isDone ? new Date() : null;
        this.isDone = this.isDone=="true" ? true : false;

        const insertQuery = `
            INSERT INTO tasks (name, description, is_done, priority, done_date, idmembro)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        const values = [this.name, this.desc, this.isDone, this.priority, doneDate, this.memberId];

        db.connection.query(insertQuery, values, (err, results) => {
            if (err) {
                console.error('Erro ao inserir tarefa:', err);
                // if (callback) callback(err);
                return;
            }
            console.log('Tarefa inserida com sucesso');
            if (callback) callback(null, results);
        });
    }
    update_db(taskId, callback) {
        const doneDate = this.isDone ? new Date() : null;
        this.isDone = this.isDone=="true" ? true : false;

        const updateQuery = `
            UPDATE tasks
            SET name = ?, description = ?, is_done = ?, priority = ?, done_date = ?, idmembro = ?
            WHERE id = ?
        `;

        const values = [this.name, this.desc, this.isDone, this.priority, doneDate, this.memberId, taskId];

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
    update_isdone_db(taskId, callback) {
        const doneDate = this.isDone ? new Date() : null;
        this.isDone = this.isDone=="true" ? true : false;

        const updateQuery = `
            UPDATE tasks
            SET is_done = ?, done_date = ?
            WHERE id = ?
        `;
    
        const values = [this.isDone, doneDate, taskId];
    
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