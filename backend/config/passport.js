const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // 🚀 FIX 1: Use an absolute URL for production, fallback to relative for local testing
      callbackURL: process.env.BACKEND_URL 
        ? `${process.env.BACKEND_URL}/api/auth/google/callback` 
        : "/api/auth/google/callback",
      // 🚀 FIX 2: Crucial for Render! Tells Passport to trust the proxy and keep "https"
      proxy: true 
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await User.findOne({
          email: profile.emails[0].value
        });

        if (existingUser) {
          return done(null, existingUser);
        }

        // Create new account if it doesn't exist
        const newUser = await User.create({
          name: profile.displayName,
          email: profile.emails[0].value,
          password: "google_oauth_placeholder_xyz123", // Safely bypasses standard auth
          role: "student"
        });

        done(null, newUser);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

// Required by Passport to avoid crashing during initialization
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

module.exports = passport;