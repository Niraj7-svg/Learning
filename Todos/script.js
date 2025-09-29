document.addEventListener('DOMContentLoaded', () => {
    const todoInput = document.getElementById('todo-input');
    const addTaskButton = document.getElementById('add-tsk-btn');
    const todoList = document.getElementById('todo-list');

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    // --- Event Listeners ---
    addTaskButton.addEventListener('click', () => {
        const taskText = todoInput.value.trim();
        if (taskText === "") return;

        const newTask = {
            id: Date.now(),
            text: taskText,
            completed: false,
        };

        tasks.push(newTask);
        todoInput.value = ""; 

        saveAndRender();
    });

    // --- Core Functions ---
    function createTaskElement(task) {
        const li = document.createElement('li');
        li.setAttribute("data-id", task.id);
        
        // REVERTED: Using your original TailwindCSS class string for the li
        li.className = "flex items-center justify-between bg-gray-700 p-1.5 rounded-md";

        // NOTE: A 'completed' class is added when the task is done.
        // You can add CSS for `.completed span { text-decoration: line-through; }` for a visual effect.
        if (task.completed) {
            li.classList.add('completed');
        }

        // REVERTED: Using your original button classes and span logic
        li.innerHTML = `
          <span class="${task.completed ? 'toggleon' : 'toggleoff'}">${task.text}</span>
          <button class="text-red-500 hover:text-red-900 hover: border-2 border-red-500 p-1.5 rounded-md hover:border-red-900 nopass" >Delete</button>
        `;

        // Event listener for toggling completion
        li.addEventListener('click', () => {
            const taskToToggle = tasks.find(t => t.id === task.id);
            taskToToggle.completed = !taskToToggle.completed;
            saveAndRender();
        });

        // Event listener for the delete button
        const deleteButton = li.querySelector('button');
        deleteButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevents the li click from firing
            tasks = tasks.filter(t => t.id !== task.id);
            saveAndRender();
        });

        return li;
    }

    function saveAndRender() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    }
    
    function renderTasks() {
        todoList.innerHTML = "";
        tasks.forEach(task => {
            const taskElement = createTaskElement(task);
            todoList.appendChild(taskElement);
        });
    }

    // Initial render when the page loads
    renderTasks();
});