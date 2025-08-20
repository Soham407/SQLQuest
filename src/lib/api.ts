// Mock API layer for SQL Quest Interactive
// This simulates a backend API with fake data

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
  sqlSolution: string;
  expectedResult: QueryResult;
  hints: string[];
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

// Mock delay function to simulate network latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock user data
const mockUser: User = {
  id: '1',
  email: 'user@sqlquest.com',
  name: 'SQL Learner',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
  createdAt: '2024-01-01T00:00:00Z'
};

// Mock lessons data
const mockLessons: Lesson[] = [
  {
    id: '1',
    title: 'Introduction to SELECT',
    description: 'Learn the basics of retrieving data from a database using SELECT statements.',
    difficulty: 'Beginner',
    category: 'Fundamentals',
    content: `
# Introduction to SELECT

The SELECT statement is the foundation of SQL queries. It allows you to retrieve data from one or more tables in a database.

## Basic Syntax
\`\`\`sql
SELECT column1, column2, ...
FROM table_name;
\`\`\`

## Example
Let's start with a simple example. We have a table called \`employees\` with the following structure:
- id (integer)
- first_name (text)
- last_name (text)
- email (text)
- salary (decimal)

## Your Task
Write a query to select all columns from the employees table.

**Hint:** Use the asterisk (*) to select all columns.
    `,
    sqlSolution: 'SELECT * FROM employees;',
    expectedResult: {
      columns: ['id', 'first_name', 'last_name', 'email', 'salary'],
      rows: [
        [1, 'John', 'Doe', 'john.doe@company.com', 75000],
        [2, 'Jane', 'Smith', 'jane.smith@company.com', 80000],
        [3, 'Mike', 'Johnson', 'mike.johnson@company.com', 70000],
        [4, 'Sarah', 'Wilson', 'sarah.wilson@company.com', 85000]
      ],
      executionTime: 0.023,
      rowCount: 4,
      success: true
    },
    hints: [
      'Use SELECT * to select all columns',
      'Don\'t forget the FROM clause',
      'End your query with a semicolon'
    ],
    estimatedTime: 5
  },
  {
    id: '2',
    title: 'Filtering with WHERE',
    description: 'Learn how to filter data using WHERE clauses to get specific results.',
    difficulty: 'Beginner',
    category: 'Fundamentals',
    content: `
# Filtering with WHERE

The WHERE clause allows you to filter records that meet specific conditions.

## Basic Syntax
\`\`\`sql
SELECT column1, column2, ...
FROM table_name
WHERE condition;
\`\`\`

## Example
Using our employees table, let's filter employees with a salary greater than $75,000.

## Your Task
Write a query to select all employees who earn more than $75,000.

**Hint:** Use the > operator for "greater than" comparisons.
    `,
    sqlSolution: 'SELECT * FROM employees WHERE salary > 75000;',
    expectedResult: {
      columns: ['id', 'first_name', 'last_name', 'email', 'salary'],
      rows: [
        [2, 'Jane', 'Smith', 'jane.smith@company.com', 80000],
        [4, 'Sarah', 'Wilson', 'sarah.wilson@company.com', 85000]
      ],
      executionTime: 0.018,
      rowCount: 2,
      success: true
    },
    hints: [
      'Use WHERE clause to filter results',
      'Use > operator for greater than',
      'No quotes needed for numeric comparisons'
    ],
    estimatedTime: 8
  },
  {
    id: '3',
    title: 'Sorting with ORDER BY',
    description: 'Learn how to sort your query results in ascending or descending order.',
    difficulty: 'Beginner',
    category: 'Fundamentals',
    content: `
# Sorting with ORDER BY

The ORDER BY clause is used to sort the result set in ascending or descending order.

## Basic Syntax
\`\`\`sql
SELECT column1, column2, ...
FROM table_name
ORDER BY column1 [ASC|DESC];
\`\`\`

## Example
Let's sort our employees by salary in descending order (highest to lowest).

## Your Task
Write a query to select all employees and sort them by salary from highest to lowest.

**Hint:** Use DESC for descending order.
    `,
    sqlSolution: 'SELECT * FROM employees ORDER BY salary DESC;',
    expectedResult: {
      columns: ['id', 'first_name', 'last_name', 'email', 'salary'],
      rows: [
        [4, 'Sarah', 'Wilson', 'sarah.wilson@company.com', 85000],
        [2, 'Jane', 'Smith', 'jane.smith@company.com', 80000],
        [1, 'John', 'Doe', 'john.doe@company.com', 75000],
        [3, 'Mike', 'Johnson', 'mike.johnson@company.com', 70000]
      ],
      executionTime: 0.025,
      rowCount: 4,
      success: true
    },
    hints: [
      'Use ORDER BY to sort results',
      'Use DESC for descending order',
      'ASC is the default (ascending)'
    ],
    estimatedTime: 6
  },
  {
    id: '4',
    title: 'Working with JOINs',
    description: 'Understand how to combine data from multiple tables using JOIN operations.',
    difficulty: 'Intermediate',
    category: 'Advanced Queries',
    content: `
# Working with JOINs

JOINs allow you to combine rows from two or more tables based on a related column.

## INNER JOIN Syntax
\`\`\`sql
SELECT columns
FROM table1
INNER JOIN table2 ON table1.column = table2.column;
\`\`\`

## Example
We have two tables:
- \`employees\` (id, first_name, last_name, department_id)
- \`departments\` (id, name, location)

## Your Task
Write a query to get employee names along with their department names.

**Hint:** JOIN employees and departments tables on department_id.
    `,
    sqlSolution: 'SELECT e.first_name, e.last_name, d.name FROM employees e INNER JOIN departments d ON e.department_id = d.id;',
    expectedResult: {
      columns: ['first_name', 'last_name', 'name'],
      rows: [
        ['John', 'Doe', 'Engineering'],
        ['Jane', 'Smith', 'Marketing'],
        ['Mike', 'Johnson', 'Engineering'],
        ['Sarah', 'Wilson', 'Sales']
      ],
      executionTime: 0.032,
      rowCount: 4,
      success: true
    },
    hints: [
      'Use INNER JOIN to combine tables',
      'Use table aliases (e, d) for cleaner code',
      'JOIN ON the related columns'
    ],
    estimatedTime: 12
  },
  {
    id: '5',
    title: 'Aggregate Functions',
    description: 'Learn to use COUNT, SUM, AVG, and other aggregate functions for data analysis.',
    difficulty: 'Intermediate',
    category: 'Data Analysis',
    content: `
# Aggregate Functions

Aggregate functions perform calculations on a set of values and return a single value.

## Common Functions
- COUNT(): Counts the number of rows
- SUM(): Adds up numeric values
- AVG(): Calculates the average
- MAX(): Finds the maximum value
- MIN(): Finds the minimum value

## Example
Let's calculate some statistics about employee salaries.

## Your Task
Write a query to find the average salary of all employees.

**Hint:** Use the AVG() function.
    `,
    sqlSolution: 'SELECT AVG(salary) as average_salary FROM employees;',
    expectedResult: {
      columns: ['average_salary'],
      rows: [
        [77500]
      ],
      executionTime: 0.015,
      rowCount: 1,
      success: true
    },
    hints: [
      'Use AVG() function',
      'Use AS to create column alias',
      'Aggregate functions work on entire result set'
    ],
    estimatedTime: 10
  },
  {
    id: '6',
    title: 'Subqueries and Nested Queries',
    description: 'Master the art of writing queries within queries for complex data retrieval.',
    difficulty: 'Advanced',
    category: 'Advanced Queries',
    content: `
# Subqueries and Nested Queries

A subquery is a query nested inside another query. It can be used in SELECT, WHERE, and FROM clauses.

## Syntax
\`\`\`sql
SELECT column1
FROM table1
WHERE column2 IN (SELECT column3 FROM table2 WHERE condition);
\`\`\`

## Example
Find all employees who earn more than the average salary.

## Your Task
Write a query to select employees whose salary is above the company average.

**Hint:** Use a subquery with AVG() in the WHERE clause.
    `,
    sqlSolution: 'SELECT * FROM employees WHERE salary > (SELECT AVG(salary) FROM employees);',
    expectedResult: {
      columns: ['id', 'first_name', 'last_name', 'email', 'salary'],
      rows: [
        [2, 'Jane', 'Smith', 'jane.smith@company.com', 80000],
        [4, 'Sarah', 'Wilson', 'sarah.wilson@company.com', 85000]
      ],
      executionTime: 0.028,
      rowCount: 2,
      success: true
    },
    hints: [
      'Use subquery with AVG() function',
      'Subquery goes in parentheses',
      'Compare salary with subquery result'
    ],
    estimatedTime: 15
  }
];

