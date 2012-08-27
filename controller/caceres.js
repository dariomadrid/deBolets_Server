var CaceraModel = require('../model/cacera.js');

exports.post = function(req, res) {
    var cacera = new CaceraModel({name: req.body.name, description: req.body.descr,
        longitude: req.body.longitude, latitude: req.body.latitude});
    cacera.save(function (err) {
        if (err) throw err;
        console.log('Task saved.');
        
        res.send('Cacera saved.');
    });
}

exports.save = function(req, res) {
	console.log("POST: Creació cacera.");
    /*var cacera = new CaceraModel({name: req.params.name, description: req.params.descr,
        longitude: req.params.longitude, latitude: req.params.latitude});
	*/	
	var cacera = new CaceraModel({
    	id: req.body.id,
		nom: req.body.nom,
	    info: req.body.info,
		logo: req.body.logo,
	    datahora: req.body.datahora
  	});
    cacera.save(function (err) {
        if (err) throw err;
        console.log('Cacera saved.');
	    res.send('Cacera saved.');
    });
}

exports.list = function(req, res) {
    console.log("GET Llista caceres");
	console.log("Date now="+Date.now());
	//var url_parts = url.parse(req.url, true);
	var page = req.query["page"];
	var limit = req.query["limit"];
	var start = req.query["start"];
	
	console.log("page="+page);
	console.log("limit="+limit);
	console.log("start="+start);	

	/*CaceraModel.find("","",{skip: 1, limit: 10}, function(err, cac) {
	res.setHeader('Content-Type', 'text/javascript;charset=UTF-8');
        res.send(req.query["callback"] + '({"records":' +  JSON.stringify(cac) + '});');
    });*/
//	CaceraModel.find().sort('-datahora').skip(0,10).exec(function(err, cacera) {
	CaceraModel.find().sort('-datahora').skip(start,start+limit).limit(limit).exec(function(err, cacera) {		
		//Retornem jsonp
	//	res.setHeader('Content-Type', 'text/javascript;charset=UTF-8');
    //    res.send(req.query["callback"] + '({"records":' +  JSON.stringify(cacera) + '});');
		//Retornem json normal
		res.send(cacera);
    });
}

exports.list2 = function(req, res) {
    console.log("GET Llista caceres infinita");
	//var url_parts = url.parse(req.url, true);
	
	if (req.query["last_displayed_date"] != null)
		var last_displayed_date = req.query["last_displayed_date"];
	else var last_displayed_date = Date.now();
	console.log(last_displayed_date);
	
	CaceraModel.find().where('datahora').lt(last_displayed_date).sort('-datahora').exec(function(err, cacera) {
		//Retornem jsonp
		//res.setHeader('Content-Type', 'text/javascript;charset=UTF-8');
        //res.send(req.query["callback"] + '({"records":' +  JSON.stringify(cacera) + '});');
		//Retornem json normal
		res.send(cacera);
    });
}

exports.show = (function(req, res) {
    CaceraModel.findOne({_id: req.params.id}, function(error, cacera) {
        console.log(cacera);
		res.setHeader('Content-Type', 'text/javascript;charset=UTF-8');
		res.send(req.query["callback"] +'({"records":' + JSON.stringify(cacera) + '});');
		//res.send([{Dog: Cacera}]);
    })
});

exports.delete = function(req, res) {
    console.log("DELETE ALL caceres");
	//var url_parts = url.parse(req.url, true);
		
	CaceraModel.remove(function(err) {
		res.send("ALL Caceres deleted ok");
    });
}

exports.esborrar = function(req, res) {
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