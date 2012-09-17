var UserModel = require('../model/user.js');

exports.list = function(req, res) {
    console.log("GET Llista users");

	UserModel.find().sort('-name').exec(function(error, user) {
		//Retornem jsonp
		//res.setHeader('Content-Type', 'text/javascript;charset=UTF-8');
        //res.send(req.query["callback"] + '({"records":' +  JSON.stringify(cacera) + '});');
		//Retornem json normal
		res.send(user);
    });
}

exports.save = function(req, res) {
	console.log("POST: Creació usuari.");
	
	var usuari = new UserModel({
		nom: req.body.nom,
	    email: req.body.info,
		password: req.body.logo,
		avatar: req.body.publica,
		token: req.body._usuari,
		modified: req.body.datahora
  	});
    usuari.save(function (err) {
        if (err) console.log("[E][Controlador Usuaris] "+err);
        console.log("[I][Controlador Usuaris] Nova usuari: "+usuari._id);
	    //res.send('Cacera saved.');
		console.log(usuari);
		res.contentType('json');
        //res.send(req.query["callback"] +'({"result":' + JSON.stringify("ok") + '});');
		res.send(usuari._id);
    });
}

exports.show = (function(req, res) {
    UserModel.findOne({_id: req.params.id}, function(error, user) {
        console.log(user);
		//res.setHeader('Content-Type', 'text/javascript;charset=UTF-8');
		//res.send(req.query["callback"] +'({"records":' + JSON.stringify(user) + '});');
		res.send([{User: user}]);
    })
});

exports.delete = function(req, res) {
    console.log("DELETE ALL users");
	//var url_parts = url.parse(req.url, true);
		
	UserModel.remove(function(err) {
		res.send("ALL Users deleted ok");
    });
}