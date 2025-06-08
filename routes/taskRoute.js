const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { requireAuth } = require('../middleware/authMiddleware');

// POST: create a task
router.post('/tasks', requireAuth, async (req, res) => {
  try {
    const { title } = req.body;
    if (!title || title.trim() === "") {
      req.flash('message', 'Task title cannot be empty');
      return res.redirect('/dashboard');
    }

    await Task.create({
      title,
      user: req.session.user._id
    });

    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating task');
  }
});


// POST: toggle task completion
router.post('/tasks/:id/toggle', requireAuth, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.session.user._id });

    if (!task) {
      return res.status(404).send('Task not found');
    }

    task.completed = !task.completed;
    await task.save();

    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating task');
  }
});


module.exports = router;
