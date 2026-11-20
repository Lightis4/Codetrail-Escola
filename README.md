# CodeTrail Escola 6.0

### Plataforma gratuita de ensino de programação em C e C++

A **CodeTrail Escola** é uma plataforma educacional de código aberto, desenvolvida para tornar o aprendizado de programação mais acessível, organizado e prático.

O projeto tem como objetivo ajudar estudantes, iniciantes e entusiastas da tecnologia a desenvolver uma base sólida em programação, por meio de trilhas de aprendizagem, aulas teóricas, exemplos comentados e exercícios de fixação.

**Acesse a plataforma:** https://codetrail-escola.onrender.com

**Repositório oficial:** https://github.com/Lightis4/Codetrail-Escola

---

## Sobre o projeto

Aprender programação exige mais do que memorizar comandos ou responder perguntas. É necessário compreender a lógica por trás dos algoritmos, entender o funcionamento do código e desenvolver a capacidade de resolver problemas.

A CodeTrail Escola nasceu com essa proposta: oferecer um ambiente em que qualquer pessoa possa começar do zero e avançar gradualmente no estudo de programação.

A plataforma concentra seus conteúdos em três pilares:

- **Fundamentos de programação:** introdução à lógica, algoritmos e conceitos essenciais.
- **Linguagem C:** desenvolvimento de programas estruturados, compreensão de variáveis, operadores, condicionais, estruturas de repetição e outros fundamentos.
- **Linguagem C++:** introdução à linguagem, desenvolvimento de programas e evolução para conceitos mais avançados.

O conteúdo é apresentado de forma progressiva, permitindo que o estudante desenvolva seus conhecimentos antes de avançar para assuntos mais complexos.

## Funcionalidades da versão 6.0

### Trilhas de aprendizagem

Organização dos conteúdos por linguagem e assunto, proporcionando uma sequência de estudos estruturada.

### Aulas teóricas

Conteúdos educacionais com explicações sobre conceitos de programação, sintaxe e aplicação prática.

### Exemplos de código comentados

Programas apresentados com explicações didáticas, ajudando o estudante a compreender a finalidade de cada instrução.

### Exercícios de fixação

Atividades voltadas à revisão dos conceitos apresentados durante as aulas.

### Exercícios práticos

Desafios que incentivam o estudante a aplicar os conhecimentos adquiridos e desenvolver seu raciocínio lógico.

### Conteúdo progressivo

Aulas organizadas para acompanhar a evolução do estudante, desde os primeiros contatos com programação até conteúdos de maior complexidade.

## Tecnologias utilizadas

| Tecnologia | Aplicação |
|---|---|
| Java | Desenvolvimento do backend |
| Spring Boot | Framework da aplicação web |
| Maven | Gerenciamento de dependências e construção |
| HTML5 | Estrutura das páginas |
| CSS3 | Estilização e responsividade |
| JavaScript | Interatividade da interface |
| JSON | Organização de conteúdos educacionais |
| Docker | Conteinerização da aplicação |
| Render | Hospedagem da plataforma |
| Git e GitHub | Versionamento e colaboração |

## Arquitetura do projeto

A CodeTrail utiliza uma aplicação Spring Boot responsável por disponibilizar os recursos da plataforma e servir sua interface web.

A estrutura principal está organizada da seguinte forma:

```text
CodeTrail-Escola/
│
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/
│   │   │   │       └── codetrail/
│   │   │   │           ├── config/
│   │   │   │           ├── controller/
│   │   │   │           ├── model/
│   │   │   │           ├── repository/
│   │   │   │           └── CodeTrailApplication.java
│   │   │   │
│   │   │   └── resources/
│   │   │       ├── data/
│   │   │       │   └── trilhas.json
│   │   │       ├── static/
│   │   │       │   ├── css/
│   │   │       │   │   └── style.css
│   │   │       │   ├── js/
│   │   │       │   │   └── app.js
│   │   │       │   └── index.html
│   │   │       └── application.properties
│   │   │
│   │   └── test/
│   │
│   └── pom.xml
│
├── Dockerfile
├── .env.example
├── .gitignore
└── README.md
```

### Organização dos componentes

**Backend:** concentra a lógica da aplicação, os controladores e os modelos utilizados pelo sistema.

