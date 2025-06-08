const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const MongoStore = require('connect-mongo');

const {connectToMongoDb} = require('./config/db')
const authRoutes = require('./routes/authRoute');
const taskRoute = require('./routes/taskRoute')
require("dotenv")

const app = express()
const PORT = process.env.PORT || 3000


// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));

// Body parser
app.use(express.urlencoded({ extended: true }));


// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  cookie: { maxAge: 1000 * 60 * 60 } // 1 hour
}));

// // Set flash message globally for views

app.use(flash());
app.use((req, res, next) => {
  res.locals.message = req.flash('message');
  next();
});

// Middleware for error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});
// connect to data base
connectToMongoDb();

// middleware
app.use(express.json());
app.use(authRoutes);
app.use(taskRoute);



app.get("/", (req , res) => {
    console.log(`welcome to the home page!`)
    res.render('index')
})


app.listen(PORT ,'0.0.0.0', () => {
    console.log(`Sever is running on http://localhost:${PORT}`)
})