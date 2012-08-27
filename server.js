#!/bin/env node

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

//  Get the environment variables we need.
var ipaddr  = process.env.OPENSHIFT_INTERNAL_IP;
var port    = 14241;
var dbhost  = process.env.OPENSHIFT_NOSQL_DB_HOST;
var dbport  = process.env.OPENSHIFT_NOSQL_DB_PORT;
var dbuname = process.env.OPENSHIFT_NOSQL_DB_USERNAME;
var dbpwd   = process.env.OPENSHIFT_NOSQL_DB_PASSWORD;

ipaddr = "localhost";
port = 3000;

// Establish connection to MongoDB
//mongoose.connect('mongodb://'+dbuname+':'+dbpwd+'@'+dbhost+':'+dbport+'/nodetest');
mongoose.connect('mongodb://localhost/api2');

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
});

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
	// key isnt present
	if (!key) return next(error(400, 'api key required'));
	// key is invalid
	if (!~apiKeys.indexOf(key)) return next(error(401, 'invalid api key'));
	// all good, store req.key for route access
	req.key = key;
	console.log(key);
	next();
});

/* position our routes above the error handling middleware,
 and below our API middleware, since we want the API validation
 to take place BEFORE our routes*/
app.use(app.router);


// set up the RESTful API, handler methods are defined in api.js [CACERES]
var api_caceres = require('./controller/caceres.js');
app.post('/api/caceres/', api_caceres.post);
app.get('/api/caceres/:lon/:lat/:dist?', api_caceres.near);
app.get('/api/caceres/:name/:descr/:latitude/:longitude?', api_caceres.save);
app.get('/api/caceres/:id/:format?', api_caceres.show);
app.get('/api/caceres', api_caceres.list);
app.get('/api/caceres2', api_caceres.list2);
app.get('/api/esborrar_caceres', api_caceres.esborrar);
app.delete('/api/caceres', api_caceres.delete);

// set up the RESTful API, handler methods are defined in api.js [USERS]
var api_users = require('./controller/users.js');
app.get('/api/users/:id/:format?', api_users.show);
app.get('/api/users', api_users.list);
app.get('/api/esborrar_users', api_users.delete);

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
	res.send('error_no_logat');
}

app.get('/', function(req, res){
  	res.render('index', { user: req.user });
});

app.get('/account', ensureAuthenticated, function(req, res){
  res.render('account', { user: req.user });
});

app.get('/login', function(req, res){
  res.render('login', { user: req.user, message: req.flash('error') });
});

app.post('/login', 
	passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
	function(req, res) {
		//res.redirect('/');
		//res.render('index', { user: req.user });
		//res.render('account', { user: req.user });
		console.log(req.user._id);
//		res.send("")
});

app.get('/logout', function(req, res){
	req.logout();
	res.send("logout ok");
});


app.get('/api', function(req, res){
	res.send("API deBolets v1.0");
});


//  And start the app on that interface (and port).
app.listen(port, ipaddr, function() {
   console.log('%s: API deBolets Node server started on %s:%d ...', Date(Date.now() ),ipaddr, port);
});
