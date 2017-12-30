var express = require('express');
var path    = require("path");
var bodyParser = require('body-parser');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/'));
//app.use(express.json());
//app.use(express.urlencoded());
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

/*
//------ DataBase
const Sequelize = require('sequelize');
const sequelize = new Sequelize('postgres', 'postgres', 'postgres', {
  host: 'localhost',
  dialect: 'postgres',

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});

sequelize.authenticate().then(() => {
	console.log('Connection has been established successfully.');
}).catch(err => {
	console.error('Unable to connect to the database:', err);
});

const PassageiroBD = sequelize.define('passageiro', {
  nome: {
    type: Sequelize.STRING
  },
  dt_nascimento: {
    type: Sequelize.DATE
  },
  cpf: {
    type: Sequelize.BIGINT
  },
  telefone: {
    type: Sequelize.STRING
  }
});

const VeiculoBD = sequelize.define('veiculo', {
  descricao: {
    type: Sequelize.STRING
  },
  qtd_filas: {
    type: Sequelize.INTEGER
  },
  qtd_pessoas_fila: {
    type: Sequelize.INTEGER
  },
  acentos_inexistentes: {
    type: Sequelize.STRING
  }
});


PassageiroBD.sync({force: false}).then(() => {
  // Table created
  return PassageiroBD.create({
    nome: 'Teste2',
    dt_nascimento: new Date(),
    cpf: 11111111112,
    telefone: '(86)2999-9999'
  });
});

VeiculoBD.sync({force: true});

//------ Classes POJO
class Passageiro {
	constructor(objBd) {
	    this.nome = objBd.nome;
	    this.dataNascimento = objBd.dt_nascimento;
	    this.cpfRg = objBd.cpf;
	    this.telefone = objBd.telefone;
  	}
}

//------ Consultas
PassageiroBD.findAll().then(passageiros => {
	for (var p in passageiros) {
		console.log(new Passageiro(passageiros[p].dataValues));
	}
});
*/



//------ Routes
app.get('/',function(req,res){
	//console.log('request -> /', res);
  	//res.sendFile(path.join(__dirname+'/public/pages/index.html'));
  	res.sendFile(path.join(__dirname+'/index.html'));
});

app.post('/email',function(req,res){
	console.log('request -> /', req.body);
	var name = req.body.name;
	var phone = req.body.phone;
	var msg = req.body.msg;

	var result = { status: false };

 	require('gmail-send')({
		user: "canyonpotyturismo@gmail.com",
		pass: "canyon123",
		to:   "canyonpotyturismo@gmail.com",
		subject: "Contato do Site: "+name,
		text: "Nome: "+ name + ".\nTelefone: " + phone + ".\nMengasem: " + msg
	})({}, function (err, resp) {
		console.log('* [example 1.1] send() callback returned: err:', err, '; res:', resp);
		if (err) {
			result.msg = "Ocorreu um erro ao enviar o e-mail, por favor, tente novamente.";
		} else {
			result.status = true;
			result.msg = "Mensagem enviada com sucesso!";
		}
		res.json(result);
	});
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
})
