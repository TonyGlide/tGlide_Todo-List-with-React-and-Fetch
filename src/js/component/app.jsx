import React, { useState, useEffect } from 'react';



			
function ToDoList() {
	const [tasks, setTasks] = useState([]);
	const [newTask, setNewTask] = useState("");
	const [error, setError] = useState("");

	useEffect(() => {
		fetchTasks();
	}, []);

	const fetchTasks = () => {
		fetch("https://playground.4geeks.com/todo/users/tGlide")
			.then(response => response.json())
			.then(data => setTasks(data.todos || []))
			.catch(error => {
				console.error('Error loading the tasks...', error);
				setError("Failed to load tasks.");
			});
	};

	function handleInputChange(event) {
		setNewTask(event.target.value);
	}

	function handleKeyPress(event) {
		if (event.key === 'Enter' && newTask.trim() !== "") {
			addTask();
		}
	}

	const addTask = () => {
		const taskData = { label: newTask, is_done: false };
		fetch('https://playground.4geeks.com/todo/todos/tGlide', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(taskData)
		})
			.then(response => response.json())
			.then(data => {
				console.log("Task added:", data);
				setTasks(prevTasks => [...prevTasks, { id: data.id, label: data.label, is_done: data.is_done }]);
				setNewTask("");
			})
			.catch(error => {
				console.error("Error adding task...", error);
				setError("Failed to add task.");
			});
	};


	const deleteTask = (taskId) => {
		fetch(`https://playground.4geeks.com/todo/todos/${taskId}`, {
			method: 'DELETE'
		})
			.then(() => {
				const updatedTasks = tasks.filter(task => task.id !== taskId);
				setTasks(updatedTasks);
			})
			.catch(error => {
				console.error('Error deleting task...', error);
				setError("Failed to delete task.");
			});
	};

	const cleanAllTasks = () => {
		fetch('https://playground.4geeks.com/todo/todos/tGlide', {
			method: 'DELETE'
		})
			.then(() => {
				setTasks([]);
			})
			.catch(error => {
				console.error('Error cleaning all tasks...', error);
				setError("Failed to clean tasks.");
			});
	};

	return (
		<div className="toDoList">
			<h1>To-do-s</h1>
			{error && <p className="error">{error}</p>}
			<div className='enterTask'>
				<input
					type="text"
					placeholder="Enter Task"
					value={newTask}
					onChange={handleInputChange}
					onKeyDown={handleKeyPress}
				/>
				<button className="addButton" onClick={addTask}>add</button>
			</div>
			<ol>
				{tasks.map((task) => (
					  <li key={task.id}>
                        {task.label}
                       <button className="deleteButton" onClick={() => deleteTask(task.id)}>X</button>
                    </li>
				))}
			</ol>
			<button className="cleanButton" onClick={cleanAllTasks}>Clean All</button>
		</div>
				
	);
}


export default ToDoList;