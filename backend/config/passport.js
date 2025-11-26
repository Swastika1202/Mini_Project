const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const { generateToken } = require('../controllers/authController');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ googleId: profile.id });

      if (user) {
        user.token = generateToken(user._id, user.avatar);
        done(null, user);
      } else {
        user = await User.create({
          googleId: profile.id,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          email: profile.emails[0].value,
          avatar: profile.photos[0].value || 'https://res.cloudinary.com/dkhhgyrjc/image/upload/v1709460293/avatar_udfn5b.png',
        });
        user.token = generateToken(user._id, user.avatar);
        done(null, user);
      }
    } catch (error) {
      done(error, false);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    if (user) {
      // Generate a new token or re-assign if it was somehow preserved (less likely)
      const { generateToken } = require('../controllers/authController'); // Import generateToken here
      user.token = generateToken(user._id, user.avatar);
    }
    done(null, user);
  } catch (error) {
    done(error, false);
  }
});
