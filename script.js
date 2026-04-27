const editor = document.querySelector('#editor');
const highlighting = document.querySelector('#highlighting-content');
const lineNumbers = document.querySelector('#line-numbers');
const output = document.querySelector('#output');

// Starter Code
editor.value = `// Welcome to Nexus IDE
function helloWorld() {
    let message = "Coding is life";
    console.log(message);
    
    for(let i=1; i<=3; i++) {
        console.log("Count: " + i);
    }
}

helloWorld();`;

// Run highlighting on load
handleInput();

function handleInput() {
    updateHighlighting();
    updateLineNumbers();
}

function updateHighlighting() {
    let code = editor.value;

    // Syntax Highlighting Engine (Regex)
    let html = code
        .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") // Escape
        .replace(/\b(function|return|let|const|var|if|for|while|else|class|export|import)\b/g, '<span class="token-keyword">$1</span>')
        .replace(/(".+?"|'.+?'|`.+?`)/g, '<span class="token-string">$1</span>')
        .replace(/\b(\d+)\b/g, '<span class="token-number">$1</span>')
        .replace(/\b(console|log|alert|window|document)\b/g, '<span class="token-function">$1</span>')
        .replace(/(\/\/.*)/g, '<span class="token-comment">$1</span>');

    highlighting.innerHTML = html;
}

function updateLineNumbers() {
    const lines = editor.value.split('\n').length;
    lineNumbers.innerHTML = '';
    for (let i = 1; i <= lines; i++) {
        const div = document.createElement('div');
        div.innerText = i;
        lineNumbers.appendChild(div);
    }
}

function handleScroll() {
    const pre = document.querySelector('#highlighting');
    pre.scrollTop = editor.scrollTop;
    pre.scrollLeft = editor.scrollLeft;
    lineNumbers.scrollTop = editor.scrollTop;
}

function handleTab(e) {
    if (e.key === 'Tab') {
        e.preventDefault();
        const start = editor.selectionStart;
        const end = editor.selectionEnd;

        editor.value = editor.value.substring(0, start) + "    " + editor.value.substring(end);
        editor.selectionStart = editor.selectionEnd = start + 4;
        handleInput();
    }
}

function runCode() {
    output.innerHTML = '<span class="prompt">>></span> Running script...<br>';
    
    // Intercept console.log to show in our UI terminal
    const originalLog = console.log;
    const logs = [];
    console.log = (msg) => logs.push(msg);

    try {
        eval(editor.value);
        logs.forEach(log => {
            output.innerHTML += `> ${log}<br>`;
        });
        if(logs.length === 0) output.innerHTML += `> Execution finished (No output).`;
    } catch (err) {
        output.innerHTML += `<span style="color: #ff7b72">> Error: ${err.message}</span>`;
    }

    console.log = originalLog; // Restore original console
}

function clearTerminal() {
    output.innerHTML = '<span class="prompt">>></span> Terminal cleared.';
}

function saveFile() {
    const text = editor.value;
    const blob = new Blob([text], { type: 'text/javascript' });
    const element = document.createElement('a');
    element.setAttribute('href', window.URL.createObjectURL(blob));
    element.setAttribute('download', 'nexus_script.js');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}