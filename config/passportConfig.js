const User = require('../models/user');
const bcrypt = require('bcryptjs');
const localStrategy = require('passport-local').Strategy;

module.exports = function(passport) {
    passport.use(
        new localStrategy(async (username, password, done)=>{
            try{
                const user = await User.findOne({username: username});

                if (!user) {return done(null, false)}

                const passed = bcrypt.compareSync(password, user.password);
                if (passed){
                    return done(null, user)
                }else{
                    return done(null, false)
                }
            }catch(err){
                if (err){throw err}
            }
        })
    )
    passport.serializeUser((user, cb) => {
        cb(null, user.id);
    })

    passport.deserializeUser(async (id, cb) => {
        try{
            const user = await User.findOne({_id: id })
            if(user){
                cb(null, user)
            }
        }catch(err){
            await cb(err, null)
        }
    })
}
