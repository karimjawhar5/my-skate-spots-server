const User = require('../models/user');
const bcrypt = require('bcryptjs');
const localStrategy = require('passport-local').Strategy;

module.exports = function(passport) {
    passport.use(
        new localStrategy(async (username, password, done) => {
            try {
                const user = await User.findOne({ username: username });

                if (!user) {
                    return done(null, false);
                }

                const passed = bcrypt.compareSync(password, user.password);
                if (passed) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            } catch (err) {
                return done(err); // Pass the error to the callback
            }
        })
    );

    passport.serializeUser((user, cb) => {
        cb(null, user.id);
    });

    passport.deserializeUser(async (id, cb) => {
        try {
            const user = await User.findOne({ _id: id });
            if (user) {
                cb(null, user);
            } else {
                cb(null, false); // User not found
            }
        } catch (err) {
            cb(err, null); // Pass the error to the callback
        }
    });
};
