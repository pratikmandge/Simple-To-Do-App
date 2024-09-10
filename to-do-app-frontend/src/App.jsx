import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Toggle from 'react-toggle';
import "react-toggle/style.css"
import './App.css'

function App() {
  const [tasks, setTasks] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [newTask, setNewTask] = useState({ description: '', category: '' });
  const URL = `${import.meta.env.VITE_API_URL}/tasks`

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const result = await axios.get(URL);
    setTasks(result.data);
  };

  const handleAddTask = async () => {
    const task = { ...newTask, id: Date.now().toString(), completed: false };
    await axios.post(URL, task);
    setTasks(prevTasks => [...prevTasks, task]);
    setNewTask({ description: '', category: '' });
  };

  const handleUpdateTask = async (id, updates) => {
    await axios.put(`${URL}/${id}`, updates);
    setTasks(prevTasks => prevTasks.map(task => task.id === id ? { ...task, ...updates } : task));
  };

  const handleDeleteTask = async (id) => {
    await axios.delete(`${URL}/${id}`);
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  };

  const incompleteTasks = tasks.filter(task => !task.completed).length;
  const completedTasks = tasks.filter(task => task.completed).length;

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const d = new Date();
  let month = months[d.getMonth()];

  return (
    <div className={isDarkMode ? 'dark-mode' : 'light-mode'}>
      <header>
        <Toggle
          defaultChecked={isDarkMode}
          icons={false}
          onChange={() => setIsDarkMode(prevMode => !prevMode)} />
        {/* <span>{isDarkMode ? 'Dark Mode' : 'Light Mode'}</span> */}
        <h1>{month} {d.getDate()}, {d.getFullYear()}</h1>
        <p>incomplete: {incompleteTasks} | completed: {completedTasks}</p>
      </header>
      <hr />
      <main>
        <div>
          <input
            type="text"
            value={newTask.description}
            onChange={e => setNewTask({ ...newTask, description: e.target.value })}
            placeholder="Task description"
          />
          <input
            type="text"
            value={newTask.category}
            onChange={e => setNewTask({ ...newTask, category: e.target.value })}
            placeholder="Category"
          />
        </div>
        <p><button onClick={handleAddTask}>Add Task +</button></p>
        <section>
          <h3>Incomplete</h3>
          {tasks.filter(task => !task.completed).map(task => (
            <div key={task.id} className='incomplete'>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleUpdateTask(task.id, { completed: !task.completed })}
              />
              {task.description} ({task.category})
              <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
            </div>
          ))}
        </section>
        <section>
          <h3>Completed</h3>
          {tasks.filter(task => task.completed).map(task => (
            <div key={task.id} className='completed'>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleUpdateTask(task.id, { completed: !task.completed })}
              />
              {task.description} ({task.category})
              <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}


export default App
