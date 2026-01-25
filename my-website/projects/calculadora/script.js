// VARIÁVEIS GLOBAIS
let currentDisplay = '0';
let previousDisplay = '';
let operator = null;
let shouldResetDisplay = false;

// ELEMENTOS DO DOM
const currentDisplayEl = document.getElementById('currentDisplay');
const previousDisplayEl = document.getElementById('previousDisplay');

// FUNÇÕES DO DISPLAY
function updateDisplay() {
    currentDisplayEl.textContent = currentDisplay;
    previousDisplayEl.textContent = previousDisplay;
}

function clearAll() {
    currentDisplay = '0';
    previousDisplay = '';
    operator = null;
    shouldResetDisplay = false;
    updateDisplay();
}

function clearEntry() {
    currentDisplay = '0';
    updateDisplay();
}

function deleteLast() {
    if (currentDisplay.length > 1) {
        currentDisplay = currentDisplay.slice(0, -1);
    } else {
        currentDisplay = '0';
    }
    updateDisplay();
}

// FUNÇÕES DE NÚMEROS
function appendNumber(num) {
    if (shouldResetDisplay) {
        currentDisplay = '0';
        shouldResetDisplay = false;
    }
    
    if (currentDisplay === '0') {
        currentDisplay = num;
    } else {
        currentDisplay += num;
    }
    
    updateDisplay();
}

function appendDecimal() {
    if (shouldResetDisplay) {
        currentDisplay = '0';
        shouldResetDisplay = false;
    }
    
    if (!currentDisplay.includes('.')) {
        currentDisplay += '.';
    }
    
    updateDisplay();
}

// FUNÇÕES DE OPERADORES
function appendOperator(op) {
    if (operator && !shouldResetDisplay) {
        calculate();
    }
    
    previousDisplay = currentDisplay + ' ' + op;
    operator = op;
    shouldResetDisplay = true;
    updateDisplay();
}

function calculate() {
    if (!operator || !previousDisplay) return;
    
    const prevValue = parseFloat(previousDisplay.split(' ')[0]);
    const currentValue = parseFloat(currentDisplay);
    let result;
    
    switch (operator) {
        case '+':
            result = prevValue + currentValue;
            break;
        case '-':
            result = prevValue - currentValue;
            break;
        case '*':
            result = prevValue * currentValue;
            break;
        case '/':
            result = currentValue !== 0 ? prevValue / currentValue : 'Error';
            break;
        default:
            return;
    }
    
    currentDisplay = result.toString();
    previousDisplay = '';
    operator = null;
    shouldResetDisplay = true;
    updateDisplay();
}

// FUNÇÕES CIENTÍFICAS
function scientificFunction(func) {
    const value = parseFloat(currentDisplay);
    let result;
    
    switch (func) {
        case 'sin':
            result = Math.sin(value * Math.PI / 180);
            break;
        case 'cos':
            result = Math.cos(value * Math.PI / 180);
            break;
        case 'tan':
            result = Math.tan(value * Math.PI / 180);
            break;
        case 'log':
            result = value > 0 ? Math.log10(value) : 'Error';
            break;
        case 'ln':
            result = value > 0 ? Math.log(value) : 'Error';
            break;
        case 'sqrt':
            result = value >= 0 ? Math.sqrt(value) : 'Error';
            break;
        case 'pow2':
            result = Math.pow(value, 2);
            break;
        case 'pow3':
            result = Math.pow(value, 3);
            break;
        default:
            return;
    }
    
    currentDisplay = result.toString();
    shouldResetDisplay = true;
    updateDisplay();
}

// FUNÇÕES DE CONSTANTES
function appendConstant(constant) {
    let value;
    
    switch (constant) {
        case 'pi':
            value = Math.PI;
            break;
        case 'e':
            value = Math.E;
            break;
        default:
            return;
    }
    
    if (shouldResetDisplay || currentDisplay === '0') {
        currentDisplay = value.toString();
        shouldResetDisplay = false;
    } else {
        currentDisplay += value.toString();
    }
    
    updateDisplay();
}

// FUNÇÕES DE MEMÓRIA
let memory = 0;

function memoryFunction(action) {
    const value = parseFloat(currentDisplay);
    
    switch (action) {
        case 'MC':
            memory = 0;
            break;
        case 'MR':
            currentDisplay = memory.toString();
            shouldResetDisplay = true;
            break;
        case 'M+':
            memory += value;
            break;
        default:
            return;
    }
    
    updateDisplay();
}

// FUNÇÕES UTILITÁRIAS
function toggleSign() {
    const value = parseFloat(currentDisplay);
    currentDisplay = (-value).toString();
    updateDisplay();
}

function appendParenthesis(paren) {
    if (shouldResetDisplay) {
        currentDisplay = '0';
        shouldResetDisplay = false;
    }
    
    if (currentDisplay === '0' && paren === '(') {
        currentDisplay = '(';
    } else {
        currentDisplay += paren;
    }
    
    updateDisplay();
}

// MODO TOGGLE
const basicModeBtn = document.getElementById('basicMode');
const scientificModeBtn = document.getElementById('scientificMode');
const basicButtonsEl = document.getElementById('basicButtons');
const scientificButtonsEl = document.getElementById('scientificButtons');

basicModeBtn.addEventListener('click', () => {
    basicModeBtn.classList.add('active');
    scientificModeBtn.classList.remove('active');
    basicButtonsEl.style.display = 'grid';
    scientificButtonsEl.style.display = 'none';
});

scientificModeBtn.addEventListener('click', () => {
    scientificModeBtn.classList.add('active');
    basicModeBtn.classList.remove('active');
    basicButtonsEl.style.display = 'grid';
    scientificButtonsEl.style.display = 'grid';
});

// SUPORTE DE TECLADO
document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') {
        appendNumber(e.key);
    } else if (e.key === '.') {
        appendDecimal();
    } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
        appendOperator(e.key);
    } else if (e.key === 'Enter' || e.key === '=') {
        calculate();
    } else if (e.key === 'Escape') {
        clearAll();
    } else if (e.key === 'Backspace') {
        deleteLast();
    }
});

// INICIALIZAÇÃO
updateDisplay();
