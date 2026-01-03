const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    function saveTasks() { 
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function renderTasks() {
      taskList.innerHTML = '';
      tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = task.completed ? 'completed' : '';

        const label = document.createElement('span');
        label.textContent = task.text;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => {
          tasks[index].completed = checkbox.checked;
          saveTasks();
          renderTasks();
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'delete-btn';
        deleteBtn.addEventListener('click', () => {
          tasks.splice(index, 1);
          saveTasks();
          renderTasks();
        });

        li.prepend(checkbox);
        li.appendChild(label);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
      });
    }

    addTaskBtn.addEventListener('click', () => {
      const text = taskInput.value.trim();
      if (text === '') return;

      tasks.push({ text, completed: false });
      saveTasks();
      renderTasks();
      taskInput.value = '';
    });

    renderTasks();