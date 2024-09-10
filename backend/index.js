import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { JSONFilePreset } from 'lowdb/node'

// Create Express app
const app = express();
const port = 8080;

// JSON file
const db = await JSONFilePreset('db.json', { tasks: [] })

// To resolve CORS error in Frontend
app.use(cors());
app.use(bodyParser.json());

// Get all To-Do's
app.get('/tasks', (req, res) => {
    res.json(db.data.tasks);
});

// Create new To-Do
app.post('/tasks', async (req, res) => {
    const newTask = req.body;
    db.data.tasks.push(newTask);
    await db.write();
    res.status(201).json(newTask);
});

// Update To-Do
app.put('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    const updatedTask = req.body;
    const index = db.data.tasks.findIndex(task => task.id === id);
    if (index === -1) return res.status(404).send('Task not found');
    db.data.tasks[index] = { ...db.data.tasks[index], ...updatedTask };
    await db.write();
    res.json(db.data.tasks[index]);
});

// Delete selected To-Do's
app.delete('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    db.data.tasks = db.data.tasks.filter(task => task.id !== id);
    await db.write();
    res.status(204).send();
});

// Server running port
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
