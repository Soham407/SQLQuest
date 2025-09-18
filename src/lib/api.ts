/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from '@/integrations/supabase/client';
import sql from 'sql.js';

// --- INTERFACES ---
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  content: string;
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

// --- API FUNCTIONS ---

// AUTHENTICATION
export async function login(email: string, password: string): Promise<any> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data.user;
}

export async function signup(email: string, password: string, name: string): Promise<any> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: name,
      },
    },
  });
  if (error) throw error;
  return data.user;
}

// OAuth Providers
export async function loginWithOAuth(provider: 'google' | 'github'): Promise<void> {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: provider as 'google' | 'github',
    options: {
      redirectTo: `${window.location.origin}/dashboard`,
    },
  });
  if (error) throw error;
}

export async function getCurrentUser(): Promise<any | null> {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// LESSONS (Placeholder - will need database tables)
export async function getLessons(): Promise<Lesson[]> {
  // TODO: Implement with Supabase when lessons table is created
  return [
    {
      id: '1',
      title: 'Introduction to SQL',
      description: 'Learn the basics of SQL queries',
      difficulty: 'Beginner' as const,
      category: 'Fundamentals',
      content: 'Welcome to SQL! In this lesson, you\'ll learn SELECT statements...',
      estimatedTime: 30,
    },
    {
      id: '2', 
      title: 'Advanced Joins',
      description: 'Master complex JOIN operations',
      difficulty: 'Advanced' as const,
      category: 'Advanced',
      content: 'Learn about INNER, LEFT, RIGHT, and FULL OUTER JOINs...',
      estimatedTime: 60,
    },
  ];
}

export async function getLessonById(id: string): Promise<Lesson> {
  const lessons = await getLessons();
  const lesson = lessons.find(l => l.id === id);
  if (!lesson) throw new Error('Lesson not found');
  return lesson;
}

// USER PROGRESS (temporary placeholder – replace with real backend logic later)
export async function getUserProgress(): Promise<{ completedLessons: string[]; totalScore: number }> {
  // Temporary sample data - replace with real backend integration later
  return { 
    completedLessons: ['1', '2'], // Sample completed lesson IDs
    totalScore: 850 
  };
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
