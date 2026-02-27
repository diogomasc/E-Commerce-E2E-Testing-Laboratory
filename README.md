# E-Commerce E2E Testing Laboratory 🛒

Bem-vindo ao repositório do **E-commerce E2E Test**, uma aplicação puramente desenvolvida em **Vanilla JavaScript** (ES6+), **HTML5** e **CSS3**, focada em servir como ambiente base, limpo e determinístico para testes End-to-End (E2E) com frameworks como Cypress, Playwright ou Selenium.

O maior objetivo desse projeto é simular os cenários do mundo real de uma loja, sem a complexidade ou instabilidade de ambientes servidos por API, utilizando estritamente o `LocalStorage` do navegador e Data Mocks para controle de estado, persistência de banco de dados e mutações.

---

## 🎯 Escopo e Proposta do Projeto (Curiosidades)

Apesar de ser um e-commerce aparentemente funcional de ponta a ponta, é crucial entender as limitações intencionais da arquitetura:

- **Não há Backend real:** Não existem APIs para autenticação ou persistência de banco de dados (`fetch` ou `axios` não são utilizados).
- **Dados Mockados (`js/data/`)**: A listagem de produtos, catálogos e usuários padrão vêm de arquivos estáticos no repositório. O "Banco de Dados" vive na memória do seu front-end durante a execução.
- **Persistência de Sessão:** Toda mutação (Adicionar ao carrinho, Criar pedido novo, Mudar perfil) é salva na API de Web Storage do navegador, especificamente o **LocalStorage**.
- **Ideal para UI Automation:** Testadores não precisam mockar respostas HTTP complexas. Toda manipulação se foca estritamente no ecossistema e estado do navegador (UI Testing puro).

---

## 🛠 Entendendo as Tecnologias

- **Nenhum Framework Frontend:** Ausência completa de bibliotecas como React, Vue, jQuery ou TailwindCSS. Apenas as camadas puras da Web.
- **Armazenamento Local:** As chaves principais utilizadas para testar estados no Storage são:
  - `e2e_cart`: Controle de itens do carrinho ativo.
  - `e2e_users`: Histórico de contas criadas artificialmente local.
  - `e2e_orders`: Base de dados dos pedidos finalizados.
  - `e2e_current_user`: Status da sessão do login atual.
- **Testes Mapeados:** A Interface Gráfica é massivamente anotada com atributos `data-testid="X"`, garantindo seletores resilientes e à prova de refatorações de design.

---

## 💡 Como testar o LocalStorage no Cypress?

Testar aplicações baseadas no Vanilla JS exigem que você domine o estado de armazenamento do navegador.
Como o LocalStorage persiste os dados mesmo após recarregamentos da página, o **Cypress** intencionalmente o limpa **entre cada teste (`it`)** para garantir que cada cenário seja independente e sem poluições de estados anteriores.

Embora o Cypress forneça o comando `cy.clearLocalStorage()`, ele não possui um `cy.getLocalStorage()` nativo. Por isso, utilizamos o `cy.window()` para acessar a API nativa do navegador ou criamos nossos próprios Custom Commands.

Portanto, em cenários onde precisamos manter um usuário logado ("hydrated") ou analisar um estado gerado (ex: o preço total gerado após manipular o carrinho de compras), uma ótima estratégia é interagir fisicamente com a janela (Window) do browser local, da seguinte forma:

```javascript
// Exemplo prático validando o ID de um pedido recém-criado em um teste do Cypress
describe("Finalização de Pedido", () => {
  it("deve armazenar os dados do pedido recém criado corretamente", () => {
    // 1. Simule e preencha as ações de sua UI ...
    cy.get('[data-testid="checkout-submit"]').click();

    // 2. Aguarde a interface reagir (Assincronismo)
    // Dica de Ouro: Garanta que a ação de salvar no storage terminou esperando um elemento visual mudar antes de ler a API!
    cy.url().should("include", "success.html");

    // 3. Acesse as APIs da Web locais (window.localStorage)
    cy.window().then((win) => {
      // 4. Capture o storage (retorna string)
      const storageOrdersRaw = win.localStorage.getItem("e2e_orders");

      // 5. Converta e execute sua Asserção!
      const orders = JSON.parse(storageOrdersRaw);
      expect(orders).to.be.an("array").that.is.not.empty;

      const lastOrder = orders[orders.length - 1];
      expect(lastOrder).to.have.property("status", "processing");
      expect(lastOrder).to.have.property("total");
    });
  });
});
```

### Dicas para a Automação:

1. **Refatoração (Custom Commands):** Para tornar o código mais limpo e legível dentro dos seus `it`s, você pode isolar a verbosidade em um comando customizado criando no seu `support/commands.js`:

   ```javascript
   Cypress.Commands.add("getLocalStorage", (key) => {
     return cy.window().then((win) => {
       return JSON.parse(win.localStorage.getItem(key));
     });
   });

   // Uso no teste:
   cy.getLocalStorage("e2e_orders").then((orders) => {
     expect(orders).to.not.be.empty;
   });
   ```