// API Functions

export async function login(email: string, password: string): Promise<User> {
  await delay(800); // Simulate network delay
  
  // Simple mock validation
  if (email && password) {
    return mockUser;
  }
  
  throw new Error('Invalid credentials');
}

export async function getLessons(): Promise<Lesson[]> {
  await delay(300);
  return mockLessons;
}

export async function getLessonById(id: string): Promise<Lesson> {
  await delay(200);
  
  const lesson = mockLessons.find(l => l.id === id);
  if (!lesson) {
    throw new Error('Lesson not found');
  }
  
  return lesson;
}

export async function executeQuery(sqlQuery: string, lessonId?: string): Promise<QueryResult> {
  await delay(500); // Simulate query execution time
  
  const cleanQuery = sqlQuery.trim().toLowerCase();
  
  // Simple query validation
  if (!cleanQuery) {
    return {
      columns: [],
      rows: [],
      executionTime: 0,
      rowCount: 0,
      success: false,
      error: 'Query cannot be empty'
    };
  }
  
  // Check for basic SQL syntax
  if (!cleanQuery.includes('select') && !cleanQuery.includes('insert') && 
      !cleanQuery.includes('update') && !cleanQuery.includes('delete')) {
    return {
      columns: [],
      rows: [],
      executionTime: 0,
      rowCount: 0,
      success: false,
      error: 'Invalid SQL syntax. Query must contain SELECT, INSERT, UPDATE, or DELETE.'
    };
  }
  
  // If we have a lesson ID, try to match against the expected solution
  if (lessonId) {
    const lesson = mockLessons.find(l => l.id === lessonId);
    if (lesson) {
      const expectedQuery = lesson.sqlSolution.toLowerCase().replace(/\s+/g, ' ').trim();
      const userQuery = cleanQuery.replace(/\s+/g, ' ').trim();
      
      // If queries match closely, return the expected result
      if (userQuery === expectedQuery || 
          userQuery.includes('select * from employees') ||
          userQuery.includes('select') && userQuery.includes('employees')) {
        return lesson.expectedResult;
      }
    }
  }
  
  // Default successful query result for basic SELECT queries
  if (cleanQuery.includes('select')) {
    return {
      columns: ['id', 'first_name', 'last_name', 'email', 'salary'],
      rows: [
        [1, 'John', 'Doe', 'john.doe@company.com', 75000],
        [2, 'Jane', 'Smith', 'jane.smith@company.com', 80000],
        [3, 'Mike', 'Johnson', 'mike.johnson@company.com', 70000]
      ],
      executionTime: Math.random() * 0.1 + 0.01, // Random execution time
      rowCount: 3,
      success: true
    };
  }
  
  // Default response for other queries
  return {
    columns: ['result'],
    rows: [['Query executed successfully']],
    executionTime: Math.random() * 0.05 + 0.01,
    rowCount: 1,
    success: true
  };
}

// User progress and achievement functions
export async function getUserProgress(): Promise<{ completedLessons: string[], totalScore: number }> {
  await delay(200);
  return {
    completedLessons: ['1', '2'], // Mock completed lessons
    totalScore: 85
  };
}

export async function saveProgress(lessonId: string, score: number): Promise<void> {
  await delay(300);
  console.log(`Progress saved for lesson ${lessonId} with score ${score}`);
}