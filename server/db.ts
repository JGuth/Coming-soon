import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

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

export interface AdminUserRecord {
  username: string;
  password_hash: string;
  salt: string;
  token: string | null;
  token_expires: number | null;
  updated_at: string;
}

function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
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

      CREATE TABLE IF NOT EXISTS site_settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS admin_auth (
        username TEXT PRIMARY KEY,
        password_hash TEXT NOT NULL,
        salt TEXT NOT NULL,
        token TEXT,
        token_expires INTEGER,
        updated_at TEXT NOT NULL
      );
    `);

    this.seedDefaultAdmin();
  }

  private seedDefaultAdmin(): void {
    if (!this.db) return;
    try {
      const checkStmt = this.db.prepare('SELECT username FROM admin_auth WHERE username = ?');
      const existing = checkStmt.get('admin');
      if (!existing) {
        const defaultPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'admin123';
        const salt = crypto.randomBytes(16).toString('hex');
        const hash = hashPassword(defaultPassword, salt);
        const now = new Date().toISOString();

        const insertStmt = this.db.prepare(`
          INSERT INTO admin_auth (username, password_hash, salt, token, token_expires, updated_at)
          VALUES ('admin', ?, ?, NULL, NULL, ?)
        `);
        insertStmt.run(hash, salt, now);
        console.log('[Auth] Initialized default admin credentials (username: admin)');
      }
    } catch (err) {
      console.error('[Auth] Failed to seed default admin:', err);
    }
  }

  public loginAdmin(password: string, username: string = 'admin'): { success: boolean; token?: string; error?: string } {
    this.init();
    if (!this.db) return { success: false, error: 'Database unavailable' };

    try {
      const stmt = this.db.prepare('SELECT username, password_hash, salt FROM admin_auth WHERE username = ?');
      const user = stmt.get(username) as { username: string; password_hash: string; salt: string } | undefined;

      if (!user) {
        return { success: false, error: 'Admin account not found.' };
      }

      const calculatedHash = hashPassword(password, user.salt);
      if (calculatedHash !== user.password_hash) {
        return { success: false, error: 'Invalid admin password.' };
      }

      // Generate secure session token valid for 7 days
      const token = crypto.randomBytes(32).toString('hex');
      const tokenExpires = Date.now() + 7 * 24 * 60 * 60 * 1000;
      const now = new Date().toISOString();

      const updateStmt = this.db.prepare(`
        UPDATE admin_auth
        SET token = ?, token_expires = ?, updated_at = ?
        WHERE username = ?
      `);
      updateStmt.run(token, tokenExpires, now, username);

      return { success: true, token };
    } catch (err) {
      console.error('Error during admin login:', err);
      return { success: false, error: 'An error occurred during authentication.' };
    }
  }

  public verifyAdminToken(token: string | undefined): boolean {
    if (!token || typeof token !== 'string') return false;
    this.init();
    if (!this.db) return false;

    try {
      const cleanToken = token.replace(/^Bearer\s+/i, '').trim();
      if (!cleanToken) return false;

      const stmt = this.db.prepare('SELECT token_expires FROM admin_auth WHERE token = ?');
      const row = stmt.get(cleanToken) as { token_expires: number } | undefined;

      if (!row) return false;
      if (row.token_expires && Date.now() > row.token_expires) {
        return false;
      }
      return true;
    } catch (err) {
      console.error('Error verifying admin token:', err);
      return false;
    }
  }

  public changeAdminPassword(currentPass: string, newPass: string, username: string = 'admin'): { success: boolean; error?: string } {
    this.init();
    if (!this.db) return { success: false, error: 'Database unavailable' };

    if (!newPass || newPass.length < 4) {
      return { success: false, error: 'New password must be at least 4 characters.' };
    }

    try {
      const stmt = this.db.prepare('SELECT username, password_hash, salt FROM admin_auth WHERE username = ?');
      const user = stmt.get(username) as { username: string; password_hash: string; salt: string } | undefined;

      if (!user) {
        return { success: false, error: 'Admin user not found.' };
      }

      const calculatedOld = hashPassword(currentPass, user.salt);
      if (calculatedOld !== user.password_hash) {
        return { success: false, error: 'Current password does not match.' };
      }

      const newSalt = crypto.randomBytes(16).toString('hex');
      const newHash = hashPassword(newPass, newSalt);
      const newToken = crypto.randomBytes(32).toString('hex');
      const tokenExpires = Date.now() + 7 * 24 * 60 * 60 * 1000;
      const now = new Date().toISOString();

      const updateStmt = this.db.prepare(`
        UPDATE admin_auth
        SET password_hash = ?, salt = ?, token = ?, token_expires = ?, updated_at = ?
        WHERE username = ?
      `);
      updateStmt.run(newHash, newSalt, newToken, tokenExpires, now, username);

      return { success: true };
    } catch (err) {
      console.error('Error changing admin password:', err);
      return { success: false, error: 'Failed to update password.' };
    }
  }

  public logoutAdmin(token: string | undefined): boolean {
    if (!token) return true;
    this.init();
    if (!this.db) return false;

    try {
      const cleanToken = token.replace(/^Bearer\s+/i, '').trim();
      const stmt = this.db.prepare('UPDATE admin_auth SET token = NULL, token_expires = NULL WHERE token = ?');
      stmt.run(cleanToken);
      return true;
    } catch {
      return false;
    }
  }

  public getSettings(): string | null {
    this.init();
    if (!this.db) return null;
    try {
      const stmt = this.db.prepare('SELECT value FROM site_settings WHERE key = ?');
      const row = stmt.get('website_config') as { value: string } | undefined;
      return row ? row.value : null;
    } catch (err) {
      console.error('Error fetching site settings:', err);
      return null;
    }
  }

  public saveSettings(jsonValue: string): boolean {
    this.init();
    if (!this.db) return false;
    try {
      const now = new Date().toISOString();
      const stmt = this.db.prepare(`
        INSERT INTO site_settings (key, value, updated_at)
        VALUES ('website_config', ?, ?)
        ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
      `);
      stmt.run(jsonValue, now);
      return true;
    } catch (err) {
      console.error('Error saving site settings:', err);
      return false;
    }
  }

  public resetSettings(): boolean {
    this.init();
    if (!this.db) return false;
    try {
      const stmt = this.db.prepare("DELETE FROM site_settings WHERE key = 'website_config'");
      stmt.run();
      return true;
    } catch (err) {
      console.error('Error resetting site settings:', err);
      return false;
    }
  }

  public getAllSignups(limit: number = 200, search?: string): SignupRecord[] {
    this.init();
    if (!this.db) return [];
    try {
      if (search && search.trim()) {
        const queryTerm = `%${search.trim().toLowerCase()}%`;
        const stmt = this.db.prepare(`
          SELECT id, email, consent, source, interest, ip_hash, created_at
          FROM signups
          WHERE LOWER(email) LIKE ? OR LOWER(interest) LIKE ?
          ORDER BY id DESC
          LIMIT ?
        `);
        return stmt.all(queryTerm, queryTerm, limit) as unknown as SignupRecord[];
      }

      const stmt = this.db.prepare(`
        SELECT id, email, consent, source, interest, ip_hash, created_at
        FROM signups
        ORDER BY id DESC
        LIMIT ?
      `);
      return stmt.all(limit) as unknown as SignupRecord[];
    } catch (err) {
      console.error('Error getting signups:', err);
      return [];
    }
  }

  public deleteSignup(id: number): boolean {
    this.init();
    if (!this.db) return false;
    try {
      const stmt = this.db.prepare('DELETE FROM signups WHERE id = ?');
      stmt.run(id);
      return true;
    } catch (err) {
      console.error('Error deleting signup:', err);
      return false;
    }
  }

  public clearSignups(): boolean {
    this.init();
    if (!this.db) return false;
    try {
      const stmt = this.db.prepare('DELETE FROM signups');
      stmt.run();
      return true;
    } catch (err) {
      console.error('Error clearing signups:', err);
      return false;
    }
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
