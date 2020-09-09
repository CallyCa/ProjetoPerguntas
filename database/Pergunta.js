const Sequelize = require('sequelize');
const connection = require("./database");

const Pergunta = connection.define('pergunta', {
    titulo: {
        type: Sequelize.STRING,
        allowNull: false
    },

    descricao: {
        type: Sequelize.TEXT,
        allowNull: false
    }

});

// Aqui ira sincronizar com o DB
Pergunta.sync({force: false}).then(() =>{});

module.exports = Pergunta;