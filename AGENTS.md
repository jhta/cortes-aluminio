# AGENTS.md

> Context file for AI agents working on **Cortes Aluminio**.

## Project Overview

Mobile app for calculating aluminum window/door cut dimensions. Targets Spanish-speaking aluminum workers. Users pick a system (520, 744, etc.), enter width and height, and get precise cut measurements for each piece (cabezal, sillar, jamba, vidrio, etc.).

## Tech Stack

| Layer       | Technology                                                     |
| ----------- | -------------------------------------------------------------- |
| Framework   | Expo ~54 with New Architecture enabled                         |
| UI          | React Native 0.81, React 19                                   |
| Language    | TypeScript ~5.9 (strict mode)                                  |
| Routing     | expo-router ~6 (file-based, typed routes)                      |
| Navigation  | @react-navigation/native 7.x, bottom-tabs                     |
| Animations  | react-native-reanimated ~4.1, react-native-gesture-handler ~2.28 |
| Persistence | @react-native-async-storage/async-storage 2.2                  |
| Icons       | @expo/vector-icons (Ionicons)                                  |
| Linting     | ESLint 9 with eslint-config-expo                               |
| Experiments | React Compiler enabled                                         |

## File Structure

```
app/                        # Screens (Expo Router file-based routing)
├── _layout.tsx             # Root layout: theme provider, gesture handler
├── calculator.tsx          # Main calculator screen
└── (tabs)/
    ├── _layout.tsx         # Tab navigator (Sistemas, Historial)
    ├── index.tsx           # System selection screen
    └── history.tsx         # Saved calculations history

src/                        # Shared application code
├── components/             # Reusable UI components
│   ├── InputField.tsx      # Numeric input field
│   ├── PanelSelector.tsx   # Panel count selector (2-4 panels)
│   ├── ResultsList.tsx     # Results display + WhatsApp sharing
│   ├── SaveModal.tsx       # Save calculation modal
│   ├── SystemCard.tsx      # System selection card
│   └── WindowDiagram.tsx   # Zoomable/pannable window diagram
├── constants/
│   ├── systems.ts          # System definitions (ids, names, availability)
│   └── theme.ts            # Light/dark color tokens
├── hooks/
│   └── useTheme.ts         # ThemeContext + useTheme hook
├── storage/
│   └── history.ts          # AsyncStorage CRUD with in-memory cache
└── utils/
    └── calculations.ts     # Per-system cut formulas

assets/images/              # App icons, splash, favicon
```

## Path Alias

`@/*` maps to the project root. Example: `import { useTheme } from '@/src/hooks/useTheme'`.

## Coding Conventions

### Naming

- **Components**: PascalCase files and exports (`SystemCard.tsx` → `SystemCard`)
- **Hooks**: `use` prefix, camelCase (`useTheme`)
- **Utils/functions**: camelCase (`formatMeasure`, `calculate`)
- **Types**: PascalCase (`SystemResult`, `ThemeColors`, `HistoryEntry`)
- **Constants**: camelCase objects (`systemDefinitions`, `Colors`)

### Patterns

- **Theme**: `ThemeContext` provider in root layout; consume with `useTheme()` hook. All components must respect light/dark mode.
- **Styles**: `StyleSheet.create()` colocated at the bottom of each component file.
- **State**: Local `useState` for screen state. No global state library — context only for theme.
- **Persistence**: `historyStorage` module wraps AsyncStorage with an in-memory cache. All history operations go through this module.
- **Formulas**: Cut formulas live in `src/utils/calculations.ts` as a `Record<string, SystemFormula>`. Each system has a function `(width, height) => Record<string, number>`.
- **UI primitives**: Use React Native core (`View`, `Text`, `Pressable`, `ScrollView`). No third-party UI library.

### Language & Locale

All user-facing text is in **Spanish**. Variable names and code comments should be in **English**, but domain terms (cabezal, sillar, jamba, eganche, traslape, vidrio) stay in Spanish as they are industry-specific.

## Adding a New System

1. Add the system ID to the `SystemId` type in `src/constants/systems.ts`.
2. Add a `SystemDefinition` entry to `systemDefinitions` with `available: true`.
3. Add the formula function to the `formulas` record in `src/utils/calculations.ts`.
4. The calculator screen and results list will pick it up automatically.

## Development

```bash
npm start           # Start Expo dev server
npm run android     # Run on Android (requires prebuild)
npm run ios         # Run on iOS
npm run web         # Run in browser
npm run lint        # Run ESLint
```

- Native builds use `expo prebuild` to generate `android/` and `ios/` folders (both gitignored).
- No testing framework is set up yet.
- No CI/CD pipeline configured.
- No EAS Build/Submit configuration.

## Important Notes

- **New Architecture** is enabled — avoid libraries that don't support it.
- **React Compiler** experiment is on — avoid patterns that break compiler assumptions (e.g., mutating state directly, side effects in render).
- The `android/` and `ios/` directories are generated and gitignored. Do not commit native code manually.
- `app.json` is the single source for Expo config (not `app.config.js`).
