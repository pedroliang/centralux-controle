# Resumo do Projeto: Centralux Controle

Este arquivo serve como um registro de todas as modificações realizadas no projeto para manter o contexto em futuras atualizações.

## Histórico de Modificações

### 27/03/2026 - Restauração da Planilha Geral
- **Objetivo**: Retornar o link da "Planilha Geral" ao sidebar com uma nova URL.
- **Link**: [Planilha Geral](https://docs.google.com/spreadsheets/d/1fRqUo8vH4awjCwV12U0fhR2bdBSRGFUVMlU8PozUsoQ/edit?gid=0#gid=0)
- **Mudanças**: Adicionado item de navegação no `index.html` e alterações enviadas ao GitHub.

### 27/03/2026 - Sincronização e Limpeza
- **Objetivo**: Garantir que o repositório local estivesse sincronizado com o GitHub.
- **Mudanças**: Verificação de pendências e remoção temporária de links antigos (conforme solicitado anteriormente).

### 25/03/2026 - Configuração Inicial e Expansão do Sidebar
- **Objetivo**: Configurar o projeto base e adicionar novos aplicativos ao menu lateral.
- **Mudanças**:
  - Configuração de tokens de acesso (.env).
  - Adição dos links "Painel OT" e "CentraLu XBox" no `index.html`.
  - Implementação do design responsivo com ícones FontAwesome.

## Arquitetura e Funcionalidades
- **Tecnologias**: HTML, Vanilla CSS, Vanilla JavaScript.
- **Navegação**: O sidebar controla o conteúdo de um `iframe` central. O `main.js` gerencia as trocas de site baseando-se nos atributos `data-url` e `data-name` de cada `nav-item`.
- **Zoom**: O painel superior possui controles de zoom para o `iframe`.

## Como Adicionar Novos Links
1. Abrir `index.html`.
2. Criar um novo `<li class="nav-item">` dentro da `<nav>`.
3. Definir `data-url` e `data-name`.
4. Incluir o ícone (`<i>`) e o link externo (`<a>`).
