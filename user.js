const express = require('express');
const router = express.Router();
const connection = require('./connection');

// Get all students (for example purposes)
router.get('/get', (req, res) => {
  const query = "SELECT * FROM tasks ";
  connection.query(query,(err, results) => {
    if(!err){
      return res.status(200).json(results);
    } else {
      return res.status(500).send(err);
    }
  });
});

//get  a partcular tasks for a particular user
router.get('/get/:email', (req, res) => {
  const user_id = req.params.email;
  const query = 'SELECT * FROM tasks where user_id=?';
  connection.query(query,[user_id],(err, results) => {
    if(results.length>0){
      return res.status(200).json(results);
    }
    else {
      return res.status(404).send(err);
    }
  });
});

//post the task for the user
router.post('/get', (req, res) => {
  const { user_id, task_name, description,status} = req.body;
  const insertQuery = "INSERT INTO tasks (user_id, task_name, description,status) VALUES (?, ?, ?, ?)";
  connection.query(insertQuery, [user_id, task_name, description,status], (err, result) => {
    if (err) {
      console.error('Error registering user:', err);
      return res.status(500).json({message:'Error registering user'});
    }
    if(result){
      console.log('User registered successfully');
      return res.status(200).json({ message: 'User registered successfully' });
    }
  });
});

// Delete a task by name
router.delete('/delete/:name', (req, res) => {
  const task_id = req.params.name;
  const query = 'DELETE FROM tasks WHERE task_id = ?';
  connection.query(query, [task_id], (err, result) => {
    if (err) {
      console.error('Error deleting data: ', err);
      return res.status(500).json({ message:'Error deleting data', err});
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Task not found' });
    } 
    res.status(204).json({ message:'Data deleted successfully'});
  });
});

// Update a task by task_id
router.patch('/get/:task_id', (req, res) => {
  const  task_id = req.params.task_id;
  const { task_name, description, status } = req.body;
  const updateQuery = 'UPDATE tasks SET task_name=?, description=?, status=? WHERE task_id=?';
  connection.query(updateQuery, [task_name, description, status, task_id], (err, result) => {
    if (err) {
      console.error('Error updating task:', err);
      return res.status(500).json({message:'Error updating task'});
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.status(200).json({message:'Task updated successfully'});
  });
});

module.exports = router;