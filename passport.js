const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("./models/User");

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});

passport.use(
    new GoogleStrategy(
        {
            // options for google strategy
            clientID: clientId,
            clientSecret: clientSecret,
            callbackURL: "/api/auth/google/redirect",
        },
        (accessToken, refreshToken, profile, done) => {
            // check if user already exists in our own db
            console.log(profile);
            User.findOne({ googleId: profile.id }).then((currentUser) => {
                if (currentUser) {
                    // already have this user
                    console.log("user is: ", currentUser);
                    done(null, currentUser);
                } else {
                    // if not, create user in our db
                    new User({
                        googleId: profile.id,
                        email: profile._json.email,
                    })
                        .save()
                        .then((newUser) => {
                            console.log("created new user: ", newUser);
                            done(null, newUser);
                        });
                }
            });
        }
    )
);
