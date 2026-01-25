// TODO APP - VERSÃO PROFISSIONAL COMPLETA

console.log('[INIT] To-Do App iniciando...');

// DOM Elements
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const emptyState = document.getElementById('emptyState');
const loading = document.getElementById('loading');
const charCount = document.getElementById('charCount');

// Filter Elements
const filterBtns = document.querySelectorAll('.filter-btn');
const allCount = document.getElementById('allCount');
const pendingCount = document.getElementById('pendingCount');
const completedCount = document.getElementById('completedCount');

// Footer Elements
const progressText = document.getElementById('progressText');
const progressFill = document.getElementById('progressFill');
const clearCompleted = document.getElementById('clearCompleted');

// State
let todos = [];
let currentFilter = 'all';
let editingId = null;

console.log('[DOM] Verificando elementos...');
console.log('[DOM] todoInput:', todoInput ? 'OK' : 'ERRO');
console.log('[DOM] addBtn:', addBtn ? 'OK' : 'ERRO');
console.log('[DOM] todoList:', todoList ? 'OK' : 'ERRO');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('[LOAD] DOM carregado');
    loadTodos();
    setupEventListeners();
    updateStats();
    renderTodos();
});

// Event Listeners
function setupEventListeners() {
    console.log('[EVENTS] Configurando event listeners...');
    
    // Add todo
    addBtn.addEventListener('click', addTodo);
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTodo();
        }
    });
    
    // Character count
    todoInput.addEventListener('input', updateCharCount);
    
    // Filter buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            setFilter(btn.dataset.filter);
        });
    });
    
    // Clear completed
    clearCompleted.addEventListener('click', clearCompletedTodos);
    
    console.log('[EVENTS] Event listeners configurados');
}

// Character count
function updateCharCount() {
    const length = todoInput.value.length;
    charCount.textContent = `${length} / 100 caracteres`;
    
    if (length >= 90) {
        charCount.style.color = '#f87171';
    } else if (length >= 70) {
        charCount.style.color = '#fbbf24';
    } else {
        charCount.style.color = '#94a3b8';
    }
}

// Add todo
function addTodo() {
    console.log('[TODO] Adicionando tarefa...');
    const text = todoInput.value.trim();
    
    if (!text) {
        showError('Por favor, digite uma tarefa.');
        return;
    }
    
    if (text.length > 100) {
        showError('A tarefa deve ter no máximo 100 caracteres.');
        return;
    }
    
    const todo = {
        id: Date.now(),
        text: text,
        completed: false,
        createdAt: new Date().toISOString(),
        completedAt: null
    };
    
    if (editingId) {
        // Edit existing todo
        const index = todos.findIndex(t => t.id === editingId);
        if (index !== -1) {
            todos[index].text = text;
            todos[index].updatedAt = new Date().toISOString();
        }
        editingId = null;
        addBtn.innerHTML = '<i class="fas fa-plus"></i> Adicionar';
        addBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
    } else {
        // Add new todo
        todos.unshift(todo);
    }
    
    todoInput.value = '';
    updateCharCount();
    saveTodos();
    renderTodos();
    updateStats();
    
    console.log('[TODO] Tarefa adicionada:', todo);
}

// Edit todo
function editTodo(id) {
    console.log('[TODO] Editando tarefa:', id);
    const todo = todos.find(t => t.id === id);
    if (!todo) return;
    
    todoInput.value = todo.text;
    updateCharCount();
    editingId = id;
    
    addBtn.innerHTML = '<i class="fas fa-save"></i> Salvar';
    addBtn.style.background = 'linear-gradient(135deg, #3b82f6, #2563eb)';
    
    todoInput.focus();
    todoInput.select();
}

// Toggle todo
function toggleTodo(id) {
    console.log('[TODO] Alternando tarefa:', id);
    const todo = todos.find(t => t.id === id);
    if (!todo) return;
    
    todo.completed = !todo.completed;
    todo.completedAt = todo.completed ? new Date().toISOString() : null;
    
    saveTodos();
    renderTodos();
    updateStats();
}

// Delete todo
function deleteTodo(id) {
    console.log('[TODO] Deletando tarefa:', id);
    todos = todos.filter(t => t.id !== id);
    
    saveTodos();
    renderTodos();
    updateStats();
}

