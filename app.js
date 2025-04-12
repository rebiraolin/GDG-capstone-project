require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');

const connectDB = require('./src/config/db');
require('./src/config/passport');

const authRoute = require('./src/routes/authRoutes');
const postRoute = require('./src/routes/postRoutes');
const profileRoute = require('./src/routes/profileRoutes');
const googleAuthRoute = require('./src/routes/googleAuthRoutes');

const app = express();


const PORT = process.env.PORT || 5000;
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
connectDB();

app.use('/api/auth', authRoute);
app.use('/api/post', postRoute);
app.use('/api/profile', profileRoute);
app.use('/auth/', googleAuthRoute);

// Catch-all route for requests that don't match any defined routes
app.use((req, res) => {
  res.status(404).json({ msg: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
