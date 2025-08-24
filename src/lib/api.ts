/* eslint-disable @typescript-eslint/no-explicit-any */
import { Client, Account, Databases, ID, Query } from 'appwrite';
import sql from 'sql.js';

// --- INTERFACES (These should match your Appwrite Collection attributes) ---
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
}

export interface Lesson {
  id: string; // Mapped from Appwrite's $id
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  content: string;
  // Note: The following fields are for the future when you build the lesson seeder
  // sqlSolution: string;
  // expectedResult: QueryResult;
  // hints: string[];
  estimatedTime: number;
}

export interface QueryResult {
  columns: string[];
  rows: any[][];
  executionTime: number;
  rowCount: number;
  success: boolean;
  error?: string;
}

// --- APPWRITE CLIENT INITIALIZATION ---
const appwriteEndpoint = import.meta.env.VITE_APPWRITE_ENDPOINT as string;
const appwriteProjectId = import.meta.env.VITE_APPWRITE_PROJECT_ID as string;

const client = new Client()
  .setEndpoint(appwriteEndpoint)
  .setProject(appwriteProjectId);

const account = new Account(client);
const databases = new Databases(client);

// --- DATABASE & COLLECTION IDs (Read from Vite env vars) ---
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID as string;
const LESSONS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID as string;

// Validate required env vars at startup for clearer errors
if (!appwriteEndpoint || !appwriteProjectId || !DATABASE_ID || !LESSONS_COLLECTION_ID) {
  console.error('Missing required Appwrite env vars.', {
    hasEndpoint: Boolean(appwriteEndpoint),
    hasProjectId: Boolean(appwriteProjectId),
    hasDatabaseId: Boolean(DATABASE_ID),
    hasCollectionId: Boolean(LESSONS_COLLECTION_ID),
  });
  throw new Error('Missing required Appwrite environment variables. Check your Vite env.');
}

// --- API FUNCTIONS ---

// AUTHENTICATION
export async function login(email: string, password: string): Promise<any> {
  await account.createEmailPasswordSession(email, password);
  return account.get();
}

export async function signup(email: string, password: string, name: string): Promise<any> {
  // Creates a new user account.
  return account.create(ID.unique(), email, password, name);
}

export async function getCurrentUser(): Promise<any | null> {
  try {
    return await account.get();
  } catch (error) {
    console.error('No active session found.');
    return null;
  }
}

export async function logout() {
  return account.deleteSession('current');
}

// LESSONS
export async function getLessons(): Promise<Lesson[]> {
  const response = await databases.listDocuments(
    DATABASE_ID,
    LESSONS_COLLECTION_ID
  );
  const docs = response.documents as unknown as any[];
  return docs.map((d: any) => ({ id: d.$id, ...d }));
}

export async function getLessonById(id: string): Promise<Lesson> {
  const response = await databases.getDocument(
    DATABASE_ID,
    LESSONS_COLLECTION_ID,
    id
  );
  const d = response as unknown as any;
  return { id: d.$id, ...d } as Lesson;
}

// USER PROGRESS (temporary placeholder – replace with real backend logic later)
export async function getUserProgress(): Promise<{ completedLessons: string[]; totalScore: number }> {
  return { completedLessons: [], totalScore: 0 };
}

// SQL EXECUTION SANDBOX (In-browser using sql.js)
let db: any = null;

// This function creates the temporary in-browser database for users to practice on.
async function initSandboxDatabase() {
  const SQL = await sql({
    locateFile: file => `https://sql.js.org/dist/${file}`
  });
  db = new SQL.Database();

  // Create some sample tables for the user to query
  const createTables = `
    CREATE TABLE employees (id INT, first_name VARCHAR, last_name VARCHAR, salary REAL, department_id INT);
    CREATE TABLE departments (id INT, name VARCHAR);
  `;
  db.run(createTables);

  // Insert some sample data into the tables
  const insertData = `
    INSERT INTO employees VALUES (1, 'John', 'Doe', 75000, 1), (2, 'Jane', 'Smith', 80000, 2), (3, 'Mike', 'Johnson', 70000, 1);
    INSERT INTO departments VALUES (1, 'Engineering'), (2, 'Marketing'), (3, 'Sales');
  `;
  db.run(insertData);
}

export async function executeQuery(sqlQuery: string): Promise<QueryResult> {
  const startTime = performance.now();
  if (!db) {
    await initSandboxDatabase();
  }

  try {
    const results = db.exec(sqlQuery);
    const endTime = performance.now();

    if (results.length === 0) {
      return {
        columns: ['status'],
        rows: [['Query executed successfully.']],
        executionTime: (endTime - startTime) / 1000,
        rowCount: 0,
        success: true,
      };
    }

    const { columns, values } = results[0];
    return {
      columns,
      rows: values,
      executionTime: (endTime - startTime) / 1000,
      rowCount: values.length,
      success: true,
    };
  } catch (error: any) {
    const endTime = performance.now();
    return {
      columns: [],
      rows: [],
      executionTime: (endTime - startTime) / 1000,
      rowCount: 0,
      success: false,
      error: error.message,
    };
  }
}
