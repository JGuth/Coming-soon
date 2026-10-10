import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';

export interface SignupRecord {
  id: number;
  email: string;
  consent: number;
  source: string;
  interest: string;
  ip_hash: string | null;
  created_at: string;
}

export interface SignupResult {
  isNew: boolean;
  message: string;
}

class DatabaseManager {
  private db: DatabaseSync | null = null;
  private dbPath: string;

  constructor() {
    this.dbPath = process.env.DB_PATH || path.resolve(process.cwd(), 'data', 'pipeband_signups.db');
  }

  public init(): void {
    if (this.db) return;

    const dir = path.dirname(this.dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    this.db = new DatabaseSync(this.dbPath);

    // Initialize schema
    this.db.exec(`
      PRAGMA journal_mode = WAL;
      PRAGMA synchronous = NORMAL;
      CREATE TABLE IF NOT EXISTS signups (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL COLLATE NOCASE,
        consent INTEGER DEFAULT 1,
        source TEXT DEFAULT 'launch_page',
        interest TEXT DEFAULT 'general',
        ip_hash TEXT,
        created_at TEXT NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_signups_email ON signups(email);
      CREATE INDEX IF NOT EXISTS idx_signups_created ON signups(created_at);
    `);
  }

  public insertSignup(
    email: string,
    consent: boolean = true,
    interest: string = 'general',
    ipHash: string | null = null
  ): SignupResult {
    this.init();
    if (!this.db) throw new Error('Database not initialized');

    const normalizedEmail = email.trim().toLowerCase();
    const now = new Date().toISOString();

    // Check if email already exists
    const checkStmt = this.db.prepare('SELECT id FROM signups WHERE email = ?');
    const existing = checkStmt.get(normalizedEmail) as { id: number } | undefined;

    if (existing) {
      return {
        isNew: false,
        message: "You're already on our launch list! We'll notify you as soon as PipeBand.app opens.",
      };
    }

    const insertStmt = this.db.prepare(`
      INSERT INTO signups (email, consent, source, interest, ip_hash, created_at)
      VALUES (?, ?, 'launch_page', ?, ?, ?)
    `);

    insertStmt.run(normalizedEmail, consent ? 1 : 0, interest, ipHash, now);

    return {
      isNew: true,
      message: 'Welcome aboard! You have been successfully added to the PipeBand.app launch list.',
    };
  }

  public getCount(): number {
    this.init();
    if (!this.db) return 0;
    try {
      const stmt = this.db.prepare('SELECT COUNT(*) as count FROM signups');
      const row = stmt.get() as { count: number } | undefined;
      return row ? Number(row.count) : 0;
    } catch {
      return 0;
    }
  }

  public checkHealth(): boolean {
    this.init();
    if (!this.db) return false;
    try {
      const stmt = this.db.prepare('SELECT 1 as alive');
      const row = stmt.get() as { alive: number } | undefined;
      return row?.alive === 1;
    } catch {
      return false;
    }
  }

  public close(): void {
    if (this.db) {
      try {
        this.db.close();
      } catch (err) {
        console.error('Error closing database:', err);
      } finally {
        this.db = null;
      }
    }
  }
}

export const dbManager = new DatabaseManager();
