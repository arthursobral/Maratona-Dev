//configurando o servidor
const express = require("express");
const server = express();

//configurar o servidor para apresentar arq estaticos
server.use(express.static('public'));

//habilitar o uso do body do formulario
server.use(express.urlencoded({extended: true}));

//configurar a conexao com o banco de dados
const Pool = require('pg').Pool;
const db = new Pool({
    user: 'postgres',
    password: '4526',
    host: 'localhost',
    porta: 5432,
    database: 'doe',
});


//configurando a template engine nunjucks
const nunjucks = require("nunjucks");
nunjucks.configure("./", {
    express: server,
    noCache: true,
});

server.get("/", function(req,res){
    db.query("select * from donors", function(err, result){
        if(err) return res.send("Erro no banco de dados.");
        
        const donors = result.rows;

        return res.render("index.html", {donors});
    })
});

server.post("/",function(req,res){
    //pegando os dados do formulario
    const name = req.body.name;
    const email = req.body.email;
    const blood = req.body.blood;

    if(name=="" || email == "" || blood == ""){
        return res.send("Todos os campos obrigatórios.");
    }

    //colocando dados dentro do banco de dados
    const query = `insert into donors ("name","email","blood") 
        values ($1,$2,$3)`;

    const values = [name,email,blood];

    db.query(query,values, function(err){
        if(err){
            return res.send("Erro no banco de dados.");
        }

        return res.redirect("/");
    });
});

server.listen(3000);