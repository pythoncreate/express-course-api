const auth = require('basic-auth');
const User = require('../models/user');

function requiresLogin(req, res, next) {
    //get credentials from header
    const credentials = auth(req);
    //check to see if any credentials exist
    if(!credentials){
        const error = new Error('Sorry, credentials are required');
        error.status = 401;
        return next(error);
    } else {
        //if credentials, check them using authenticate method
        User.authenticate(credentials.name, credentials.pass, function(error,user){
            if(error || !user){
				const error = new Error("Sorry, there was an issue w/your username and password!");
				error.status = 401
				next(error.message);
			} else {
				req.user = user;
				next();
			}
		});
	}
	
}

module.exports.requiresLogin = requiresLogin;