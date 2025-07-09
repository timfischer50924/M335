import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';

export interface entry {
    id?: number;
    title: string,
    description: string;
    date?: string;
    found: boolean;
    image?: string;
    lat?: number;
    lon?: number;
}

class DatabaseService {
    private sqllite: SQLiteConnection;
    private db: SQLiteDBConnection | undefined

    constructor() {
        this.sqllite = new SQLiteConnection(CapacitorSQLite);
    }


    async init() {
        if (!this.db) {
            try {
                this.db = await this.sqllite.createConnection(
                    'lost_found_db',   // DB-Name
                    false,             // encrypted?
                    'no-encryption',   // mode
                    1,                 // version
                    false              // readonly?
                );
            } catch (err: any) {
                // Connection existiert schon? Dann holen wir sie
                if (err.message?.includes('already exists')) {
                    this.db = await this.sqllite.retrieveConnection('lost_found_db', false);
                } else {
                    throw err;
                }
            }
            await this.db.open();
            await this.db.execute(`
        CREATE TABLE IF NOT EXISTS entries (
          id INTEGER PRIMARY KEY NOT NULL,
          title TEXT NOT NULL,
          description TEXT,
          date TEXT NOT NULL,
          found INTEGER NOT NULL,
          image TEXT,
          lat REAL,
          lon REAL
        );
      `);
        }
    }

    async addEntry(e: entry) {
        if (!this.db) await this.init();
        await this.db?.run(
            `INSERT INTO entries (
       title, description, date, found, image, lat, lon
     ) VALUES (?, ?, ?, ?, ?, ?, ?);`,
            [
                e.title,
                e.description,
                e.date!,
                e.found ? 1 : 0,
                e.image ?? null,
                e.lat ?? null,
                e.lon ?? null
            ],
            false
        );
    }
    async getEntry(id: number): Promise<entry | null> {
        if (!this.db) return null
        const res = await this.db.query('SELECT * FROM entries WHERE id = ?', [ id ])
        return res.values?.[0] as entry ?? null
    }
    async getAllEntries(): Promise<entry[]> {
        if (!this.db) await this.init();
        const res = await this.db!.query('SELECT * FROM entries;');
        const rows = res.values ?? [];
        return rows.map(r => ({
            id: r.id,
            title: r.title,
            description: r.description,
            date: r.date,
            found: r.found === 1,
            image: r.image,
            lat: r.lat,
            lon: r.lon
        }));
    }

    async deleteEntry(id: number) {
        if (!this.db) this.init();
        await this.db!.run(`DELETE FROM entries WHERE id = ?;`, [id]);
    }

    async close() {
        if (this.db) {
            await this.sqllite.closeConnection('lost_found_db', false);
            this.db = undefined;
        }
    }
}

export const dbService = new DatabaseService();