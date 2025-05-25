const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const fetchUser = require('../middleware/fetchUser');
const noteController = require('../controllers/noteController');

router.get('/', fetchUser, noteController.getNotes);
router.post(
  '/',
  fetchUser,
  [
    body('title', 'Title must be at least 3 characters').isLength({ min: 3 }),
    body('content', 'Content must be at least 5 characters').isLength({ min: 5 }),
  ],
  noteController.createNote
);
router.put('/:id', fetchUser, noteController.updateNote);
router.delete('/:id', fetchUser, noteController.deleteNote);
router.get('/:id', fetchUser, noteController.getNoteById);

module.exports = router;