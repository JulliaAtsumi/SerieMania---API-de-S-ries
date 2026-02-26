# 🎬 SerieMania

O objetivo foi criar uma aplicação web responsiva que consome uma API pública e permite ao usuário buscar, favoritar itens e visualiza-los.

---

## 🚀 Tecnologias Utilizadas

- HTML5  
- CSS3 (puro)  
- JavaScript (ES6)  
- Fetch API  
- LocalStorage  

Não foram utilizados frameworks ou bibliotecas externas.

---

## 🌐 API Utilizada

Foi utilizada a API pública do TVMaze para buscar informações sobre séries.

Endpoints utilizados:

**Busca:**  
https://api.tvmaze.com/search/shows?q=QUERY  

**Detalhes:**  
https://api.tvmaze.com/shows/ID  

---

## ✨ Funcionalidades Implementadas

- 🔎 Busca de séries
- 📦 Exibição em grid responsivo
- ❤️ Sistema de favoritos
- 💾 Persistência de favoritos com LocalStorage
- ⏳ Estado de loading
- ⚠️ Tratamento simples de erro
- 📱 Responsividade (desktop, tablet e mobile)

---

## 📱 Responsividade

O layout foi desenvolvido utilizando CSS Grid e Media Queries.

**Breakpoints utilizados:**

- Desktop: acima de 1024px  
- Tablet: até 768px  
- Mobile: até 425px  

---

## 🧠 Estrutura do Projeto

/SerieMania-API_de_Series

├── index.html

├── style.css

└── script.js

- **index.html** → Estrutura da aplicação  
- **style.css** → Estilização e responsividade  
- **script.js** → Lógica da aplicação, consumo de API e manipulação do DOM  

---

## ▶️ Como Executar o Projeto

1. Clone o repositório:

```bash
git clone https://github.com/JulliaAtsumi/SerieMania-API_de_Series.git
```

2. Acesse a pasta do projeto:

```bash
cd SerieMania-API_de_Series
```

3. Abra o arquivo index.html no navegador.

Não é necessário instalar dependências ou rodar servidor.

---

## 📌 Itens Não Implementados

Os seguintes itens não foram implementados:

- Página de Detalhes (Modal)
- Filtros por gênero  
- Ordenação por nota ou nome  
- Acessibilidade avançada  
- Deploy publicado (Vercel/Netlify)  

---

## 👩‍💻 Autora

Desenvolvido por Jullia Akutagawa.
