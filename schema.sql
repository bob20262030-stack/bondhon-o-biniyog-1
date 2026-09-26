-- Cloudflare D1 Database Schema for Bondhon Items
CREATE TABLE IF NOT EXISTS bondhon_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  image TEXT,
  link TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
