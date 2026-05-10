const passport = require('passport');
const { sendEmail, welcomeTemplate } = require('../../utils/email.util');
const jwt = require("jsonwebtoken");

// Google Login - redirect to google
exports.googleLogin = (req, res, next) => {
    passport.authenticate('google', {
        scope: ['profile', 'email']
    })(req, res, next);
};

// Google Callback - after google redirects back

exports.googleCallback = (req, res, next) => {

  passport.authenticate(
    "google",
    { session: false },
    async (err, user) => {

      try {

        if (err || !user) {
          return res.redirect("http://localhost:5173/login");
        }

        const token = jwt.sign(
          {
            userId: user._id,
            role: user.role
          },
          process.env.JWT_SECRET,
          { expiresIn: "7d" }
        );

        // store token in DB
        user.token = token;
        await user.save();

        // redirect to frontend
        return res.redirect(
          `http://localhost:5173/google-success?token=${token}&role=${user.role}`
        );

      } catch (error) {

        return res.redirect("http://localhost:5173/login");

      }

    }
  )(req, res, next);

};
