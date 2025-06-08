const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { requireAuth } = require('../middleware/authMiddleware');
const Task = require('../models/Task');



// Show register page
router.get('/register', authController.showRegistForm);

// Handle registration
router.post('/register', authController.registerUser);

// Show login page
router.get('/login', authController.showLoginForm);

// Handle login
router.post('/login', authController.login);

// Logout
router.get('/logout', authController.logout);


router.get('/dashboard', requireAuth, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.session.user._id }).sort({ createdAt: -1 });
    res.render('dashboard', {
      user: req.session.user,
      tasks
    });
  } catch (err) {
    res.status(500).send('Error loading dashboard');
  }
});

// delete a task
// DELETE: remove a task
router.post('/tasks/:id/delete', requireAuth, async (req, res) => {
  try {
    const taskId = req.params.id;

    await Task.deleteOne({ _id: taskId, user: req.session.user._id });

    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting task');
  }
});



module.exports = router;
