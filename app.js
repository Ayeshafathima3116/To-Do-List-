// SELECT ELEMENTS (matching your new HTML)
const input = document.getElementById("todo-input");
const addBtn = document.getElementById("add-btn");
const list = document.getElementById("todo-list");
const clearCompletedBtn = document.getElementById("clear-completed");
const clearAllBtn = document.getElementById("clear-all");

// State
let todos = [];

// Load from localStorage
function loadTodos() {
  const stored = localStorage.getItem("todos");
  if (stored) {
    todos = JSON.parse(stored);
  }
}
loadTodos();

// Save to localStorage
function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

// Render tasks
function render() {
  list.innerHTML = "";

  todos.forEach(todo => {
    const li = document.createElement("li");
    li.className = "todo-item" + (todo.completed ? " todo-completed" : "");
    li.dataset.id = todo.id;

    // Task text
    const text = document.createElement("span");
    text.className = "todo-text";
    text.textContent = todo.text;
    text.addEventListener("click", () => toggleComplete(todo.id));

    // Remove button
    const removeBtn = document.createElement("button");
    removeBtn.className = "remove-btn";
    removeBtn.innerHTML = "🗑️";
    removeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      deleteTodo(todo.id);
    });

    li.appendChild(text);
    li.appendChild(removeBtn);
    list.appendChild(li);
  });
}

// Add task
function addTodo() {
  const text = input.value.trim();
  if (!text) return;

  todos.unshift({
    id: Date.now().toString(),
    text: text,
    completed: false
  });

  saveTodos();
  render();
  input.value = "";
}

// Toggle complete
function toggleComplete(id) {
  todos = todos.map(todo =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );
  saveTodos();
  render();
}

// Delete single task
function deleteTodo(id) {
  todos = todos.filter(todo => todo.id !== id);
  saveTodos();
  render();
}

// Clear completed tasks
function clearCompleted() {
  todos = todos.filter(todo => !todo.completed);
  saveTodos();
  render();
}

// Clear all
function clearAll() {
  if (!confirm("Clear all tasks?")) return;
  todos = [];
  saveTodos();
  render();
}

// Event listeners
addBtn.addEventListener("click", addTodo);
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTodo();
});
clearCompletedBtn.addEventListener("click", clearCompleted);
clearAllBtn.addEventListener("click", clearAll);

// Initial render
render();
