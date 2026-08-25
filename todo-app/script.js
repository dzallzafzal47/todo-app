// =============================================
// 📝 Todo List App - Complete JavaScript
// =============================================

// ===== STATE =====
let todos = [];
let currentFilter = 'all';

// ===== DOM ELEMENTS =====
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const taskCount = document.getElementById('taskCount');
const clearAllBtn = document.getElementById('clearAll');
const filterBtns = document.querySelectorAll('.filter-btn');

// ===== LOAD FROM LOCALSTORAGE =====
function loadTodos() {
    const saved = localStorage.getItem('todos');
    if (saved) {
        try {
            todos = JSON.parse(saved);
        } catch {
            todos = [];
        }
    }
}

// ===== SAVE TO LOCALSTORAGE =====
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// ===== RENDER TASKS =====
function renderTodos() {
    // Filter tasks
    let filteredTodos = todos;
    if (currentFilter === 'active') {
        filteredTodos = todos.filter(t => !t.completed);
    } else if (currentFilter === 'completed') {
        filteredTodos = todos.filter(t => t.completed);
    }
    
    // Clear list
    todoList.innerHTML = '';
    
    // Empty state
    if (filteredTodos.length === 0) {
        const emptyMessages = {
            all: 'No tasks yet. Add one above! ✨',
            active: 'No active tasks. You\'re all caught up! 🎉',
            completed: 'No completed tasks yet. Keep going! 💪'
        };
        todoList.innerHTML = `
            <div class="empty-state">
                <span class="icon">📭</span>
                <p>${emptyMessages[currentFilter]}</p>
            </div>
        `;
        updateCounter();
        return;
    }
    
    // Render each task
    filteredTodos.forEach((todo, index) => {
        const li = document.createElement('li');
        li.className = 'todo-item';
        li.dataset.index = index;
        
        // Get original index in todos array
        const originalIndex = todos.indexOf(todo);
        
        li.innerHTML = `
            <input type="checkbox" ${todo.completed ? 'checked' : ''} 
                   data-index="${originalIndex}">
            <span class="task-text ${todo.completed ? 'completed' : ''}">${escapeHTML(todo.text)}</span>
            <button class="delete-btn" data-index="${originalIndex}">✕</button>
        `;
        
        todoList.appendChild(li);
    });
    
    updateCounter();
}

// ===== UPDATE COUNTER =====
function updateCounter() {
    const active = todos.filter(t => !t.completed).length;
    taskCount.textContent = active;
}

// ===== ADD TASK =====
function addTodo() {
    const text = todoInput.value.trim();
    if (!text) {
        todoInput.focus();
        return;
    }
    
    todos.push({
        id: Date.now(),
        text: text,
        completed: false,
        createdAt: new Date().toISOString()
    });
    
    todoInput.value = '';
    todoInput.focus();
    saveTodos();
    renderTodos();
}

// ===== DELETE TASK =====
function deleteTodo(index) {
    todos.splice(index, 1);
    saveTodos();
    renderTodos();
}

// ===== TOGGLE COMPLETED =====
function toggleTodo(index) {
    todos[index].completed = !todos[index].completed;
    saveTodos();
    renderTodos();
}

// ===== CLEAR ALL =====
function clearAllTodos() {
    if (todos.length === 0) return;
    if (confirm('Delete all tasks?')) {
        todos = [];
        saveTodos();
        renderTodos();
    }
}

// ===== SET FILTER =====
function setFilter(filter) {
    currentFilter = filter;
    
    filterBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === filter);
    });
    
    renderTodos();
}

// ===== UTILITY: ESCAPE HTML =====
function escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===== EVENT LISTENERS =====
addBtn.addEventListener('click', addTodo);

todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTodo();
});

clearAllBtn.addEventListener('click', clearAllTodos);

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        setFilter(btn.dataset.filter);
    });
});

// ===== EVENT DELEGATION =====
todoList.addEventListener('click', (e) => {
    // Delete button
    if (e.target.classList.contains('delete-btn')) {
        const index = parseInt(e.target.dataset.index);
        deleteTodo(index);
    }
    
    // Checkbox
    if (e.target.type === 'checkbox') {
        const index = parseInt(e.target.dataset.index);
        toggleTodo(index);
    }
});

// ===== KEYBOARD SHORTCUT: ESC to clear input =====
todoInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        todoInput.value = '';
        todoInput.blur();
    }
});

// ===== INIT =====
loadTodos();
renderTodos();
todoInput.focus();

console.log('📝 Todo List App loaded!');
console.log(`📊 ${todos.length} tasks loaded from LocalStorage`);
