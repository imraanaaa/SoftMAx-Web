# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Waitlist Storage

The landing page posts waitlist signups to `/api/waitlist`.

- Production should use Supabase via `VITE_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.
- Local development can use a JSON file by setting `WAITLIST_STORAGE=local_json` in `.env.local`.
- If Supabase is not configured and the app is running locally, the API automatically falls back to `data/waitlist.local.json`.

To check locally collected emails, open `data/waitlist.local.json` after a signup is submitted.
