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

exports.show = (function(req, res) {
    UserModel.findOne({_id: req.params.id}, function(error, user) {
        console.log(user);
		res.setHeader('Content-Type', 'text/javascript;charset=UTF-8');
		res.send(req.query["callback"] +'({"records":' + JSON.stringify(user) + '});');
		//res.send([{Dog: Cacera}]);
    })
});

exports.delete = function(req, res) {
    console.log("DELETE ALL users");
	//var url_parts = url.parse(req.url, true);
		
	UserModel.remove(function(err) {
		res.send("ALL Users deleted ok");
    });
}