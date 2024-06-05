console.log('Renderer script running'); // Ensure script is running

// Listen for 'update-todo-list' event and update the DOM
window.api.on('update-todo-list', (event, todo) => {
  console.log('Received todo in main window:', todo); // Debug log

  const todoList = document.getElementById('todo-list');
  console.log('Todo list element:', todoList); // Debug log

  if (todoList) {
    const listItem = document.createElement('li');
    listItem.textContent = todo;
    console.log('Appending list item with content:', listItem.textContent); // Debug log
    todoList.appendChild(listItem);
    console.log('Current todo list:', todoList.innerHTML); // Debug log to see the inner HTML of the list
  } else {
    console.error('Todo list element not found');
  }
});

// Handle form submission in add window
document.getElementById('todo-form')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const todoInput = document.getElementById('todo-input');
  const todo = todoInput.value.trim();  // Trim any leading/trailing whitespace
  console.log('Sending todo:', todo); // Debug log
  if (todo) {
    window.api.send('add-todo', todo);
    todoInput.value = '';
  } else {
    console.warn('Todo input is empty'); // Debug log for empty input
  }
});
