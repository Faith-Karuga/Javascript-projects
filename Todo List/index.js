const taskInput = document.getElementById('taskInput');
    const taskDate = document.getElementById('taskDate');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const completedList = document.getElementById('completedList');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let editingIndex = null;

    function saveTasks() { 
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function renderTasks() {
      taskList.innerHTML = '';
      completedList.innerHTML = '';
      
      tasks.forEach((task, index) => {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => {
          tasks[index].completed = checkbox.checked;
          saveTasks();
          renderTasks();
        });

        const label = document.createElement('span');
        label.className = 'task-label';
        let displayText = task.text;
        if (task.date) {
          displayText += ` (${task.date})`;
        }
        label.textContent = displayText;

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'delete-btn';
        deleteBtn.addEventListener('click', () => {
          tasks.splice(index, 1);
          saveTasks();
          renderTasks();
        });

        if (task.completed) {
          const li = document.createElement('li');
          li.appendChild(checkbox);
          li.appendChild(label);
          li.appendChild(deleteBtn);
          completedList.appendChild(li);
        } else {
          const li = document.createElement('li');
          const buttonContainer = document.createElement('div');
          buttonContainer.className = 'button-container';

          const editBtn = document.createElement('button');
          editBtn.textContent = 'Edit';
          editBtn.className = 'edit-btn';
          editBtn.addEventListener('click', () => {
            taskInput.value = task.text;
            taskDate.value = task.date || '';
            editingIndex = index;
            addTaskBtn.textContent = 'Update';
            taskInput.focus();
          });

          buttonContainer.appendChild(editBtn);
          buttonContainer.appendChild(deleteBtn);

          li.appendChild(checkbox);
          li.appendChild(label);
          li.appendChild(buttonContainer);
          taskList.appendChild(li);
        }
      });
    }

    addTaskBtn.addEventListener('click', () => {
      const text = taskInput.value.trim();
      const date = taskDate.value;
      
      if (text === '' || date === '') {
        alert('Please provide both task and date');
        return;
      }

      if (editingIndex !== null) {
        tasks[editingIndex].text = text;
        tasks[editingIndex].date = date;
        editingIndex = null;
        addTaskBtn.textContent = 'Add';
      } else {
        tasks.push({ text, completed: false, date });
      }
      
      saveTasks();
      renderTasks();
      taskInput.value = '';
      taskDate.value = '';
    });

    taskInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        addTaskBtn.click();
      }
    });

    renderTasks();