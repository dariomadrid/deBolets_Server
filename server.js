
var express = require('express');
var mongoose = require('mongoose');

var app = express();
/* AUTH SIMPLE
var hash = require('./pass').hash;
*/
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var util = require('util');
var flash = require('connect-flash');

var MONGOHQ_URL="mongodb://debolets:debolets@alex.mongohq.com:10082/app7069372";

//  Get the environment variables we need.
var ipaddr  = process.env.OPENSHIFT_INTERNAL_IP;
var port    = process.env.PORT || 3000;
var dbhost  = process.env.MONGOHQ_URL;
var dbport  = process.env.OPENSHIFT_NOSQL_DB_PORT;
var dbuname = process.env.OPENSHIFT_NOSQL_DB_USERNAME;
var dbpwd   = process.env.OPENSHIFT_NOSQL_DB_PASSWORD;

var token;

ipaddr = "localhost";

// Establish connection to MongoDB 
//mongoose.connect('mongodb://'+dbuname+':'+dbpwd+'@'+dbhost+':'+dbport+'/nodetest');
console.log(MONGOHQ_URL);
mongoose.connect(MONGOHQ_URL);
//mongoose.connect('mongodb://localhost/api2');

app.configure(function () {
	/*AUTH SIMPLE*/
	app.use(express.cookieParser());
    app.use(express.bodyParser());
    app.use(express.methodOverride());
	app.use(express.session({ secret: 'keyboard cat' }));
  	app.use(flash());
	app.use(passport.initialize());
	app.use(passport.session());
	app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs');
    //app.use(app.router);	//el deshabilito d'aqui xq el carrego més endavant
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

var email_controller = require('./controller/email.js');
//email_controller.send_mail_nou_usuari("David Mayo","password","dariomadrid@gmail.com");


/* create an error with .status. we
 can then use the property in our
 custom error handler (Connect repects this prop as well)*/
function error(status, msg) {
  var err = "[Status: "+status+"] Error: "+msg;
  return err;
}

/* map of valid api keys, typically mapped to
 account info with some sort of database like redis.
 api keys do _not_ serve as authentication, merely to
 track API usage or help prevent malicious behavior etc.*/
var apiKeys = ['touch2', 'web'];

//Valida l'api key d'on prové les caceres
app.use('/api', function(req, res, next){
	var key = req.query['api_key'];
//	console.log("api="+req.query['api_key']);
	// key isnt present
	if (!key) return next(error(400, 'api key required'));
	// key is invalid
	if (!~apiKeys.indexOf(key)) return next(error(401, 'invalid api key'));
	// all good, store req.key for route access
	req.key = key;
	next();
});

/* position our routes above the error handling middleware,
 and below our API middleware, since we want the API validation
 to take place BEFORE our routes*/
app.use(app.router);

app.all('/api/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Headers", "Content-Type");
//  res.header("Access-Control-Request-Method", "POST,GET");
//  res.header('Content-Type', 'application/json');
  next();
});

// [CACERES]
// rutes per RESTful API, els mètodes estan definits a controller/caceres.js
var api_caceres = require('./controller/caceres.js');

app.get('/api/caceres', api_caceres.list);									//Llista de caceres
app.get('/api/caceres/:user_id', api_caceres.list_usuari);					//Llista de caceres per usuari
app.post('/api/caceres', api_caceres.save);									//Crea la cacera id
app.put('/api/caceres/:id', api_caceres.put);								//Actualitza la cacera id
app.delete('/api/caceres/:id', api_caceres.delete);							//Esborra la cacera id
app.get('/api/esborrar_caceres/:user_id', api_caceres.delete_all_per_user);	//Esborra totes les caceres per usuari

app.get('/api/comunitat', api_caceres.list_comunitat);								//Lista caceres públiques

// [USERS]
// rutes per RESTful API, els mètodes estan definits a controller/users.js
var api_users = require('./controller/users.js');

app.get('/api/users/:id', api_users.show);									//Mostra la info de l'usuari id. Requereix authenticació usuari.
/*app.get('/api/users', api_users.list);*/									
app.delete('/api/users/:id', api_users.users);							//Esborra l'usuari id
app.post('/api/users', api_users.save);									//Crea la cacera id
app.get('/api/esborrar_users', api_users.delete);							//Esborra tots els usuaris. Requereix validació especial

/* Passport session setup.
   To support persistent login sessions, Passport needs to be able to
   serialize users into and deserialize users out of the session.  Typically,
   this will be as simple as storing the user ID when serializing, and finding
   the user by ID when deserializing.
 serialize user on login*/
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

// deserialize user on logout
passport.deserializeUser(function(id, done) {
	User.findById(id, function (err, user) {
		done(err, user);
	});
});

// Use the LocalStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a username and password), and invoke a callback
//   with a user object.  In the real world, this would query a database;
//   however, in this example we are using a baked-in set of users.
/*
passport.use(new LocalStrategy(
	function(username, password, done) {
		// asynchronous verification, for effect...
		process.nextTick(function () {
			// Find the user by username.  If there is no user with the given
			// username, or the password is not correct, set the user to `false` to
			// indicate failure and set a flash message.  Otherwise, return the
			// authenticated `user`.
			api_users.findByUsernameDB(username, function(err, user) {
				if (err) { return done(err); }
				if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
				if (user.password != password) { return done(null, false, { message: 'Invalid password' }); }
				return done(null, user);
			})
		});
	}
));*/

var User = require('./model/user.js');

// Define local strategy for Passport
passport.use(new LocalStrategy({
    usernameField: 'email'
  },
  function(email, password, done) {
    User.authenticate(email, password, function(err, user) {
      return done(err, user);
    });
  }
));


/* Simple route middleware to ensure user is authenticated.
   Use this route middleware on any resource that needs to be protected.  If
   the request is authenticated (typically via a persistent login session),
   the request will proceed.  Otherwise, the user will be redirected to the
   login page.*/
function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) { return next(); }
	//res.send('error_no_logat');
	res.send(JSON.stringify({ "authorized": false }));
}

