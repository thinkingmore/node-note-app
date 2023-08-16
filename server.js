require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./utils/db');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const passport = require('passport');
const methodOverride = require("method-override");
const app = express();
const MongoStore = require('connect-mongo');
const homeRoute = require('./routes/index.route')
const authRoute = require('./routes/auth.route')
const dashboardRoute = require('./routes/dashboard.route')

//define the default and server port
const port = process.env.PORT || 5000;


// Static Files
app.use(express.static('public'))
app.use('/css',express.static(__dirname + 'public/css'))
app.use('/js',express.static(__dirname + 'public/js'))
app.use('/img',express.static(__dirname + 'public/img'))


app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI
  }),
  //cookie: { maxAge: new Date ( Date.now() + (3600000) ) } 
  // Date.now() - 30 * 24 * 60 * 60 * 1000
}));


// Conntect to Database
connectDB();  

//Set Template Engine
app.use(expressLayouts)
app.set('layout', 'pages/layout.ejs')
app.set('view engine', 'ejs');

// Middleware
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(cors());

// Routes
app.use('/', homeRoute);
app.use('/', authRoute);
app.use('/', dashboardRoute);



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
