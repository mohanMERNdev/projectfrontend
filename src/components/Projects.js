import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Projects.css';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [editProjectName, setEditProjectName] = useState('');
  const [editTaskName, setEditTaskName] = useState('');
  const [editTaskStatus, setEditTaskStatus] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    fetch('https://projectbackend-s6ak.onrender.com/projects', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(response => response.json())
    .then(data => setProjects(data))
    .catch(err => console.error(err));
  }, [navigate]);

  const fetchTasks = (projectId) => {
    fetch(`https://projectbackend-s6ak.onrender.com/projects/${projectId}/tasks`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
    .then(response => response.json())
    .then(data => {
      if (Array.isArray(data)) {
        setTasks(data);
        setSelectedProjectId(projectId);
      } else {
        console.error('Tasks data is not an array:', data);
      }
    })
    .catch(err => console.error(err));
  };

  const deleteProject = (projectId) => {
    fetch(`https://projectbackend-s6ak.onrender.com/projects/${projectId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
    .then(() => {
      setProjects(projects.filter(project => project._id !== projectId));
      if (selectedProjectId === projectId) {
        setTasks([]);
        setSelectedProjectId(null);
      }
    })
    .catch(err => console.error(err));
  };

  const updateProject = (projectId) => {
    fetch(`https://projectbackend-s6ak.onrender.com/projects/${projectId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ name: editProjectName })
    })
    .then(() => {
      setProjects(projects.map(project => 
        project._id === projectId ? { ...project, name: editProjectName } : project
      ));
      setEditProjectName('');
    })
    .catch(err => console.error(err));
  };

  const deleteTask = (taskId) => {
    fetch(`https://projectbackend-s6ak.onrender.com/tasks/${taskId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
    .then(() => {
      setTasks(tasks.filter(task => task._id !== taskId));
    })
    .catch(err => console.error(err));
  };

  const updateTask = (taskId) => {
    fetch(`https://projectbackend-s6ak.onrender.com/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ name: editTaskName, status: editTaskStatus })
    })
    .then(() => {
      setTasks(tasks.map(task => 
        task._id === taskId ? { ...task, name: editTaskName, status: editTaskStatus } : task
      ));
      setEditTaskName('');
      setEditTaskStatus('');
    })
    .catch(err => console.error(err));
  };

  return (
    <div className="container">
      <main>
        <h2>Projects</h2>
        <ul>
          {projects.map(project => (
            <li key={project._id}>
              <h3>{project.name}</h3>
              <button onClick={() => fetchTasks(project._id)}>View Tasks</button>
              <button onClick={() => deleteProject(project._id)}>Delete Project</button>
              <button onClick={() => setEditProjectName(prompt("Enter new project name:", project.name))}>
                Update Project
              </button>
              <button onClick={() => updateProject(project._id)}>Save Changes</button>
            </li>
          ))}
        </ul>

        {selectedProjectId && (
          <div>
            <h3>Tasks for Project ID: {selectedProjectId}</h3>
            <ul>
              {tasks.map(task => (
                <li key={task._id}>
                  <p>{task.name} - Status: {task.status}</p>
                  <button onClick={() => deleteTask(task._id)}>Delete Task</button>
                  <button onClick={() => {
                    setEditTaskName(prompt("Enter new task name:", task.name));
                    setEditTaskStatus(prompt("Enter new task status:", task.status));
                  }}>
                    Update Task
                  </button>
                  <button onClick={() => updateTask(task._id)}>Save Task Changes</button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
};

export default Projects;