2. **Persistência entre Testes (Testes Longos):** Se for absolutamente necessário testar um fluxo sequencial contínuo (ex: `it` 1 faz login, `it` 2 adiciona item, `it` 3 paga), o Cypress vai limpar o Storage. Você pode contornar isso utilizando a abordagem oficial e moderna com [cy.session()](https://docs.cypress.io/api/commands/session) que guarda e restaura sessões. Outra vertente adotada pela comunidade é utilizar o plugin auxiliar [cypress-localstorage-commands](https://www.npmjs.com/package/cypress-localstorage-commands) injetando comandos vitais como `cy.saveLocalStorage()` e `cy.restoreLocalStorage()`.

> **Dica de Leitura:** Para atender um pouco mais como ler e gerenciar o localStorage, recomendamos o artigo: [Como ler o localStorage com Cypress (Talking About Testing)](https://talkingabouttesting.com/2021/03/02/como-ler-o-localstorage-do-navegador-com-cypress/).

> **Documentação Oficial do Cypress:** [docs.cypress.io](https://docs.cypress.io/app/get-started/why-cypress)

### 🏃‍♂️ Executando seu Cypress:

Lembre-se: Após mapear sua base, você pode assistir os testes ocorrendo ativamente através do comando `npx cypress open` ou rodá-los em modo invisível (headless) na sua esteira de CI/CD utilizando `npx cypress run`.

---

## 📂 Organização do Projeto

A arquitetura foi segregada baseada no design modular MVC, onde `js/services` atuam como "backend fake" para cada controle de tela:

```text
/
├── *.html            # Páginas estáticas atuando como View layer (index, cart, checkout...)
├── css/              # Design System em CSS Puro Moderno (Variáveis e Resets)
├── js/               # O Cérebro JS da Aplicação!
│   ├── components/   # Injeções de construtores de DOM, modais e layouts padrão.
│   ├── data/         # Onde seus objetos primários de testes ficam gerados.
│   │   ├── products.js  # JSON dos produtos do sistema.
│   │   ├── users.js     # Massas de dados base para testar logins diretos.
│   │   └── coupons.js   # Regras ativas de cupons na loja.
│   ├── pages/        # Escopo estrito e Listeners HTML-specific (Ex: checkout.js só roda no checkout).
│   ├── services/     # Casos de uso do software (Carrinho, Order, Auth). Manipula os Dados!
│   └── utils/        # Facades de comodidade geral do código (Validadores e Parsing Format).
```

---

## 🚀 Como Executar Localmente

Não existe a necessidade de rodar processos no NodeJS ou instalação pelo npm. Esta é uma aplicação puramente estática, o que torna sua hospedagem muito fácil.

Você pode acessá-la em produção através do GitHub Pages em: **[https://diogomasc.github.io/E-Commerce-E2E-Testing-Laboratory/](https://diogomasc.github.io/E-Commerce-E2E-Testing-Laboratory/)**

**Para executar localmente:**

1. Faça o clone ou localize o projeto no seu computador.
2. É altamente recomendado utilizar um **Live Server** (extensão do VS Code ou servidor HTTP simples como o Web Server for Chrome ou npx http-server) devido às requisições de módulos ES6 `import/export`.
3. Abra a porta fornecida pelo seu servidor apontando diretamente no arquivo `/index.html`.

### Rotinas e Pistas para o QA (Quality Assurance)

Se o propósito desta plataforma é a montagem de seu repositório de testes com UI, repare nos arquivos de código e inspecione a DOM de seu navegador base:

- Existe uma variação massiva nos tamanhos de limitações físicas e máscaras da UX do Checkout (`CPF` converte ponto a ponto e te poda, número de cartão idem).
- Na página de **Registrar**, tente provocar submissões nulas e teste o seu framework avaliando cores e visibilidades de classes `.form-error` injetadas dinamicamente.
- Faça testes para forçarem os cupons de Descontos pre-cadastrados, validando se são responsivos às variações de tamanho de carrinho (Ex: DESCONTO10 requere X compras e não funciona sozinho).
- **Bug Intencional (CPF):** A validação base de CPF permite o preenchimento e aceitação de um CPF formatado com números iguais (ex: `111.111.111-11`), ideal para testes de falsos-positivos na validação.
- **Bug Intencional (Cálculo de Desconto):** Ao aplicar um cupom de desconto no carrinho, a interface exibe que o desconto foi aplicado na UI, mas o valor deduzido é ignorado no gatilho de "Total Pago" sendo cobrado o valor cheio do checkout.

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
