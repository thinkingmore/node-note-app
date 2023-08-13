// app.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const expressLayouts = require('express-ejs-layouts');

const app = express();
const port = process.env.PORT || 5000;


// Static Files
app.use(express.static('public'))
app.use('/css',express.static(__dirname + 'public/css'))
app.use('/js',express.static(__dirname + 'public/js'))
app.use('/img',express.static(__dirname + 'public/img'))


//Set Template Engine
app.use(expressLayouts)
app.set('layout', 'pages/layout.ejs')
app.set('view engine', 'ejs');

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());



// route
app.get("/",  async (req, res)=> {
  var mascots = [
    { name: 'Sammy', organization: "DigitalOcean", birth_year: 2012},
    { name: 'Tux', organization: "Linux", birth_year: 1996},
    { name: 'Moby Dock', organization: "Docker", birth_year: 2013}
  ];
  
  var tagline = "No programming concept is complete without a cute animal mascot.";
  
  res.render('pages/index', {
    mascots: mascots,
    tagline: tagline
  });
});


app.get("/login",  async (req, res)=> {
  res.render('pages/accounts/login')
});

app.get("/signup",  async (req, res)=> {
  res.render('pages/accounts/register')
});

// Start the server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
