/*
Posicionar Cursor em Input
const length = terminal.value.length;
terminal.setSelectionRange(length -1, length);
*/


const terminal = document.querySelector("#terminal");
let lastCommands = [];
let auxLastCommands = [];
let index = -1;

// BIBLIOTECA DE PROGRAMAS PARA O TERMINAL
const library = {
    users: [
        {name: 'root', pwd: '02', ip: '127.0.0.1'},
        {name: 'vinicius', pwd: '01', ip: '127.0.0.1'}
    ],
    loggedUser: 0,
    clear: function(){
        this.setTerminal('', true);
    },
    whoami: function() {
        this.setTerminal(this.users[this.loggedUser]['name']);
    },
    su: async function(params) {
        if (params.length != 1)
            this.setTerminal('terminal: syntax incorrect.');
        else {
            this.users.forEach((x, i) => {
                if (x['name'] === params[0])
                    index = i;
            });
            if (index === -1)
                this.setTerminal(`terminal: ${params[0]} user not found.`);
            else {
                await this.getTerminal(`Password: `);
                if (response === this.users[index]['pwd']) {
                    this.loggedUser = index;
                    this.setTerminal('');
                } else
                    this.setTerminal('terminal: incorrect password.');
            }
        }
    },
    passwd: async function(params) {
        this.setTerminal(`Changing password of ${this.users[this.loggedUser]['name']}`);
        await this.getTerminal('Current password: ');
        if (response === this.users[this.loggedUser]['pwd']) {
            await this.getTerminal('New password: ');
            if (response !== '' && response !== this.users[this.loggedUser]['pwd'])
                this.users[this.loggedUser]['pwd'] = response;
                this.setTerminal('');
        } else
            this.setTerminal('terminal: incorrect password.');
    },
    echo: function(params) {
        const s = params.join(' ').replace('"', "").replace('"', "");
        this.setTerminal(s);
    },
    setTerminal: function(response, clean) {
        const terminalTextDefault = `${this.users[this.loggedUser]['name']}@${this.users[this.loggedUser]['ip']}>>`;
        if (clean)
                terminal.value = `${terminalTextDefault}`;
        else if (response === '')
            terminal.value += `\n${terminalTextDefault}`;
        else
            terminal.value += `\n${response}\n${terminalTextDefault}`;
    },
    getTerminal: async function(ask) {
        terminal.value += `\n${ask}`;
        answer = terminal.value;
        let response;
        response = await listenTerminalAnswer(answer);
        terminal.addEventListener('keydown', listenTerminalMain);
        return response;
    }
}


// FUNCIONALIDADES BÁSICAS PARA O FUNCIONAMENTO DO TERMINAL
const listenTerminalAnswer = (answer) => {
    return new Promise(resolve => {
        terminal.removeEventListener('keydown', listenTerminalMain);
        terminal.addEventListener('keydown', function get(e) {
            if (e.key === 'Enter') {
                response = terminal.value.slice(answer.length - 1).trim();
                terminal.removeEventListener('keydown', get);
                resolve(response);
            }
        });
    })
}

const listenTerminalAvoidBackspace = (e) => {
    let terminalTextLast = terminal.value;
    if (e.key === 'Backspace')
        if (terminalTextLast[terminalTextLast.length - 1] == ">" || terminalTextLast[terminalTextLast.length - 1] == ":")
            terminal.value = terminalTextLast + '>';
}

const listenTerminalAvoidChangeCursor = () => {
    const length = terminal.value.length;
    terminal.setSelectionRange(length, length);
}

const listenTerminalAvoidMoveCursor = (e) => {
    if (e.key === 'ArrowLeft'){
        const a = [...terminal.value]
        a.forEach((char, i) => {
            if (char === '>')
                index = i + 1;
        })
        console.log(index);
        console.log(terminal.value.length);
        if (terminal.value.length === index){
            const length = terminal.value.length;
            terminal.setSelectionRange(length + 1, length);
        }
    }
}

const listenTerminalMain = (e) => {

    if (e.key === 'ArrowUp'){
        const lastCommand = lastCommands.pop();
        let index;

        if (lastCommand === undefined)
            return;
        auxLastCommands.push(lastCommand);
        const a = [...terminal.value]
        a.forEach((char, i) => {
            if (char === '>')
                index = i + 1;
        })
        terminal.value = terminal.value.slice(0, index) + lastCommand;
    }
    if (e.key === 'ArrowDown'){
        let lastCommand = auxLastCommands.pop();
        let index;

        if (lastCommand === undefined)
            lastCommand = '';
        else {
            lastCommands.push(lastCommand);
        }
        const a = [...terminal.value]
        a.forEach((char, i) => {
            if (char === '>')
                index = i + 1;
        })
        terminal.value = terminal.value.slice(0, index) + lastCommand;
    }
    if (e.key == 'Enter')
        captureFunction(terminal.value);
}


document.addEventListener('DOMContentLoaded', () => {
    let terminalTextInit = 
    `JS Terminal v0.1
by Vinicius Melo, GitHub User: ViniciusM241

${library['users'][library.loggedUser]['name']}@${library['users'][library.loggedUser]['ip']}>>`;
    terminal.value = terminalTextInit;
    terminal.focus();
    terminal.addEventListener('keydown', listenTerminalMain);
    terminal.addEventListener('keydown', listenTerminalAvoidBackspace);
    terminal.addEventListener('click', listenTerminalAvoidChangeCursor);
    terminal.addEventListener('keydown', listenTerminalAvoidMoveCursor)
})

const captureFunction = (inputText) => {
    const a =  [...inputText];
    let stringUser = "";
    let index, program, params;

    a.forEach((char, i) => {
        if (char === '>')
            index = i + 1;
    })
    stringUser = a.slice(index).join('').split(" ");
    lastCommands.push(stringUser.join(' '))
    program = stringUser[0];
    params = stringUser.slice(1);

    if (program === '') {
        library.setTerminal('');
    } else
        //library[program](params);
        try {
            library[program](params);
        } catch {
            library.setTerminal(`terminal: ${program} program not found.`);
        }
    
}