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
