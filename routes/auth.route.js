const express = require("express");
const router = express.Router();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User");
const { login, logout, signup, isAuthenticated } = require("../controllers/auth.controller");

const bcrypt = require('bcrypt');


// Passport configuration
passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      const user = await User.findOne({ username });

      if (!user) {
        return done(null, false, { message: 'Incorrect username or password' });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Incorrect username or password' });
      }
    } catch (error) {
      return done(error);
    }
  }
));


// Google Login
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async function (accessToken, refreshToken, profile, done) {
      const newUser = {
        googleId: profile.id,
        displayName: profile.displayName,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        profileImage: profile.photos[0].value,
      };

      try {
        let user = await User.findOne({ googleId: profile.id });
        if (user) {
          done(null, user);
        } else {
          user = await User.create(newUser);
          done(null, user);
        }
      } catch (error) {
        console.log(error);
      }
    }
  )
);

// Email password login routes
router.get("/register",  async (req, res)=> {
  res.render('pages/accounts/register')
});

router.get("/login",  async (req, res)=> {
  res.render('pages/accounts/login')
});

router.get("/logout", logout);

router.get("/me", isAuthenticated, (req, res)=> {
  res.send('pages dashboard')
});

router.post(
  "/register",
  signup
);

router.post("/login", passport.authenticate("local", {
    successRedirect: "/about",   // Redirect upon successful login
    failureRedirect: "/login",    // Redirect upon failed login
  }),
  login
);


// redirect user to dashboard 
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login-failure",
    successRedirect: "/dashboard",
  })
);

// Route if something goes wrong
router.get('/login-failure', (req, res) => {
  res.send('Something went wrong...');
});

// Destroy user session
router.get('/logout', logout);



// Persist user data after successful authentication
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Retrieve user data from session.
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});


module.exports = router;