// Clear completed todos
function clearCompletedTodos() {
    console.log('[TODO] Limpando tarefas concluídas...');
    const completedCount = todos.filter(t => t.completed).length;
    
    if (completedCount === 0) {
        showError('Nenhuma tarefa concluída para limpar.');
        return;
    }
    
    if (confirm(`Tem certeza que deseja excluir ${completedCount} tarefa(s) concluída(s)?`)) {
        todos = todos.filter(t => !t.completed);
        saveTodos();
        renderTodos();
        updateStats();
    }
}

// Set filter
function setFilter(filter) {
    console.log('[FILTER] Alterando filtro:', filter);
    currentFilter = filter;
    
    // Update active button
    filterBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filter === filter) {
            btn.classList.add('active');
        }
    });
    
    renderTodos();
}

// Get filtered todos
function getFilteredTodos() {
    switch (currentFilter) {
        case 'pending':
            return todos.filter(t => !t.completed);
        case 'completed':
            return todos.filter(t => t.completed);
        default:
            return todos;
    }
}

// Render todos
function renderTodos() {
    console.log('[RENDER] Renderizando tarefas...');
    const filteredTodos = getFilteredTodos();
    
    if (filteredTodos.length === 0) {
        todoList.style.display = 'none';
        emptyState.classList.add('show');
        
        // Update empty state message
        const emptyTitle = emptyState.querySelector('h3');
        const emptyText = emptyState.querySelector('p');
        
        switch (currentFilter) {
            case 'pending':
                emptyTitle.textContent = 'Nenhuma tarefa pendente';
                emptyText.textContent = 'Todas as tarefas estão concluídas!';
                break;
            case 'completed':
                emptyTitle.textContent = 'Nenhuma tarefa concluída';
                emptyText.textContent = 'Conclua algumas tarefas para vê-las aqui!';
                break;
            default:
                emptyTitle.textContent = 'Nenhuma tarefa encontrada';
                emptyText.textContent = 'Adicione sua primeira tarefa para começar!';
        }
    } else {
        todoList.style.display = 'block';
        emptyState.classList.remove('show');
        
        todoList.innerHTML = filteredTodos.map(todo => `
            <div class="todo-item ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
                <div class="todo-checkbox ${todo.completed ? 'checked' : ''}" onclick="toggleTodo(${todo.id})"></div>
                <div class="todo-text">${escapeHtml(todo.text)}</div>
                <div class="todo-actions">
                    <button class="todo-btn edit-btn" onclick="editTodo(${todo.id})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="todo-btn delete-btn" onclick="deleteTodo(${todo.id})" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    console.log('[RENDER] Tarefas renderizadas:', filteredTodos.length);
}

// Update statistics
function updateStats() {
    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;
    const pending = total - completed;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    // Update counts
    allCount.textContent = total;
    pendingCount.textContent = pending;
    completedCount.textContent = completed;
    
    // Update progress
    progressText.textContent = `${progress}% concluído`;
    progressFill.style.width = `${progress}%`;
    
    // Update clear button
    clearCompleted.disabled = completed === 0;
    
    console.log('[STATS] Estatísticas atualizadas:', { total, completed, pending, progress });
}

// Save todos to localStorage
function saveTodos() {
    console.log('[STORAGE] Salvando tarefas...');
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Load todos from localStorage
function loadTodos() {
    console.log('[STORAGE] Carregando tarefas...');
    const stored = localStorage.getItem('todos');
    
    if (stored) {
        try {
            todos = JSON.parse(stored);
            console.log('[STORAGE] Tarefas carregadas:', todos.length);
        } catch (error) {
            console.error('[STORAGE] Erro ao carregar tarefas:', error);
            todos = [];
        }
    } else {
        // Add sample todos for demo
        todos = [
            {
                id: 1,
                text: 'Bem-vindo ao To-Do List!',
                completed: false,
                createdAt: new Date().toISOString(),
                completedAt: null
            },
            {
                id: 2,
                text: 'Clique no checkbox para marcar como concluída',
                completed: false,
                createdAt: new Date().toISOString(),
                completedAt: null
            },
            {
                id: 3,
                text: 'Use os filtros para organizar suas tarefas',
                completed: true,
                createdAt: new Date().toISOString(),
                completedAt: new Date().toISOString()
            }
        ];
        saveTodos();
    }
}

// Show error message (simple implementation)
function showError(message) {
    console.error('[ERROR]', message);
    // Create temporary error message
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(239, 68, 68, 0.9);
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

console.log('[SUCCESS] To-Do App carregado com sucesso!');
