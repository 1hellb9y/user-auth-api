const express = require("express");
const {
  register,
  verifyEmail,
  login,
  requestPasswordReset,
  resetPassword
} = require("../controllers/User-Auth-Controller");

const router = express.Router();

router.post("/register", register);
router.get("/verify-email/:token", verifyEmail);
router.post("/login", login);
router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password/:token", resetPassword);

module.exports = router;
