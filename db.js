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
        CREATE TABLE IF NOT EXISTS membro (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) NOT NULL UNIQUE,
            nome VARCHAR(100) NOT NULL
        );
    `;
    connection.query(createTableQuery, (err, result) => {
        if (err) {
            console.error('Erro ao criar tabela "membro":', err);
            return;
        }
        console.log('Tabela "membro" criada.');
        if (callback) callback();
    });
};

const createTableTarefas = () => {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS tarefa (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nome VARCHAR(50) NOT NULL,
            descricao VARCHAR(140),
            finalizada BOOLEAN NOT NULL,
            data_termino DATETIME,
            prioridade ENUM('Baixa', 'Média', 'Alta') NOT NULL DEFAULT 'Baixa',
            idmembro INT,
            FOREIGN KEY (idmembro) REFERENCES membro(id)
        );
    `;
    connection.query(createTableQuery, (err, result) => {
        if (err) {
            console.error('Erro ao criar tabela "tarefa":', err);
            return;
        }
        console.log('Tabela "tarefa" criada.');
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
