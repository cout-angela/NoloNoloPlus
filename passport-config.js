const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const cout = require('./util/cout');


function initialize(passport, getUserByUsername, getUserById) {

  const authenticateUser = async (username, password, done) => {
    
    const user = await getUserByUsername(username);
    if (user == null) {
      return done(null, false, { msg: 'userNotFound' });
    }

    if (user.msg) { return user }


    try {
      if (bcrypt.compareSync(password, user.password)) {
        return done(null, user);
      } else {
        return done(null, false, { msg: 'wrongPass' })
      }
    } catch (e) {
      return done(e);
    }
  }

  passport.use(new LocalStrategy({ usernameField: 'username' }, authenticateUser))
  passport.serializeUser((user, done) => {done(null, user._id)})
  passport.deserializeUser(async (id, done) => {
    var wholeUser = await getUserById(id);
    return done(null, wholeUser);
  })
}

module.exports = initialize