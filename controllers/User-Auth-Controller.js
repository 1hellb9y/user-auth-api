const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

// -------------------- REGISTER --------------------
exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      isVerified: false
    });

    // Create verification token
    const verificationToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const verifyLink = `http://localhost:5000/api/auth/verify-email/${verificationToken}`;

    // Send verification email
    await sendEmail(
      user.email,
      verifyLink,
      "Verify Your Email",
      `<p>Click the link below to verify your email:</p>
       <a href="${verifyLink}">Verify Email</a>`
    );

    res.status(201).json({
      message: "Registered successfully. Check your email to verify your account."
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -------------------- VERIFY EMAIL --------------------
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);
    if (!user) return res.status(400).json({ message: "Invalid token" });

    if (user.isVerified)
      return res.status(400).json({ message: "Email already verified" });

    user.isVerified = true;
    await user.save();

    res.json({ message: "Email verified successfully. You can now log in." });
  } catch (error) {
    res.status(400).json({ message: "Invalid or expired verification link" });
  }
};

// -------------------- LOGIN --------------------
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.isVerified)
      return res
        .status(401)
        .json({ message: "Please verify your email before logging in" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, message: "Login successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -------------------- REQUEST PASSWORD RESET --------------------
exports.requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    const resetToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "10m" }
    );

    const resetLink = `http://localhost:5000/api/auth/reset-password/${resetToken}`;

    await sendEmail(
      user.email,
      resetLink,
      "Password Reset Request",
      `<p>You requested a password reset. Click the link below to reset your password:</p>
       <a href="${resetLink}">Reset Password</a>
       <p>This link will expire in 10 minutes.</p>`
    );

    res.json({ message: "Password reset email sent." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -------------------- RESET PASSWORD --------------------
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) return res.status(400).json({ message: "Invalid token" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
};
