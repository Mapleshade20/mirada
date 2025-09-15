# Mirada

Frontend for Encontrar - a one-time social pairing application that matches university students based on interests, traits, and preferences.

## Tech Stack

- **React 18** with TypeScript
- **Vite**
- **Tailwind CSS** + shadcn/ui + Ant Design
- **Zustand** for state management
- **react-i18next** for internationalization

## Development

```bash
npm install
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build
npx @biomejs/biome check --write  # Format and lint
```

## Project Structure

- `src/components/` - Reusable UI components
- `src/pages/` - Route-level pages
- `src/store/` - Zustand state management
- `src/lib/` - API client and utilities
- `src/i18n/` - Internationalization

Backend repository: `hilo`
