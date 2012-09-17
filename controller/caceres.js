var CaceraModel = require('../model/cacera.js');

exports.save = function(req, res) {
	console.log("POST: Creació cacera.");
	
	var cacera = new CaceraModel({
		nom: req.body.nom,
	    info: req.body.info,
		logo: req.body.logo,
	    datahora: req.body.datahora,
	//	posicions:[posicions],
		publica: req.body.publica,
		_usuari: req.body._usuari
  	});
    cacera.save(function (err) {
        if (err) console.log("[E][Controlador Caceres] "+err);
        console.log("[I][Controlador Caceres] Nova cacera: "+cacera._id);
	    //res.send('Cacera saved.');
		console.log(cacera);
		res.contentType('json');
        //res.send(req.query["callback"] +'({"result":' + JSON.stringify("ok") + '});');
		res.send(cacera._id);
    });
}
/* Funcio per proxy especial de caceres */
exports.save2 = function(req, res) {
	console.log("POST: Creació cacera local "+req.params._id+" .");

	var cacera = new CaceraModel({
		nom: req.body.nom,
	    info: req.body.info,
		logo: req.body.logo,
	    datahora: req.body.datahora,
		posicions: req.body.posicions,
		publica: req.body.publica,
		_usuari: req.body._usuari
  	});
    cacera.save(function (err) {
        if (err) throw err;
        console.log('Cacera saved.');
	    res.send('Cacera saved.');
    });
}


exports.list = function(req, res) {
    console.log("GET Llista caceres");

	var page = req.query["page"];
	var limit = req.query["limit"];
	var start = req.query["start"];	

	CaceraModel.find().sort('-datahora')
				.populate('_usuari', 'nom avatar')
				.select('nom info logo datahora _usuari')
				.skip(start,start+limit).limit(limit)
				.exec(function(err, cacera) {		
					//cacera.info = "daksjdklñasjdlkasjkldjas";
					//Retornem jsonp
					res.setHeader('Content-Type', 'text/javascript;charset=UTF-8');
					res.contentType('json');
					res.send(cacera);
					//res.contentType('json');
			        //res.send(req.query["callback"] + '({"records":' +  JSON.stringify(cacera) + '});');
				});
}

exports.list_comunitat = function(req, res) {
    console.log("GET Llista caceres comunitat (públiques)");

	var page = req.query["page"];
	var limit = req.query["limit"];
	var start = req.query["start"];	

	// Allow Cross Domain Request from anywhere...
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");

	CaceraModel.find().sort('-datahora').where('publica')
				.equals(true).populate('_usuari', 'nom avatar')
				.select('nom info logo datahora _usuari')
				.skip(start,start+limit).limit(limit)
				.exec(function(err, cacera) {		
					cacera.info = "daksjdklñasjdlkasjkldjas";
					//Retornem json
					//res.setHeader('Content-Type', 'text/javascript;charset=UTF-8');
					//res.send(cacera);
					//Retornem jsonp
					res.contentType('json');
			        res.send(req.query["callback"] + '({"records":' +  JSON.stringify(cacera) + '});');
				});
}

exports.show = (function(req, res) {
    CaceraModel.findOne({_id: req.params.id}, function(error, cacera) {
        console.log(cacera);
		res.setHeader('Content-Type', 'text/javascript;charset=UTF-8');
		res.send(req.query["callback"] +'({"records":' + JSON.stringify(cacera) + '});');
		//res.send([{Dog: Cacera}]);
    });
})

exports.put = function (req, res) {
	return CaceraModel.findById(req.params.id, function (err, cacera) {
		cacera.nom = req.body.nom;
		cacera.info = req.body.info;
		cacera.logo = req.body.logo;
		cacera.datahora = req.body.datahora;
		cacera.posicions = req.body.posicions;
		cacera.publica = req.body.publica;
		cacera._usuari = req.body._usuari;
		
		return cacera.save(function (err) {
			if (!err) {
	    		console.log("[I][Controlador Caceres] Actualitzada cacera: "+req.params.id);
				//return res.send(cacera);
				res.setHeader('Content-Type', 'text/javascript;charset=UTF-8');
				res.send(req.query["callback"] +'({"records":' + JSON.stringify(cacera) + '});');
	  		} else {
	    		console.log("[E][Controlador Caceres] "+err);
	  		}
		});
	});
}

exports.delete = function(req, res) {
	console.log("DELETE Cacera: "+req.params.id)
	return ProductModel.findById(req.params.id, function (err, product) {
		return product.remove(function (err) {
  			if (!err) {
    			console.log("[I][Controlador Caceres] Esborrada cacera: "+req.params.id);
    			//return res.send(cacera);
				res.setHeader('Content-Type', 'text/javascript;charset=UTF-8');
				res.send(req.query["callback"] +'({"records":' + JSON.stringify("ok") + '});');
  			} else {
    			console.log("[E][Controlador Caceres]: "+err);
  			}
		});
	});
}

exports.delete_all_per_user = function(req, res) {
    console.log("DELETE ALL caceres");
	//var url_parts = url.parse(req.url, true);
		
	CaceraModel.remove(function(err) {
		res.send("ALL Caceres deleted ok");
    });
}

exports.near = function(req, res) {
    CaceraModel.find({coords : { $near : [req.params.lon, req.params.lat], $maxDistance : req.params.dist/68.91}}, function (error, cacera) {        
        res.setHeader('Content-Type', 'text/javascript;charset=UTF-8');
        res.send(req.query["callback"] +'({"records":' + JSON.stringify(cacera) + '});');
    })
}