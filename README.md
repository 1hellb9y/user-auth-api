# 🔐 User Authentication API (Express.js + MongoDB)

A secure and production-ready authentication API built with **Node.js**, **Express.js**, and **MongoDB**.  
Supports **email verification** and **password reset** via **Yahoo** or **Gmail OAuth2**.

---

## 🚀 Features

✅ User Registration with Email Verification  
✅ Login with JWT Authentication (blocks unverified users)  
✅ Secure Password Reset via Email (Yahoo or Gmail OAuth2)  
✅ Passwords hashed with **bcrypt**  
✅ Token-based verification with expiration  
✅ Clean and scalable folder structure

---

## 🛠 Tech Stack

- **Node.js** + **Express.js** (API server)
- **MongoDB** + **Mongoose** (database)
- **JWT** (authentication)
- **Bcrypt.js** (password hashing)
- **Nodemailer** (email service: Yahoo or Gmail OAuth2)

---

## 📂 Project Structure

project/
│
├── controllers/ # All logic (auth controller)
├── models/ # Mongoose models (User model)
├── routes/ # API routes
├── utils/ # Helper functions (sendEmail)
├── .env.example # Template for environment variables
├── .gitignore
├── package.json
└── server.js

env.example
PORT=3000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_jwt_secret

# ---- Choose Email Service ----
EMAIL_SERVICE=yahoo
EMAIL_USER=your_yahoo_email
EMAIL_PASS=your_yahoo_app_password

# ---- OR Gmail OAuth2 ----
# EMAIL_SERVICE=gmail
# EMAIL_USER=your_gmail
# CLIENT_ID=your_gmail_client_id
# CLIENT_SECRET=your_gmail_client_secret
# REFRESH_TOKEN=your_gmail_refresh_token



 Example JSON Request
Register
json
POST /api/auth/register
{
  "email": "test@example.com",
  "password": "123456"
}
Login
json
POST /api/auth/login
{
  "email": "test@example.com",
  "password": "123456"
}

License
This project is open-source and free to use
