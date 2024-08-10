import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Projects.css';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
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
    .then(data => {
      setProjects(data);
    })
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

  const addProject = () => {
    const projectName = prompt("Enter the name of the new project:");
    if (projectName) {
      fetch('https://projectbackend-s6ak.onrender.com/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ name: projectName })
      })
      .then(response => response.json())
      .then(newProject => {
        setProjects([...projects, newProject]);
      })
      .catch(err => console.error(err));
    }
  };

  const addTask = (projectId) => {
    const taskName = prompt("Enter the name of the new task:");
    const taskStatus = prompt("Enter the status of the task (e.g., To Do, In Progress, Done):");
    if (taskName && taskStatus) {
      fetch(`https://projectbackend-s6ak.onrender.com/projects/${projectId}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ name: taskName, status: taskStatus })
      })
      .then(response => response.json())
      .then(newTask => {
        setTasks([...tasks, newTask]);
      })
      .catch(err => console.error(err));
    }
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
    const projectName = prompt("Enter the new name of the project:");
    if (projectName) {
      fetch(`https://projectbackend-s6ak.onrender.com/projects/${projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ name: projectName })
      })
      .then(() => {
        setProjects(projects.map(project => 
          project._id === projectId ? { ...project, name: projectName } : project
        ));
      })
      .catch(err => console.error(err));
    }
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
    const taskName = prompt("Enter the new name of the task:");
    const taskStatus = prompt("Enter the new status of the task:");
    if (taskName && taskStatus) {
      fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ name: taskName, status: taskStatus })
      })
      .then(() => {
        setTasks(tasks.map(task => 
          task._id === taskId ? { ...task, name: taskName, status: taskStatus } : task
        ));
      })
      .catch(err => console.error(err));
    }
  };

  return (
    <div className="container">
      <main>
        <h2>Projects</h2>
        <button onClick={addProject} className="add-button">Add Project</button>
        <ul>
          {projects.map(project => (
            <li key={project._id}>
              <h3>{project.name}</h3>
              <button onClick={() => fetchTasks(project._id)}>View Tasks</button>
              <button onClick={() => addTask(project._id)}>Add Task</button>
              <button onClick={() => deleteProject(project._id)}>Delete Project</button>
              <button onClick={() => updateProject(project._id)}>Update Project</button>
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
                  <button onClick={() => updateTask(task._id)}>Update Task</button>
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