**Frontend:** disponibiliza a interface utilizada pelos estudantes para navegar pelas trilhas e acessar os conteúdos.

**Conteúdo educacional:** organiza as informações das trilhas, aulas e atividades.

**Infraestrutura:** utiliza Docker para padronizar a execução da aplicação no ambiente de hospedagem.

## Executando localmente

### Pré-requisitos

Para executar a aplicação em ambiente de desenvolvimento, é necessário possuir:

- Java JDK 21
- Apache Maven 3.9 ou superior
- Git
- Visual Studio Code ou outra IDE compatível com Java

### 1. Clonar o repositório

```bash
git clone https://github.com/Lightis4/Codetrail-Escola.git
```

### 2. Acessar o diretório do backend

```bash
cd Codetrail-Escola/backend
```

### 3. Executar a aplicação

```bash
mvn spring-boot:run
```

### 4. Acessar pelo navegador

Com a aplicação iniciada e utilizando a configuração padrão de porta, acesse:

```text
http://localhost:8080
```

**Observação:** configurações específicas de ambiente e serviços externos podem exigir ajustes antes da execução local.

## Publicação

A CodeTrail Escola 6.0 foi disponibilizada utilizando o Render, com execução da aplicação Java em um contêiner Docker.

A plataforma pode ser acessada publicamente pelo endereço:

https://codetrail-escola.onrender.com

O processo de publicação é integrado ao repositório GitHub, permitindo atualizar o projeto conforme novas versões forem desenvolvidas.

## Objetivos educacionais

A CodeTrail busca:

1. Democratizar o acesso ao conhecimento em programação.
2. Oferecer materiais compreensíveis para pessoas sem experiência prévia.
3. Estimular o raciocínio lógico e a resolução de problemas.
4. Aproximar teoria e prática por meio de exemplos e exercícios.
5. Incentivar a autonomia dos estudantes.
6. Construir uma comunidade de aprendizagem e colaboração.

## Roadmap de desenvolvimento

A versão 6.0 representa uma etapa da evolução da plataforma. As próximas funcionalidades planejadas incluem:

- [x] Estrutura inicial da aplicação Java com Spring Boot
- [x] Trilhas de aprendizagem em C e C++
- [x] Aulas teóricas e exercícios
- [x] Aprofundamento dos conteúdos introdutórios
- [x] Melhorias na apresentação visual da plataforma
- [x] Publicação inicial no Render
- [ ] Integração com Neon PostgreSQL
- [ ] Cadastro e autenticação persistente de estudantes
- [ ] Armazenamento do progresso individual
- [ ] Histórico de atividades realizadas
- [ ] Painel personalizado do estudante
- [ ] Certificados de conclusão
- [ ] Editor de código com execução segura
- [ ] Ampliação do catálogo de aulas e desafios
- [ ] Recursos de acessibilidade e acompanhamento educacional

O roadmap poderá ser atualizado de acordo com as necessidades dos estudantes e da comunidade.

## Contribuições

A CodeTrail Escola é um projeto voltado ao aprendizado coletivo.

Sugestões de melhorias, correções, novos conteúdos e contribuições técnicas são bem-vindas.

Para contribuir:

1. Faça um fork do repositório.
2. Crie uma branch para sua alteração.
3. Desenvolva e teste as modificações.
4. Registre suas alterações em commits.
5. Abra um Pull Request descrevendo sua contribuição.

Também é possível utilizar a seção **Issues** do GitHub para relatar problemas ou sugerir funcionalidades.

## Licença

O projeto tem como objetivo disponibilizar conhecimento gratuitamente à comunidade.

A licença de distribuição e reutilização do código deverá ser definida e publicada em um arquivo `LICENSE` no repositório.

Até que isso aconteça, a disponibilidade pública do código não significa autorização irrestrita para sua reutilização.

## Desenvolvedor

**Pedro Barbosa — Lightis4**

Estudante de Ciência da Computação e desenvolvedor interessado em engenharia de software, educação tecnológica e desenvolvimento de soluções acessíveis à comunidade.

**GitHub:** https://github.com/Lightis4

---

### CodeTrail Escola

**Aprender a programar é construir conhecimento, uma linha de código por vez.**

Projeto educacional gratuito, desenvolvido para compartilhar conhecimento e incentivar novos programadores.
