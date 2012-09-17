var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var path = require("path");
/*
var Cacera = new Schema({
    name:String,
    description:String,
    date: {type: Date, default: Date.now},
    longitude: Number,
    latitude: Number
});*/
/*
var Posicions = new Schema({
    latitud: { type: String },
	longitud: { type: String },
	titol: { type: String },
    url: { type: String },
	bolet: { type: String },
	datahora: { type: Date, default: Date.now }
});
*/
var Cacera = new Schema({
	nom: { type: String },
    info: { type: String },
	logo: { type: String },
    datahora: { type: Date, default: Date.now },
	publica: { type: Boolean },
	_usuari: { type: Schema.Types.ObjectId, ref: 'User' },
/*	posicions: [Posicions],*/
});


/*VALIDACIONS PEL MODEL*/
/*Cacera.path('nom').validate(function (v) {		//Validem que el nom de la cacera no sigui nula
    //console.log("[e][caceres_api] El nom de la cacera no pot ser nul.");
    console.log(v);
    return v.length > 0 && v.length < 70;
});

Cacera.path('info').validate(function (v) {		//Validem que la info de la cacera no sigui nula
    //console.log("[e][caceres_api] El nom de la cacera no pot ser nul.");
    console.log(v);
    return v.length > 0;
});*/
module.exports = mongoose.model('Cacera', Cacera);