const users = require('../models/users');
const blacklist = require('../models/blackListToken');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Register new user
const register = async (req, res) => {
  const { email, username, password } = req.body;

  const presentE = await users.findOne({ email });
  const presentU = await users.findOne({ username });

  if (!presentE && !presentU) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new users({ email, username, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'Registration successful' });
    console.log('Register successful');
  } else {
    res.status(403).json({ message: 'User already exists' });
    console.log('User already exists');
  }
};

// Login user
// Login user
const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await users.findOne({ email });

  if (user) {
    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) {
      res.status(403).json({ message: 'Invalid password' });
    } else {
      const token = jwt.sign(
        {
          _id: user._id.toString(), // *** INCLUDED: User _id *** (Convert to string)
          email: user.email,
          username: user.username,
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      res.status(202).json({ message: 'Login successful', token });
    }
  } else {
    res.status(401).json({ message: 'User doesn’t exist' });
  }
};

const logout = async (req, res) => {
  const auth = req.headers['authorization'];
  const token = auth && auth.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const expires = new Date(decoded.exp * 1000); // convert to ms

    await blacklist.create({ token, expires });

    res.status(202).json({ message: 'Logout successful' });
    console.log('Logout successful');
  } catch (err) {
    console.error('Logout error:', err.message);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};



// Forgot Password
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await users.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    const resetLink = `http://localhost:3000/reset-password?token=${token}&email=${email}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset',
      text: `Reset your password using this link: ${resetLink}`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Reset link sent' });
  } catch (error) {
    console.error('Error in forgotPassword:', error);
    res.status(500).json({ message: 'Failed to send reset link' });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  const { token, email, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.email !== email) {
      return res
        .status(401)
        .json({ message: 'Invalid token or email mismatch' });
    }

    const user = await users.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Error in resetPassword:', error);
    res.status(400).json({ message: 'Invalid or expired token' });
  }
};

module.exports = {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
};
