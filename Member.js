const db = require('./db');

class Member {
    constructor(name, email) {
        this.name = name;
        this.email = email;
    };


    insert_db(callback) {
        const insertQuery = `
            INSERT INTO members (name, email)
            VALUES (?, ?)
        `;

        const values = [this.name, this.email];
        db.connection.query(insertQuery, values, (err, results) => {
            if (err) {
                console.error('Erro ao inserir membro:', err);
                if (callback) callback(err);
                return;
            }
            console.log('membro inserido com sucesso');
            if (callback) callback(null, results);
        });
    }

    delete_db(memberId, callback) {
        const deleteQuery = 'DELETE FROM members WHERE id = ?';
        db.connection.query(deleteQuery, [memberId], (err, results) => {
            if (err) {
                console.error('Erro ao deletar membro:', err);
                if (callback) callback(err);
                return;
            }
            console.log('membro removido');
            if (callback) callback(null, results);
        });
    }
}

module.exports = Member;