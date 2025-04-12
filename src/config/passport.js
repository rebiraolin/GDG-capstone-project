const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/users');
const jwt = require('jsonwebtoken'); // Import JWT

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          user = new User({
            googleId: profile.id,
            userName: profile.displayName,
            email: profile.emails[0].value,
          });
          await user.save();
        }

        // Generate JWT after successful Google authentication
        const token = jwt.sign(
          {
            _id: user._id.toString(), // Include user ID
            email: user.email,
            userName: user.userName,
          },
          process.env.JWT_SECRET,
          { expiresIn: '24h' } // Adjust expiration as needed
        );

        // Pass the user and the token to the next stage (e.g., route handler)
        done(null, { user, token });
      } catch (err) {
        done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});
