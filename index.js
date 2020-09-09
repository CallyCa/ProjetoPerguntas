const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const Pergunta = require('./database/Pergunta');
const Resposta = require("./database/Resposta");

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
    // com o raw: true ele ira ignorar outros dados desnecessarios que iriam aparecer junto com as perguntas
    // order [''] ira organizar os dados das perguntar em Crescente ou Decrescente 
    Pergunta.findAll({raw: true, order:[
        ['id','DESC']
    ]}).then(pergunta =>{
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

// Rota para a pergunta especifica

app.get("/pergunta/:id",(req,res) => {
    var id = req.params.id;
    // findOne({ }) ira buscar no BD apenas um dado e mostar apenas um dado
    Pergunta.findOne({
        where: {id: id}
    }).then(pergunta => {
        if(pergunta != undefined){  // achou a pergunta

            Resposta.findAll({ // ira pegar todas as respostas que possuem o id = ao campo
                where: {perguntaId: pergunta.id},
                order: [
                    ['id', 'DESC']
                ]
            }).then(respostas => {
                res.render("pergunta", {
                    pergunta: pergunta,
                    respostas: respostas
                });
            });

        }else{ // nao encontrou a pergunta
            res.redirect("/");

        }
    });
})

app.post("/responder",(req,res) =>{
    var corpo  = req.body.corpo;
    var perguntaId = req.body.pergunta;
    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(() => {
        res.redirect("/pergunta/"+perguntaId);

    });
});

app.listen(3000,() =>{
    console.log("app rodando em http://localhost:3000");
});