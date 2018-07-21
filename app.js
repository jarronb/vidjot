const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const path = require('path');
const passport = require('passport');
const {ensureAuthenticated} = require('./helpers/auth');


var methodOverride = require('method-override');

const app = express();

// LOAD ROUTES
const ideas = require('./routes/ideas');
const users = require('./routes/users')

//PASSPORT CONFIG
require('./config/passport')(passport);

//DB CONFIG
const db = require('./config/database');

// Map global promise 
mongoose.Promise = global.Promise;
// CONNECT TO MONGOOSE
mongoose.connect(db.mongoURI, {
  useNewUrlParser: true
}).then(() => {
  console.log('MongoDB Connected')  
}).catch(err => console.log(err));

// HANDLEBARS MIDDLEWARE
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//BODY PARSER MIDDLEWARE
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

// STATIC FOLDER  
app.use(express.static(path.join(__dirname, 'public')));

//OVERIDE
app.use(methodOverride('_method'));

//APP SESSION
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

//PASSPORT MIDDLEWARE
app.use(passport.initialize());
app.use(passport.session());

//FLASH
app.use(flash());

//GLOBAL VARIBLES
app.use((req,res,next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

// ABOUT ROUTE
app.get('/about', (req, res) => {
  res.render('about');
});

// INDEX ROUTE
app.get('/', (req,res) => {
  const title = 'welcome'
  console.log(req.url);
  res.render('ideas/ideas', {
    title: title
  });
});

// ABOUT PAGE
app.get('/about', (req,res) => {
  console.log(req.url);
  res.render('ideas/add');
});

// USE ROUTES
app.use('/ideas',ideas);
app.use('/users',users);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server started on port: ${port}`);
});

