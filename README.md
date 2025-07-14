# Miro Template Generator

This project lets you generate Miro board templates using an AI backed by Supabase edge functions. It is built with React and Vite.

## Prerequisites

- Node.js 18 or newer
- npm (comes with Node.js)

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

## Configuration

Create a `.env` file in the project root. The following variables are used by the app:

```bash
VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>
# Optional: token used to create boards through the Miro API
VITE_MIRO_TOKEN=<your-miro-token>
```

An `.env.example` file is provided as a reference.

If you deploy the included Supabase Edge Function (`supabase/functions/claude-chat`), set the `CLAUDE_API_KEY` variable in your Supabase project with your Anthropic API key.

## Running the development server

Start the Vite dev server with:

```bash
npm run dev
```

This will serve the application on <http://localhost:5173> by default.

## Building the project

To create an optimized production build run:

```bash
npm run build
```

The output will be written to the `dist` folder.
