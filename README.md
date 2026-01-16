# Todo Kanban Board

A full-stack todo application with drag-and-drop Kanban board interface, built with SvelteKit, TypeScript, Prisma, and PostgreSQL.

## Features

- **Kanban Board UI** - Drag and drop cards between Todo, Doing, and Done columns
- **CRUD Operations** - Create, read, update, and delete cards via REST APIs
- **Modal Interface** - Clean modal for creating new tasks
- **Inline Editing** - Edit cards directly in place with emoji status indicators
- **PostgreSQL Database** - Persistent storage with Prisma ORM
- **Type-Safe** - Full TypeScript implementation with Zod validation

## Tech Stack

- **Frontend**: SvelteKit, TypeScript
- **Backend**: SvelteKit API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Validation**: Zod
- **Containerization**: Docker & Docker Compose

## Prerequisites

- Node.js 18+ and npm/pnpm/yarn
- Docker and Docker Compose (for containerized setup)
- PostgreSQL (for local development without Docker)

## Getting Started

### Option 1: Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd todo-kanban-board
   ```

2. **Copy the example environment variable file**
   ```bash
   cp .env.example .env
   ```

3. **Start the development server**
   ```bash
   docker-compose up -d
   ```

4. **Install dependencies
   ```bash
   docker-compose exec app npm install
   ```

5. **Run the development server**
   ```bash
   docker-compose exec app npm run dev
   ```

6. **Open your browser** and navigate to `http://localhost:5173`

### Option 2: Local (Without Docker)

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd todo-kanban-board
   ```

2. **Copy the example environment variable file**
   ```bash
   cp .env.example .env
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser** and navigate to `http://localhost:5173`

## Database Setup

### Using Docker (Recommended)

The recommended way to run the database is through the provided Docker setup.

1. Ensure Docker and Docker Compose are installed.
2. In the project root, run:
   ```bash
   docker-compose up -d db
   ```
3. The database will be available at `postgres://user:password@localhost:5432/dbname`.

### Without Docker

1. Install PostgreSQL locally.
2. Create a new database and user as specified in your `.env` file.
3. Run the Prisma migration to set up the database schema:
   ```bash
   npx prisma migrate dev --name init
   ```
## API ENDPOINTS

### GET /api/cards

**Response:**

```json
{
  "data": [
    {
      "id": 1,
      "title": "Task title",
      "description": "Optional description",
      "status": "todo",
      "createdAt": "2026-01-15T10:00:00.000Z",
      "updatedAt": "2026-01-15T10:00:00.000Z"
    }
  ],
  "count": 1
}
```

### POST /api/cards

**Request Body:**

```json
{
  "title": "New task",
  "description": "Optional description",
  "status": "todo"
}
```

**Response:**

```json
{
  "data": {
    "id": 1,
    "title": "New task",
    "description": "Optional description",
    "status": "todo",
    "createdAt": "2026-01-15T10:00:00.000Z",
    "updatedAt": "2026-01-15T10:00:00.000Z"
  },
  "message": "Card create successfully"
}
```

### PATCH /api/cards/:id

**Request Body:**

```json
{
  "title": "Updated title",
  "description": "Updated description",
  "status": "doing"
}
```

**Response:**

```json
{
  "data": { /* updated card */ },
  "success": true,
  "message": "Card updated successfully"
}
```

### DELETE /api/cards/:id

**Response:**

```json
{
  "success": true,
  "message": "Card deleted successfully"
}
```

## PROJECT STRUCTURE

```
todo/
├── src/
│   ├── lib/
│   │   ├── components/
│   │   │   ├── CardComponent.svelte      # Individual card with inline edit
│   │   │   ├── ColumnComponent.svelte    # Kanban column with drag-drop
│   │   │   └── CreateCardComponent.svelte # Modal for creating cards
│   │   ├── services/
│   │   │   ├── cardService.ts            # API service layer
│   │   │   └── dnd.ts                    # Drag and drop utilities
│   │   ├── types/
│   │   │   └── api.types.ts              # TypeScript types
│   │   ├── validators/
│   │   │   └── cards.validators.ts       # Zod validation schemas
│   │   └── prisma.ts                     # Prisma client
│   ├── routes/
│   │   ├── api/
│   │   │   └── cards/
│   │   │       ├── +server.ts            # GET, POST endpoints
│   │   │       └── [id]/+server.ts       # GET, PATCH, DELETE by ID
│   │   └── +page.svelte                  # Main Kanban board page
│   └── app.html
├── prisma/
│   ├── schema.prisma                     # Database schema
│   └── migrations/                       # Database migrations
├── docker-compose.yml
├── Dockerfile
└── README.md
```