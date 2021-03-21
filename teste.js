/*
Posicionar Cursor em Input
const length = terminal.value.length;
terminal.setSelectionRange(length -1, length);
*/


const terminal = document.querySelector("#terminal");
let index = -1;

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
                let get = await this.getTerminal(`${params[0]} password: `);
                console.log(get);
                if (response === this.users[index]['pwd']) {
                    this.loggedUser = index;
                    this.setTerminal('');
                } else {
                    this.setTerminal('terminal: incorrect password.');
                }
            }
        }
    },
    setTerminal: function(response, clean) {
        const terminalTextDefault = `${this.users[this.loggedUser]['name']}@${this.users[this.loggedUser]['ip']}>>`;
        if (clean){
            terminal.value = `${terminalTextDefault}`;
        }
        else
            terminal.value += `\n${response}\n\n${terminalTextDefault}`;
        //terminal.setSelectionRange(terminal.value.length, terminal.value.length -1)
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


const listenTerminalMain = (e) => {
    let terminalTextLast = terminal.value;

    if (e.key === 'Backspace')
        if (terminalTextLast[terminalTextLast.length - 1] == ">" || terminalTextLast[terminalTextLast.length - 1] == ":")
            terminal.value = terminalTextLast + '>';
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
    program = stringUser[0];
    params = stringUser.slice(1);

    if (program === '') {
        library.setTerminal('');
    } else
        library[program](params);
        // try {
        //     library[program](params);
        // } catch {
        //     library.setTerminal(`terminal: ${program} program not found.`);
        // }
    
}