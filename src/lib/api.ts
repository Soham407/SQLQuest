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
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  content: string;
  estimatedTime: number;
  hints?: string[];
  expectedResult?: any;
  orderIndex?: number;
  isPublished?: boolean;
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

// LESSONS
export async function getLessons(): Promise<Lesson[]> {
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('is_published', true)
    .order('order_index');
  
  if (error) throw error;
  
  return data?.map(lesson => ({
    id: lesson.id,
    title: lesson.title,
    description: lesson.description || '',
    difficulty: lesson.difficulty as 'beginner' | 'intermediate' | 'advanced',
    category: lesson.category,
    content: lesson.content,
    estimatedTime: lesson.estimated_time,
    hints: lesson.hints,
    expectedResult: lesson.expected_result,
    orderIndex: lesson.order_index,
    isPublished: lesson.is_published
  })) || [];
}

export async function getLessonById(id: string): Promise<Lesson> {
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('id', id)
    .eq('is_published', true)
    .single();
  
  if (error) throw error;
  if (!data) throw new Error('Lesson not found');
  
  return {
    id: data.id,
    title: data.title,
    description: data.description || '',
    difficulty: data.difficulty as 'beginner' | 'intermediate' | 'advanced',
    category: data.category,
    content: data.content,
    estimatedTime: data.estimated_time,
    hints: data.hints,
    expectedResult: data.expected_result,
    orderIndex: data.order_index,
    isPublished: data.is_published
  };
}

// USER PROGRESS
export async function getUserProgress(): Promise<{ completedLessons: string[]; totalScore: number }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data: progress, error: progressError } = await supabase
    .from('user_progress')
    .select('total_score')
    .eq('user_id', user.id)
    .single();

  const { data: completions, error: completionsError } = await supabase
    .from('lesson_completions')
    .select('lesson_id')
    .eq('user_id', user.id)
    .eq('is_correct', true);

  if (progressError && progressError.code !== 'PGRST116') throw progressError;
  if (completionsError) throw completionsError;

  return {
    completedLessons: completions?.map(c => c.lesson_id) || [],
    totalScore: progress?.total_score || 0
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
