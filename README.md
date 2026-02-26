# E-Commerce E2E Testing Laboratory 🛒

Bem-vindo ao repositório do **E-commerce E2E Test**, uma aplicação puramente desenvolvida em **Vanilla JavaScript** (ES6+), **HTML5** e **CSS3**, focada em servir como ambiente base, limpo e determinístico para testes End-to-End (E2E) com frameworks como Cypress, Playwright, ou Selenium.

O maior objetivo desse projeto é simular os cenários do mundo real de uma loja, sem a complexidade ou instabilidade de ambientes servidos por API, utilizando estritamente o `LocalStorage` do navegador para controle de estado, persistência de banco de dados e mutações.

---

## 🛠 Entendendo as Tecnologias

- **Nenhum Framework:** Ausência completa de React, Vue, Angular, jQuery ou bibliotecas de UI/CSS como Bootstrap/Tailwind.
- **Armazenamento:** Persistência no **LocalStorage** (`e2e_cart`, `e2e_users`, `e2e_orders`, `e2e_current_user`).
- **Arquitetura Base:** Todos os scripts são controlados baseados em ES6 Modules (`type="module"`), possibilitando o reuso de utilitários como formatadores e validadores através de _imports_.
- **Testes Mapeados:** Interface massivamente anotada com a propriedade `data-testid="X"` para robustez durante automações de E2E.

---

## 📂 Organização do Projeto

A arquitetura do repositório foi segregada baseada no design modular MVC adaptado para Vanilla JS, permitindo que a injeção em tela seja desacoplada das regras de negócio (serviços).

```text
/
├── index.html        # Página inicial (Destaques da loja)
├── catalog.html      # Catálogo de produtos com sistema de busca, ordem, e filtro.
├── product.html      # Tela de detalhes de um item, galerias e seleção de variância.
├── cart.html         # O carrinho de compras base, manipulador de quantitativos e cupom.
├── checkout.html     # Formulário base de finalização preenchível com mascara JS auto.
├── success.html      # Tela final provendo o histórico ou ID de sucesso do usuário.
├── login.html        # Acesso do usuário por AuthService (simulado).
├── register.html     # Criação de mocks de usuários com limitações estritas em inputs.
├── profile.html      # Área do cliente logado gerando o resgate de ordens criadas.
├── about.html        # Página estática para treino de testes em componentes visuais.
├── css/              # Folhas de estilização (CSS Vanilla)
│   ├── reset.css     # Hard reset de margens e padding adaptado globalmente.
│   ├── variables.css # Design Tokens principais de Cores e Dimensionamentos.
│   ├── layout.css    # Controle estrutural geral (Grid, main headers e footers).
│   ├── components.css# Estilizações comuns atômicas (botoes, inputs, alertas).
│   └── pages/        # Estilizações específicas relativas com o nome das páginas html.
├── js/               # Lógica de Controle
│   ├── components/   # Classes modulares Injetadas no DOM (Reusabilidade pura)
│   │   ├── header.js # Menu Sanduiche, Navbar, Lógica de Search Global e Counters.
│   │   ├── footer.js # Rodapé universal.
│   │   └── product-card.js # Factory que injeta um grid card padrão em lista.
│   ├── data/         # Repositório "Backend" em JS que populam o aplicativo.
│   │   ├── products.js  # JSON dos produtos do sistema.
│   │   ├── users.js     # Usuários default (massa pronta se necessário).
│   │   └── coupons.js   # Regras de cupons de descontos injetáveis do Carrinho.
│   ├── pages/        # Controladores únicos restritos às páginas homônimas. (Ex: cart.js)
│   ├── services/     # Casos de uso e Lógica de negócio pesada, independente do HTML.
│   │   ├── auth.service.js   # Valida localStorage, login e construtor de usuários.
│   │   ├── cart.service.js   # Manipula descontos, adições e exclusões no array de cart.
│   │   ├── order.service.js  # Conversor final Cart -> History -> Usuário e clear stage.
│   │   └── product.service.js# Funções de retrieve, fetch single e filtragem de JSON.
│   └── utils/        # Facades estáticas para apoio do projeto em larga escala.
│       ├── format.js      # Formata datas, dinheiros de brutos para Locale PT-BR.
│       ├── masks.js       # Processador em tempo real de Inputs (CEP, CPF, Telefone).
│       ├── validation.js  # Checadores pragmáticos de string rules antes de injetar states.
│       └── storage.js     # Classe Proxy facilitadora de getters e setters no navigator window.
```

