// Cloudflare Pages Function: /api/items
// Connects to Cloudflare D1 database binding 'DB'

interface D1Result<T = unknown> {
  results?: T[];
  success: boolean;
  meta?: {
    last_row_id?: number;
    changes?: number;
  };
  error?: string;
}

interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  all<T = unknown>(): Promise<D1Result<T>>;
  run(): Promise<D1Result>;
}

interface D1Database {
  prepare(query: string): D1PreparedStatement;
  exec(query: string): Promise<unknown>;
}

interface Env {
  DB: D1Database;
}

interface EventContext<Env, P extends string, Data> {
  request: Request;
  functionPath: string;
  waitUntil: (promise: Promise<unknown>) => void;
  next: (input?: Request | string, init?: RequestInit) => Promise<Response>;
  env: Env;
  params: Record<P, string | string[]>;
  data: Data;
}

type PagesFunction<TEnv = Env> = (context: EventContext<TEnv, any, any>) => Promise<Response> | Response;

// Helper to ensure the bondhon_items table exists
async function ensureTable(db: D1Database) {
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS bondhon_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      image TEXT,
      link TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `).run();
}

// GET /api/items - Fetch all items from D1 table bondhon_items
export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const db = context.env.DB;
    if (!db) {
      return new Response(
        JSON.stringify({ success: false, error: 'Cloudflare D1 database binding DB not found' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    await ensureTable(db);

    const result = await db.prepare(
      `SELECT id, title, description, image, link, created_at FROM bondhon_items ORDER BY id DESC`
    ).all();

    return new Response(
      JSON.stringify({ success: true, items: result.results || [] }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, error: error?.message || 'Database error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// POST /api/items - Insert new item into D1 table bondhon_items
export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const db = context.env.DB;
    if (!db) {
      return new Response(
        JSON.stringify({ success: false, error: 'Cloudflare D1 database binding DB not found' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const payload = (await context.request.json()) as {
      title?: string;
      description?: string;
      image?: string;
      link?: string;
    };

    const title = payload.title?.trim();
    const description = payload.description?.trim() || '';
    const image = payload.image?.trim() || '';
    const link = payload.link?.trim() || '';

    if (!title) {
      return new Response(
        JSON.stringify({ success: false, error: 'Title is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    await ensureTable(db);

    const insertResult = await db.prepare(
      `INSERT INTO bondhon_items (title, description, image, link) VALUES (?, ?, ?, ?)`
    ).bind(title, description, image, link).run();

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Item saved successfully to D1 database',
        id: insertResult.meta?.last_row_id,
        item: {
          id: insertResult.meta?.last_row_id,
          title,
          description,
          image,
          link,
          created_at: new Date().toISOString()
        }
      }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, error: error?.message || 'Database error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// DELETE /api/items - Delete item by ID
export const onRequestDelete: PagesFunction<Env> = async (context) => {
  try {
    const db = context.env.DB;
    if (!db) {
      return new Response(
        JSON.stringify({ success: false, error: 'Cloudflare D1 database binding DB not found' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const url = new URL(context.request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return new Response(
        JSON.stringify({ success: false, error: 'Item ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    await ensureTable(db);
    await db.prepare(`DELETE FROM bondhon_items WHERE id = ?`).bind(id).run();

    return new Response(
      JSON.stringify({ success: true, message: 'Item deleted successfully' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, error: error?.message || 'Database error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
