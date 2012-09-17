var vows = require('vows'),
	APIeasy = require('api-easy'),
    assert = require('assert');
//	server = require('../server');
	
var suite = APIeasy.describe('deBolets API');

//server.startServer(3000);

suite.discuss("Tests sobre l'API deBolets")
	.discuss('GET Cacera')
    .use('localhost', 3000)
	.followRedirect(false)
    /*.setHeader('Content-Type', 'application/json')*/ //Dóna pel sac
    // A GET Request to /ping
	//   should respond with 200
	//   should respond with { pong: true }
    	.get('ping')
    		.expect(200, { pong: true })
	.undiscuss()
	.discuss('GET Cacera')
    .use('localhost', 3000)
	.followRedirect(false)
    /*.setHeader('Content-Type', 'application/json')*/ //Dóna pel sac
    // A GET Request to /ping
	//   should respond with 200
	//   should respond with { pong: true }
    	.get('api/cacera/504395c210f5cd2ef8d3fd69')
    		.expect(200, { pong: true })
	.undiscuss()
	.discuss('PONG')
	.use('localhost', 3000)
	.followRedirect(false)
		.get('pong')
			.expect(200, { pong: false })
	.undiscuss()
/*    .discuss('TEST POST')
	.use('localhost', 3000)
	.followRedirect(false)
	.post('/tests', { data: "dariomadrid@gmail.com" },{ usuari: "dariomadrid" })
	       .expect(200, { dynamic: true })
	.undiscuss()*/
 /*   .discuss('AUTHENTICACIÓ')
	.use('localhost', 3000)
	.followRedirect(false)
    	.get('/login')
    		.expect(200)
    		.expect('should respond with the authorize token', function (err, res, body) {
				var result = JSON.parse(body);
       			assert.isNotNull(result.token);
				return true;*/
		/*
       	suite.before('setAuth', function (outgoing) {
         	outgoing.headers['x-test-authorized'] = result.token;
         	return outgoing;
       	});*/
     	/*	})*/
     //
     // Before we can test our request to /restricted 
     // the request to /login must respond. To ensure this
     // we make a call to .next() before our next call to .get()
     //
     /*.next()
     .get('/restricted')
       .expect(200, { authorized: true })
	*/
.export(module);