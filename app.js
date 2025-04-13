require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const passport = require('passport');

const connectDB = require('./src/config/db');
require('./src/config/passport');

// Import Routes
const authRoute = require('./src/routes/authRoutes');
const postRoute = require('./src/routes/postRoutes');
const profileRoute = require('./src/routes/profileRoutes');
const googleAuthRoute = require('./src/routes/googleAuthRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

// Middleware
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Connect to Database
connectDB();

// Routes
app.get('/', (req, res) => {
  res.render('home');
});

app.use('/api/auth', authRoute);
app.use('/api/post', postRoute);
app.use('/api/profile', profileRoute);
app.use('/auth', googleAuthRoute);

// 404 Handler (Catch-all)
app.use((req, res) => {
  res.status(404).json({ msg: 'Route not found' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
