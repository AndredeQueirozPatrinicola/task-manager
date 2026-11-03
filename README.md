# Task Manager

A small task manager built with Next.js 15 (App Router) and tRPC. You can create, edit and delete tasks, browse them with infinite scroll, and search and sort the list.

## Stack

- **Next.js 15** (App Router, React 19)
- **tRPC 11** with **superjson**, so `Date` values arrive as real dates on the client
- **Zod** for input validation, shared by the server and the forms
- **Tailwind CSS 4**
- **Vitest** for tests

## Dependencies

- Node.js 20+ (a supported LTS release recommended)
- npm

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

> **Note:** tasks are stored in memory, inside the Next.js server process. Restarting the server (or a hot reload that recreates the module) clears every task.

## Scripts

| Script                  | What it does                         |
| ----------------------- | ------------------------------------ |
| `npm run dev`           | Starts the dev server                |
| `npm run build`         | Production build                     |
| `npm start`             | Serves the production build          |
| `npm run typecheck`     | Runs `tsc --noEmit`                  |
| `npm test`              | Runs Vitest in watch mode            |
| `npm run test:run`      | Runs the test suite once             |
| `npm run test:coverage` | Runs the tests with a coverage report |

## Features

- **Create, edit and delete tasks.** A task has a title (at least 3 characters) and an optional description. Validation errors from the server are shown in the form.
- **Server-side rendering.** The first page of tasks is loaded on the server, calling the tRPC router directly (no HTTP loopback).
- **Infinite scroll.** The list loads 10 tasks at a time using cursor pagination. The next page loads when you get close to the end of the list.
- **Search.** Matches the title or the description, ignoring case and accents (`cafe` finds `Café`). The URL updates 300 ms after you stop typing. `Esc` or the "x" button clears the search.
- **Sort.** Newest first, oldest first, title A–Z and title Z–A. Changing the sort updates the list right away.

### URL parameters

The search and the sort live in the URL, so a filtered list can be reloaded or shared.

| Param  | Values                                            | Default  |
| ------ | ------------------------------------------------- | -------- |
| `q`    | Any text. Longer than 100 characters is cut off.  | (empty)  |
| `sort` | `newest`, `oldest`, `title_asc`, `title_desc`     | `newest` |

An unknown `sort` value falls back to `newest`. Example: `/?q=report&sort=title_asc`.

## API

All procedures are under `/api/trpc`, in the `tasks` router:

| Procedure       | Type     | Input                                                    |
| --------------- | -------- | -------------------------------------------------------- |
| `list`          | query    | –                                                        |
| `listPaginated` | query    | `{ limit?, cursor?, search?, sort? }`                    |
| `byId`          | query    | `{ id }`                                                 |
| `create`        | mutation | `{ title, description? }`                                |
| `update`        | mutation | `{ id, title, description? }`                            |
| `delete`        | mutation | `{ id }`                                                 |

`listPaginated` returns `{ items, nextCursor }`. Pass `nextCursor` back as `cursor` to get the next page; it is `null` on the last page. The cursor carries the `id`, `title` and `createdAt` of the last item, so pagination stays stable for every sort order.

## Project structure

```
src/
├── app/
│   ├── api/trpc/[trpc]/route.ts   # tRPC HTTP handler
│   ├── hooks/usePagination.tsx    # Infinite scroll hook
│   ├── page.tsx                   # Task list (reads q and sort from the URL)
│   └── tasks/                     # New and edit pages
├── components/
│   ├── tasks/                     # Task list, toolbar, item and form
│   └── ui/                        # Icons and shared class names
├── lib/
│   ├── trpc/                      # Browser client, server caller and error helpers
│   └── validations/task.ts        # Zod schemas and shared constants
├── server/
│   ├── api/                       # tRPC setup and routers
│   └── store/task-store.ts        # In-memory store (filter, sort, paginate)
└── types/task.ts                  # Types shared by client and server
```

## Tests

```bash
npm run test:run
```

The tests cover the Zod schemas, the in-memory store (including search, sort and pagination) and the tRPC router.