---

## 🚀 Como Executar Localmente

Não existe a necessidade de rodar processos no NodeJS ou instalação pelo npm. Esta é uma aplicação puramente estática, o que torna sua hospedagem muito fácil.

1. Faça o clone ou localize o projeto no seu computador.
2. É altamente recomendado utilizar um **Live Server** (extensão do VS Code ou servidor HTTP simples como o Web Server for Chrome ou npx http-server) devido às requisições de módulos ES6 `import/export`.
3. Abra a porta fornecida pelo seu servidor apontando diretamente no arquivo `/index.html`.

### Rotinas e Pistas para o QA (Quality Assurance)

Se o propósito desta plataforma é a montagem de seu repositório de testes com UI, repare nos arquivos de código e inspecione a DOM de seu navegador base:

- Existe uma variação massiva nos tamanhos de limitações físicas e máscaras da UX do Checkout (`CPF` converte ponto a ponto e te poda, número de cartão idem).
- Na página de **Registrar**, tente provocar submissões nulas e teste o seu framework avaliando cores e visibilidades de classes `.form-error` injetadas dinamicamente.
- Faça testes para forçarem os cupons de Descontos pre-cadastrados, validando se são responsivos às variações de tamanho de carrinho (Ex: DESCONTO10 requere X compras e não funciona sozinho).

Aproveite este projeto como seu playground seguro!

### Prints 

<img width="1920" height="1410" alt="image" src="https://github.com/user-attachments/assets/3ad299e5-c0e7-42bb-8120-5743472a0729" />
<img width="1920" height="1396" alt="image" src="https://github.com/user-attachments/assets/b672d0b8-ccd5-4e8a-91d1-941b0724362e" />
<img width="1920" height="932" alt="image" src="https://github.com/user-attachments/assets/120bb974-0fc8-4509-94cc-cf2af7a89a26" />
<img width="1920" height="932" alt="image" src="https://github.com/user-attachments/assets/51510c92-0de2-4def-b35f-f569fd4562e4" />
<img width="1920" height="1021" alt="image" src="https://github.com/user-attachments/assets/af89e5f1-c27d-4628-89a4-711bb526d16f" />
<img width="1920" height="1481" alt="image" src="https://github.com/user-attachments/assets/4972912e-98fa-47c6-b629-79951793e2e4" />
<img width="1920" height="1026" alt="image" src="https://github.com/user-attachments/assets/9656aa25-3c95-450a-9242-c4f284dda086" />
<img width="1920" height="1856" alt="image" src="https://github.com/user-attachments/assets/afcba488-bd36-4b45-af1e-8b27ce019586" />
<img width="971" height="487" alt="image" src="https://github.com/user-attachments/assets/d01a36b6-0022-4dc1-8e0b-a5b82053ac8a" />
<img width="1920" height="1340" alt="image" src="https://github.com/user-attachments/assets/4b5a0b59-158f-4c59-8b8e-65d0827348f9" />
<img width="1920" height="1087" alt="image" src="https://github.com/user-attachments/assets/39a5ddff-51a0-46c2-9d37-d9dd79182743" />
<img width="1920" height="932" alt="image" src="https://github.com/user-attachments/assets/2a1cafa8-236e-4d7e-b0f4-3ffa3c0495e6" />



