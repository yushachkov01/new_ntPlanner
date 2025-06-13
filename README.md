# "Core Network Operations Center"

> Проект для инженеров на **Vite** + **React** + **TypeScript** с архитектурой **FSD** (Feature-Sliced Design) и единой конфигурацией **ESLint** и **Prettier**.

---

## Старт

1. **Клонировать репозиторий:**
   ```bash
   git clone <url> corenoc
   cd corenoc/CoreNOC
   ```
2. **Установить зависимости:**
   ```bash
   npm install
   ```
3. **Запустить dev‑сервер:**
   ```bash
   npm run start
   # или npm run dev
   ```
4. **Открыть в браузере:**
   ```
   http://localhost:5173
   ```

---

## Скрипты

| Команда                | Описание                              |
| ---------------------- | ------------------------------------- |
| `npm run start`        | Запустить Vite dev‑сервер             |
| `npm run build`        | Скомпилировать продакшен‑бандл        |
| `npm run preview`      | Локально запустить собранный бандл    |
| `npm run lint`         | Проверить код ESLint (legacy‑конфиг)  |
| `npm run lint:fix`     | Исправить ошибки ESLint автоматически |
| `npm run format`       | Отформатировать проект через Prettier |
| `npm run format:check` | Проверить форматирование без правки   |

---

## 🛠 Архитектура (FSD)

```text
src/
├── app/       # Точка входа, провайдеры, роуты
├── pages/     # Крупные страницы
├── widgets/   # Переиспользуемые UI‑блоки
├── features/  # Логические фичи
├── entities/  # Доменные модели
├── shared/    # Общие UI‑компоненты, утилиты, типы, ресурсы
└── ws-service.ts  # Реэкспорт точек входа и провайдеров
```

> **FSD** обеспечивает чёткие границы: каждый слой знает только о своём и нижележащем.

---

## 🔗 Алиасы

```jsonc
"paths": {
  "@/*":       ["src/*"],
  "@app/*":    ["src/app/*"],
  "@pages/*":  ["src/pages/*"],
  "@widgets/*":["src/widgets/*"],
  "@features/*":["src/features/*"],
  "@entities/*":["src/entities/*"],
  "@shared/*": ["src/shared/*"]
}
```

---

## ⚙ Конфигурации

### Vite (`vite.config.ts`)

- Подгрузка `.env*` через `loadEnv`
- Legacy‑бандл для старых браузеров (`@vitejs/plugin-legacy`)
- Alias’ы из `vite-tsconfig-paths`
- Настройки `server`, `build` (manualChunks, terser, define `appVersion`)

### TypeScript

- Раздельные конфиги:
  - `tsconfig.app.json` для кода в `src`
  - `tsconfig.node.json` для Vite-конфигов
- `baseUrl` и `paths` совпадают с FSD-алиасами

### ESLint (`.eslintrc.cjs`)

- Legacy‑конфиг для ESLint v9
- Парсер `@typescript-eslint/parser` + плагины React, Hooks, A11y, import-order, Prettier
- Override для `vite.config.ts` с использованием `tsconfig.node.json`

### Prettier (`.prettierrc.cjs`)

```js
module.exports = {
  printWidth: 100,
  tabWidth: 2,
  semi: true,
  singleQuote: true,
  trailingComma: 'all',
  bracketSpacing: true,
  arrowParens: 'always',
  endOfLine: 'lf',
};
```

---

## ✅ Проверки качества

```bash
# ESLint
npm run lint          # отчёт
npm run lint:fix      # автоисправления

# Prettier
npm run format:check  # проверка
npm run format        # применение
```

---

© 2025 Multiservice Networks Team
