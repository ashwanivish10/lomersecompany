import { Router } from 'express';
import passport from 'passport';

const router = Router();

// Route #1: Start the Google authentication process
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);

// Route #2: The callback URL Google redirects to after the user logs in
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication! Redirect to the root URL.
    // Your frontend router will see the user is authenticated and show the dashboard.
    res.redirect('/');
  }
);

// Route #3: The endpoint for logging out
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    // After logging out, redirect to the homepage.
    res.redirect('/');
  });
});

// Route #4: An API endpoint for the frontend to check user status
router.get('/user', (req, res) => {
  if (req.user) {
    res.json(req.user);
  } else {
    res.status(401).json({ message: 'No user authenticated' });
  }
});

export default router;

