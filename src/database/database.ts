import * as SQLite from 'expo-sqlite';
import jobType, { jobDBType } from '../typesAndSchemas/jobs';

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

const getDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
    if (!dbPromise) {
        dbPromise = SQLite.openDatabaseAsync('jobs.db');
    }
    return dbPromise;
};

export const setupDatabase = async () => {
    const db = await getDatabase();
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS bookmarks (
            id TEXT PRIMARY KEY, 
            title TEXT NOT NULL,
            location TEXT,
            salary TEXT,
            phone TEXT,
            description TEXT, 
            company TEXT, 
            saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);
};

export const addBookmark = async (job: jobType) => {
    const db = await getDatabase();
    await db.runAsync(
        `INSERT OR REPLACE INTO bookmarks (
            id, title, location, salary, phone, description, company 
        ) VALUES (?, ?, ?, ?, ?, ?, ? )`,
        [
            job.id,
            job.title,
            job.primary_details.Place,
            job.primary_details.Salary,
            job.whatsapp_no,
            job.other_details,
            job.company_name,
        ]
    );
};

export const getBookmarks = async (): Promise<jobDBType[]> => {
    const db = await getDatabase();
    const result = await db.getAllAsync<jobDBType>('SELECT * FROM bookmarks ORDER BY saved_at ASC;');
    return result;
};

export const isBookmarked = async (jobId: string): Promise<boolean> => {
    const db = await getDatabase();
    const result = await db.getAllAsync<{ id: string }>(
        'SELECT id FROM bookmarks WHERE id = ? LIMIT 1;',
        [jobId]
    );
    return result.length > 0;
};

export const removeBookmark = async (jobId: string) => {
    const db = await getDatabase();
    await db.runAsync(
        'DELETE FROM bookmarks WHERE id = ?;',
        [jobId]
    );
};