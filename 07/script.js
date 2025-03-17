// script.js - Task Tracker Application with Comments

// Ensure the script runs only when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
    // Retrieve stored tasks from local storage or initialize an empty array
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    
    // Get references to the necessary HTML elements
    const taskList = document.getElementById("task-list");
    const taskInput = document.getElementById("task-input");
    const addTaskBtn = document.getElementById("add-task-btn");
    const clearTasksBtn = document.getElementById("clear-tasks-btn");
    
    // Save tasks to local storage
    function saveTasks() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }
    
    // Render the list of tasks on the screen
    function renderTasks() {
        taskList.innerHTML = ""; // Clear existing tasks
        tasks.forEach(task => renderTask(task)); // Render each task
    }
    
    // Render a single task item
    function renderTask(task) {
        const li = document.createElement("li");
        li.textContent = task.title;
        li.classList.add(task.completed ? "completed" : "pending");
        
        // Create a button to mark the task as complete
        const completeBtn = document.createElement("button");
        completeBtn.textContent = "✔";
        completeBtn.addEventListener("click", function () {
            completeTask(task.title);
        });
        
        // Create a button to delete the task
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "❌";
        deleteBtn.addEventListener("click", function () {
            deleteTask(task.title);
        });
        
        // Append buttons to the task item
        li.appendChild(completeBtn);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    }
    
    // Function to add a new task
    function addTask() {
        const title = taskInput.value.trim(); // Get user input
        // Validate input: must be unique and non-empty
        if (!title || tasks.some(task => task.title === title)) {
            alert("Task must have a unique, non-empty title.");
            return;
        }
        
        // Create and store the new task
        const newTask = { title, completed: false };
        tasks.push(newTask);
        saveTasks(); // Save to local storage
        renderTasks(); // Refresh UI
        taskInput.value = ""; // Clear input field
    }
    
    // Function to mark a task as completed or incomplete
    function completeTask(title) {
        tasks = tasks.map(task =>
            task.title === title ? { ...task, completed: !task.completed } : task
        );
        saveTasks(); // Save to local storage
        renderTasks(); // Refresh UI
    }
    
    // Function to delete a task
    function deleteTask(title) {
        tasks = tasks.filter(task => task.title !== title);
        saveTasks(); // Save to local storage
        renderTasks(); // Refresh UI
    }
    
    // Function to clear all tasks from the list
    function clearTasks() {
        tasks = [];
        saveTasks(); // Save empty list to local storage
        renderTasks(); // Refresh UI
    }
    
    // Event listeners for task actions
    addTaskBtn.addEventListener("click", addTask);
    clearTasksBtn.addEventListener("click", clearTasks);
    
    // Initial render of tasks when the page loads
    renderTasks();
});
