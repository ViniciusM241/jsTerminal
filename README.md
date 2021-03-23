# jsTerminal v0.1
> O seu terminal dentro de uma página html.
---

## Quais funções o JsTerminal possui?
Há vários programas já embutidos na primeira versão do JsTerminal (versão 0.1), como:

> Gerenciamento de usuários:
- su
- sudo (su)
- passwd
- adduser (somente como usuário root)
- whoami

> Outros comandos do terminal:
- echo
- clear



## Como implementar?

São necessários alguns passos para conseguir utilizá-lo.
- [x] Adicionar tag ao html.
- [ ] Adicionar o JS.
- [ ] 
- [ ] 

### ***Adicionando ao HTML***:
Para poder utilizar o terminal em uma página HTML, primeiro precisamos adicionar o seguinte textarea no fonte:
~~~~html 
<textarea id="terminal" type="text" cols="70" rows="20" spellcheck="false" wrap="off"></textarea>
~~~~
O terminal será renderizado direto dentro dessa tag.


### ***Adicionando o JavaScript***:
Para adicionar as funcionalidades do terminal. é necessário, também, incrementar o arquivo ```js-terminal.js``` ao seu HTML.
~~~~html 
<script src="js-terminal.js" type="text/javascript"></script>
~~~~

Após os dois procedimentos, o seu JsTerminal está pronto para ser usado em sua página.