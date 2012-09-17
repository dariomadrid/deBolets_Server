var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var User = new Schema({
	nom: { type: String, required: true },
    email: { type: String, required: true },
	password: { type: String, required: true },
	avatar: { type: String },
	token: { type: String},
	modified: { type: String, required: true  }
});

User.method('verifyPassword', function(password, callback) {
  //bcrypt.compare(password, this.hash, callback);
	return callback(null,this.password==password);
});

User.static('authenticate', function(email, password, callback) {
	this.findOne({ email: email }, function(err, user) {
		if (err) { return callback(err); }
		if (!user) { return callback("error_usuari_no_trobat", false); }
		user.verifyPassword(password, function(err, passwordCorrect) {
			if (err) { return callback(err); }
        	if (!passwordCorrect) { return callback("error_password", false); }
        	return callback(null, user);
		});
	});
});

module.exports = mongoose.model('User', User);