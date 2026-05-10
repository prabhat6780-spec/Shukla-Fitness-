const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user.models');
const jwt = require('jsonwebtoken');
const { sendEmail, welcomeTemplate } = require('../utils/email.util');  

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/api/auth/google/callback"
},
async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ email: profile.emails[0].value });

        if (!user) {
            // Register new Google user
            user = await User.create({
                googleId: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value,
                role: "user"
            });
             // ── Send Welcome Email ──────────────
            await sendEmail(
                profile.emails[0].value,
                "Welcome to Shukla's Fitness 💪",
                welcomeTemplate(profile.displayName)
            );
            console.log("Welcome email sent to:", profile.emails[0].value);
            console.log("New Google user registered");
        } else {
            // Login existing user
            if (!user.googleId) {
                user.googleId = profile.id;
                await user.save();
            }
            console.log("Existing Google user logged in");
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        user.token = token;
        await user.save();

        return done(null, user);

    } catch (error) {
        return done(error, null);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

module.exports = passport;