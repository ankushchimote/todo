window.addEventListener('load', () => {
    const form = document.querySelector("#new-task-form");
    const input = document.querySelector("#new-task-input");
    const list_el = document.querySelector("#tasks");
    const clearAllButton = document.querySelector("#removeall");
    const searchInput = document.querySelector("#new-task-input");
    const searchButton = document.querySelector("#search-button");

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const task = input.value.trim(); // Trim the input value to remove leading and trailing whitespace

        if (task !== '') { // Check if the task is not empty
            if (!isTaskAlreadyPresent(task)) { // Check if the task is not already present in the list
                const task_el = createTaskElement(task); // Create task element
                list_el.appendChild(task_el); // Append task element to list
                input.value = ''; // Clear input field
                saveTasksToLocalStorage(); // Save tasks to local storage
            } else {
                alert("Task is already present!"); // Notify the user if the task is already present in the list
            }
        } else {
            alert("Task cannot be empty!"); // Notify the user if the input is empty
        }
    });

    clearAllButton.addEventListener('click', () => {
        clearAllTasks();
        saveTasksToLocalStorage(); // Save tasks to local storage after clearing all tasks
    });

    // Load tasks from local storage when the page loads
    loadTasksFromLocalStorage();

    searchButton.addEventListener('click', () => {
        const searchTerm = searchInput.value.trim(); // Trim the search input value to remove leading and trailing whitespace
        searchTasks(searchTerm);
    });

    function createTaskElement(taskText) {
        const task_el = document.createElement('div');
        task_el.classList.add('task');

        const task_content_el = document.createElement('div');
        task_content_el.classList.add('content');
        task_content_el.addEventListener('click', toggleLineThrough);

        const task_input_el = document.createElement('input');
        task_input_el.classList.add('text');
        task_input_el.type = 'text';
        task_input_el.value = taskText;
        task_input_el.setAttribute('readonly', 'readonly');

        task_content_el.appendChild(task_input_el);

        const task_actions_el = document.createElement('div');
        task_actions_el.classList.add('actions');

        const task_edit_el = document.createElement('button');
        task_edit_el.classList.add('edit');
        task_edit_el.innerText = 'Edit';

        const task_delete_el = document.createElement('button');
        task_delete_el.classList.add('delete');
        task_delete_el.innerText = 'Delete';

        task_actions_el.appendChild(task_edit_el);
        task_actions_el.appendChild(task_delete_el);

        task_el.appendChild(task_content_el);
        task_el.appendChild(task_actions_el);

        task_edit_el.addEventListener('click', () => {
            if (task_edit_el.innerText.toLowerCase() === "edit") {
                task_edit_el.innerText = "Save";
                task_input_el.removeAttribute("readonly");
                task_input_el.focus();
            } else {
                task_edit_el.innerText = "Edit";
                task_input_el.setAttribute("readonly", "readonly");
                saveTasksToLocalStorage(); // Save tasks to local storage after editing
            }
        });

        task_delete_el.addEventListener('click', () => {
            list_el.removeChild(task_el);
            saveTasksToLocalStorage(); // Save tasks to local storage after deleting
        });

        return task_el;
    }

    function toggleLineThrough() {
        this.classList.toggle('line-through');
        saveTasksToLocalStorage(); // Save tasks to local storage after toggling line-through
    }

    function clearAllTasks() {
        list_el.innerHTML = '';
        localStorage.removeItem('tasks'); // Remove tasks from local storage when clearing all tasks
    }

    function saveTasksToLocalStorage() {
        const tasks = [];
        const taskElements = list_el.querySelectorAll('.task .text');
        taskElements.forEach(taskEl => {
            tasks.push(taskEl.value);
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasksFromLocalStorage() {
        const storedTasks = JSON.parse(localStorage.getItem('tasks'));
        if (storedTasks) {
            storedTasks.forEach(task => {
                const task_el = createTaskElement(task);
                list_el.appendChild(task_el);
            });
        }
    }

    function isTaskAlreadyPresent(task) {
        const taskElements = list_el.querySelectorAll('.task .text');
        for (let i = 0; i < taskElements.length; i++) {
            if (taskElements[i].value === task) {
                return true;
            }
        }
        return false;
    }

    function searchTasks(searchTerm) {
        const taskElements = list_el.querySelectorAll('.task .text');
        taskElements.forEach(taskEl => {
            const taskText = taskEl.value.toLowerCase();
            if (taskText.includes(searchTerm.toLowerCase())) {
                taskEl.closest('.task').style.display = 'block';
            } else {
                taskEl.closest('.task').style.display = 'none';
            }
        });
    }
});