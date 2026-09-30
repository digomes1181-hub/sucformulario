# Semana Universitária Cajuruense - React App 🚀

Aplicação web desenvolvida em **HTML5, CSS3, JavaScript (ES6+) e React (Vite)** para a **Semana Universitária Cajuruense**, substituindo o projeto Python/Flask original e pronta para deploy no **Vercel**.

---

## 🌟 Funcionalidades Integradas

- 📝 **Formulário de Inscrição Completo**:
  - Validação de algoritmo de CPF com formato inteligente e prevenção de cadastros duplicados.
  - Validação de data de nascimento (cálculo automático de idade).
  - Campos: CPF, Nome completo, E-mail, Estado civil, Sexo, Data de nascimento, Endereço, Bairro, Cidade, Telefone, Interesse em chefe de equipe.
  - Design moderno responsivo com tema escuro elegante (dark mode, glassmorphism e micro-animações).

- 🔐 **Painel Administrativo (`/admin`)**:
  - Autenticação por senha de administrador.
  - Indicadores e estatísticas em tempo real (Total de inscritos, Interessados em ser chefe de equipe).
  - Controle de Abertura/Fechamento do formulário de inscrições.
  - Lista detalhada de inscritos com busca por Nome, CPF ou E-mail.
  - Exportação em massa dos dados para **CSV**.
  - Exclusão de inscrições.

- 💾 **Persistência Híbrida Inteligente**:
  - Funciona imediatamente via **LocalStorage** (sem necessidade de configuração inicial).
  - Suporta integração com **Firebase Firestore** via variáveis de ambiente caso deseje sincronização na nuvem.

---

## ⚙️ Como Rodar Localmente

1. Navegue até a pasta do projeto:
   ```bash
   cd formulario-react
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

4. Acesse no navegador: `http://localhost:5173`

---

## 🌐 Como Fazer Deploy no Vercel

### Opção 1: Via Vercel CLI (Linha de Comando)

1. Instale o Vercel CLI (se ainda não possuir):
   ```bash
   npm i -g vercel
   ```

2. Dentro da pasta `formulario-react`, execute:
   ```bash
   vercel
   ```

3. Siga as instruções no terminal aceitando as configurações padrão.

---

### Opção 2: Via GitHub / Dashboard do Vercel

1. Suba esta pasta para um repositório no seu GitHub.
2. Acesse [vercel.com](https://vercel.com) e clique em **"Add New Project"**.
3. Importe o repositório do GitHub.
4. O Vercel detectará automaticamente a configuração do Vite:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Clique em **"Deploy"**.

---

## 🔑 Variáveis de Ambiente (Opcionais)

No painel do Vercel (**Settings -> Environment Variables**), você pode definir:

| Variável | Descrição | Valor Padrão |
|---|---|---|
| `VITE_ADMIN_PASSWORD` | Senha de acesso ao painel admin | `cajuru@2026` |
| `VITE_FIREBASE_API_KEY` | Chave de API do Firebase (opcional) | - |
| `VITE_FIREBASE_PROJECT_ID` | ID do Projeto no Firebase (opcional) | - |

