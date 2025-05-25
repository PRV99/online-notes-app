const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { body, validationResult } = require('express-validator');

const validateRegister = [
  body('name', 'Name is required').notEmpty(),
  body('email', 'Please include a valid email').isEmail(),
  body('password', 'Password must be at least 5 characters').isLength({ min: 5 }),
];

const validateLogin = [
  body('email', 'Please include a valid email').isEmail(),
  body('password', 'Password is required').notEmpty(),
];

router.post('/register', validateRegister, async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    await userController.registerUser(req, res);
  } catch (error) {
    next(error);
  }
});

router.post('/login', validateLogin, async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    await userController.loginUser(req, res);
  } catch (error) {
    next(error);
  }
});

module.exports = router;