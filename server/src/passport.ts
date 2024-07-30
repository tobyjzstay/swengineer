import passport from "passport";
import { Strategy } from "passport-google-oauth20";
import { User } from "./models/User";

passport.serializeUser((user: User, done) => {
    done(null, user.id);
});

passport.deserializeUser((id: User, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});

passport.use(
    new Strategy(
        {
            // options for google strategy
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "/api/auth/google/redirect",
        },
        (_accessToken, _refreshToken, profile, done) => {
            // check if user already exists in our own db
            User.findOne({ googleId: profile.id }).then((currentUser) => {
                if (currentUser) {
                    // already have this user
                    done(null, currentUser);
                } else {
                    // if not, create user in our db
                    new User({
                        googleId: profile.id,
                        email: profile._json.email,
                        verified: profile._json.email_verified,
                    })
                        .save()
                        .then((newUser) => {
                            done(null, newUser);
                        });
                }
            });
        }
    )
);