app.get('/', function(req, res){
  	res.render('index', { user: req.user });
});

app.get('/account', ensureAuthenticated, function(req, res){
  res.render('account', { user: req.user });
});

app.get('/restricted', ensureAuthenticated, function(req, res){
  	//res.render('login', { user: req.user, message: req.flash('error') });
	res.send(JSON.stringify({ "authorized": true }));
});

app.get('/login2', function(req, res){
  	res.render('login', { user: req.user, message: req.flash('error') });
});


app.get('/login', function(req, res){
  	//res.render('login', { user: req.user, message: req.flash('error') });
	if (!token) {
		token = Math.floor(Math.random() * 100);
	}
	res.send(JSON.stringify({ "token": token }));
});

app.post('/login', 
	passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
	function(req, res) {
		//res.redirect('/');
		//res.render('index', { user: req.user });
		//res.render('account', { user: req.user });
		console.log(req.user._id);
		res.send(req.user);
});

app.get('/logout', function(req, res){
	req.logout();
	res.send("logout ok");
});

app.get('/ping', function (req, res) {
	res.writeHead(200, { 'Content-Type': 'application/json' }); 
    //res.send(req.query["callback"] +'({"result":' + JSON.stringify("ok") + '});');
	//var document = {pong: true};
	//res.write(JSON.stringify(document));
	//res.end();
//	res.send({ "pong": "true" }, 200);
	res.write(JSON.stringify({ "pong": true }));
	res.end();
});

app.get('/pong', function (req, res) {
	res.writeHead(200, { 'Content-Type': 'application/json' }); 
    res.write(JSON.stringify({ "pong": false }));
	res.end();
});

app.post('/tests', function(req, res) { 
	console.log(req.params);
	console.log(req.body.data);
	res.writeHead(200, { 'Content-Type': 'application/json' }); 
	res.write(JSON.stringify({ "usuari": req.body.usuari }));
	res.end();
});

app.get('/api', function(req, res){
	res.send("API deBolets v1.0");
});


//  And start the app on that interface (and port).
//app.listen(port, ipaddr, function() {
exports.startServer = function (port) {
	app.listen(port, function() {
	   console.log('%s: API deBolets Node server listening on %s:%d ...', Date(Date.now() ),port);
	});
}

exports.startServer(port);
/*
app.listen(port, function() {
   console.log('%s: API deBolets Node server listening on %s:%d ...', Date(Date.now() ),port);
});
*/