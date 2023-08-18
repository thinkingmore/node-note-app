const User = require("../models/User");

const login = (req, res) => {
  res.send("This is login")
}

const signup = async (req, res) => {
  const { email, username, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      let newUser = new User({ username, email, password });
      await newUser.save();
      res.status(200)
      res.redirect('/login')
    }
    else{
      res.status(422).send({ errors: ["the user with this email already exists"] });
    }
  } catch (error) {
    console.error(error);

    return res.status(500).send({ errors: ["some error occured"] });
  }
};

const logout = (req, res) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/login');
  });
}; 

const isAuthenticated = (req, res) => {
  if (!req.user)
    return res.status(403).send({ errors: ["login to get the info"] });

  return res.status(200).send({ user: req.user });
};

module.exports = {
  login,
  signup,
  logout,
  isAuthenticated,
};