# Icon Generator

Professional SVG and PNG icon generation tool with real-time preview, multi-shape support, and automated PWA export.

## 🚀 Getting Started

Follow these steps to set up and run the project locally:

### 1. Installation
Install the necessary dependencies:
```bash
npm install
```

### 2. Configuration (Server Port)
The application uses environment variables for server configuration. To set a specific port:
1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
2. Edit the `.env` file and set your desired port:
   ```env
   VITE_PORT=5173
   ```
   *(Note: The `.env` file is unversioned and ignored by Git, allowing for custom local setups without affecting the repository.)*

### 3. Running the App (Development)
Start the development server:
```bash
npm run dev
```

### 4. Production & Deployment
When you are ready to deploy the application, you need to create a production-ready build:

1. **Build the project**:
   ```bash
   npm run build
   ```
   This command generates a `dist/` folder containing highly optimized static assets (HTML, JS, CSS).

2. **Preview the build**:
   To test the production build locally before deploying:
   ```bash
   npm run preview
   ```

3. **Deploying**:
   Simply upload the contents of the `dist/` folder to any static web hosting service (like Vercel, Netlify, GitHub Pages, or your own server).

---

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
