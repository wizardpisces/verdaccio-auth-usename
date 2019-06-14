function AuthUsername(config, options) {
    if (!(this instanceof AuthUsername)) {
        return new AuthUsername(config, options);
    }

    this.usernameList = config.username.split(/\s+/)
    this.fullMatch = config.fullMatch || 1; // 0: partial match name; 1: full match name
    this.logger = options.logger;

    this.logger.warn(`[verdaccio auth username config],config: ${ JSON.stringify(config) },options,${ JSON.stringify(options) }`);
}

const logError = (logger, err, username) => {
    logger.warn(`[${err.code}],user: ${username},${err.message}`);
};

AuthUsername.prototype.authenticate = function authenticate(username, password, done) {

    function isValidUsername(){
        if(this.fullMatch === 1){
            return this.usernameList.includes(username);
        }else{
            return this.usernameList.filter((item=>username.includes(item))).length > 0
        }
    }

    let message = `[verdaccio auth username],user: ${username}, usernameList: ${ JSON.stringify(this.usernameList) }`

    this.logger.warn(message);

    if ( !isValidUsername.call(this,username) ) {
        logError(this.logger,{
            message:'not a valid username',
            code:'40001'
        }, username);
        return done({
            message: '[error 40001] failed to auth username, not a valid username, please contact the admin!',
        },false)
    }

    return done(null,[username])
}

module.exports = AuthUsername;