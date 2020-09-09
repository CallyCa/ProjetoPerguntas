const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const Pergunta = require('./database/Pergunta')

// Database

connection
    .authenticate()
    .then(() => {
        console.log("Conexao feita com o banco de dados");

    })
    .catch((msgErro) => {
        console.log(msgErro);
    })

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());

// Informando as rotas

app.get("/",(req,res) => {
    // Pergunta.findAll() é como se fosse select * from pergunta;
    Pergunta.findAll({raw: true}).then(pergunta =>{
        res.render("index",{
            pergunta: pergunta
        });
    });
});

app.get("/perguntar", (req, res) => {
    res.render("perguntar");
})
// Aqui ira receber os dados do form
app.post("/salvarpergunta", (req,res) =>{
    var titulo = req.body.titulo;
    var descricao = req.body.descricao;
    // Aqui ira ser responsavel por salvar uma pergunta no DB
    // é como se fosse colocar Insert into perguntas ... values('') no DB;
    Pergunta.create({
        titulo: titulo,
        descricao: descricao,
        //Aqui redireciona o user para a page principal
    }).then(() => {
        res.redirect("/");

    })

});

app.listen(3000,() =>{
    console.log("app rodando em http://localhost:3000");
});