var mongoose = require('mongoose')
  , Schema = mongoose.Schema;
/*
var Cacera = new Schema({
    name:String,
    description:String,
    date: {type: Date, default: Date.now},
    longitude: Number,
    latitude: Number
});*/


var Cacera = new Schema({
	id: { type: String, required: true },
	nom: { type: String, required: true },
    info: { type: String, required: true },
	logo: { type: String },
    datahora: { type: Date, default: Date.now, required: true  }
	//datahora: { type: String, required: true  }
});


/*VALIDACIONS PEL MODEL*/
Cacera.path('nom').validate(function (v) {		//Validem que el nom de la cacera no sigui nula
    //console.log("[e][caceres_api] El nom de la cacera no pot ser nul.");
    console.log(v);
    return v.length > 0 && v.length < 70;
});

Cacera.path('info').validate(function (v) {		//Validem que la info de la cacera no sigui nula
    //console.log("[e][caceres_api] El nom de la cacera no pot ser nul.");
    console.log(v);
    return v.length > 0;
});
module.exports = mongoose.model('Cacera', Cacera);