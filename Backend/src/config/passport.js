const passport = require('passport');
const passportJwt = require('passport-jwt');

const secret = 'userPlanify@202425';

const { Strategy, ExtractJwt } = passportJwt;

module.exports = (app) => {
  const params = {
    secretOrKey: secret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  };

  const strategy = new Strategy(params, (payload, done) => {
    app.services.user.find({ Id: payload.Id })
      .then((user) => {
        if (user) done(null, { ...payload });
        else done(null, false);
      }).catch((error) => done(error, false));
  });

  passport.use('user-jwt', strategy);

  return {
    userauthenticate: () => passport.authenticate('user-jwt', { session: false }),
  };
};
