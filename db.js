const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost', 
    user: 'root', 
    password: 'admin', 
});

const connect = (callback) => {
    connection.connect((err) => {
        if (err) {
            console.error('Erro ao conectar ao banco de dados:', err);
            return;
        }
        console.log('Conectado ao banco de dados!');
        if (callback) callback();
    });
};

const createDatabase = (dbName, callback) => {
    const createDBQuery = `CREATE DATABASE IF NOT EXISTS ${dbName};`;
    connection.query(createDBQuery, (err, result) => {
        if (err) {
            console.error('Erro ao criar banco de dados:', err);
            return;
        }
        console.log(`Banco de dados '${dbName}' criado`);

        connection.query(`USE ${dbName};`, (err) => {
            if (err) {
                console.error('Erro ao selecionar banco de dados:', err);
                return;
            }
            console.log(`Banco de dados '${dbName}' selecionado.`);
            createTableMembros(() => {
                createTableTarefas();
            });
        });
    });
};

const createTableMembros = (callback) => {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS members (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) NOT NULL UNIQUE,
            name VARCHAR(100) NOT NULL
        );
    `;
    connection.query(createTableQuery, (err, result) => {
        if (err) {
            console.error('Erro ao criar tabela "members":', err);
            return;
        }
        console.log('Tabela "members" criada.');
        if (callback) callback();
    });
};

const createTableTarefas = () => {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS tasks (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(50) NOT NULL,
            description VARCHAR(140),
            is_done BOOLEAN NOT NULL,
            done_date DATETIME,
            priority ENUM('Baixa', 'Média', 'Alta') NOT NULL DEFAULT 'Baixa',
            idmembro INT NOT NULL,
            FOREIGN KEY (idmembro) REFERENCES members(id) ON DELETE CASCADE
        );
    `;
    connection.query(createTableQuery, (err, result) => {
        if (err) {
            console.error('Erro ao criar tabela "tasks":', err);
            return;
        }
        console.log('Tabela "tasks" criada.');
    });
};

const closeConnection = () => {
    connection.end((err) => {
        if (err) {
            console.error('Erro ao finalizar conexão com o banco de dados:', err);
            return;
        }
        console.log('Conexão com o banco de dados finalizada.');
    });
};

module.exports = {
    connect,
    createDatabase,
    createTableMembros,
    createTableTarefas,
    closeConnection,
    connection, 
};
