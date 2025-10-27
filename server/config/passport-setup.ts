import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { storage } from '../storage'; // We'll use our storage functions to find/create users

// This function is called to save the user's ID to the session cookie.
// It determines what user information should be stored in the session.
passport.serializeUser((user: any, done) => {
  // We save the unique user ID from our database to the session.
  done(null, user.id);
});

// This function is called to retrieve the user's full data from the database
// using the ID we stored in the session cookie.
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await storage.getUser(id);
    // The user object is attached to the request as req.user
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      // Options for the Google strategy
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: '/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      // This function runs after a user successfully signs in with Google.
      // 'profile' contains their information from Google.
      try {
        // 1. Check if user already exists in our database
        const existingUser = await storage.getUser(profile.id);

        if (existingUser) {
          // If they do, we're done. Pass their data to the next step.
          console.log('Existing user found:', existingUser.name);
          done(null, existingUser);
        } else {
          // 2. If not, create a new user in our database
          const newUser = await storage.createUser({
            id: profile.id, // Use the Google profile ID as our user ID
            name: profile.displayName,
            email: profile.emails ? profile.emails[0].value : '',
            avatarUrl: profile.photos ? profile.photos[0].value : '',
            // Set default values for new users
            subscriptionStatus: 'inactive',
            subscriptionTier: 'free',
            subscriptionEndsAt: null,
          });
          console.log('New user created:', newUser.name);
          done(null, newUser);
        }
      } catch (error) {
        // If there's a database error, let Passport know.
        done(error, undefined);
      }
    }
  )
);
