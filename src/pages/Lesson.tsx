import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Editor from '@monaco-editor/react';
import { 
  Play, 
  ArrowLeft, 
  CheckCircle, 
  AlertCircle, 
  Lightbulb,
  Database,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { getLessonById, executeQuery, type Lesson, type QueryResult } from '@/lib/api';

const LessonPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [sqlQuery, setSqlQuery] = useState('');
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showHints, setShowHints] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    const loadLesson = async () => {
      if (!id) return;
      
      try {
        const lessonData = await getLessonById(id);
        setLesson(lessonData);
        // Set initial query to match reference
        setSqlQuery('-- Write your query here\nSELECT * \nFROM users;');
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load lesson. Please try again.",
          variant: "destructive",
        });
        navigate('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    loadLesson();
  }, [id, navigate, toast]);

  const handleRunQuery = useCallback(async () => {
    if (!sqlQuery.trim()) {
      toast({
        title: "Empty query",
        description: "Please write a SQL query before running.",
        variant: "destructive",
      });
      setShowError(true);
      setTimeout(() => setShowError(false), 600);
      return;
    }

    setIsRunning(true);
    try {
      const result = await executeQuery(sqlQuery);
      setQueryResult(result);
      
      if (result.success) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 800);
        toast({
          title: "✅ Query executed successfully!",
          description: `Retrieved ${result.rowCount} rows in ${result.executionTime.toFixed(3)}s`,
        });
      } else {
        setShowError(true);
        setTimeout(() => setShowError(false), 600);
        toast({
          title: "❌ Query failed",
          description: result.error || "Unknown error occurred",
          variant: "destructive",
        });
      }
    } catch (error) {
      setShowError(true);
      setTimeout(() => setShowError(false), 600);
      toast({
        title: "🚨 Execution error",
        description: "Failed to execute query. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
    }
  }, [sqlQuery, id, toast]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault();
        handleRunQuery();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleRunQuery]);

  const handleReset = () => {
    setSqlQuery('-- Write your SQL query here\n');
    setQueryResult(null);
    setShowHints(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-success/20 text-success border-success/30';
      case 'Intermediate': return 'bg-warning/20 text-warning border-warning/30';
      case 'Advanced': return 'bg-destructive/20 text-destructive border-destructive/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto animate-float">
            <Database className="w-6 h-6 text-white" />
          </div>
          <p className="text-muted-foreground">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
          <p className="text-foreground">Lesson not found</p>
          <Button onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Database className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-white">SQL Quest</h1>
              </div>
              <nav className="hidden md:flex items-center gap-6 text-sm">
                <button className="text-slate-300 hover:text-white transition-colors">Challenges</button>
                <button className="text-slate-300 hover:text-white transition-colors">Learn</button>
                <button className="text-slate-300 hover:text-white transition-colors">Community</button>
                <button className="text-slate-300 hover:text-white transition-colors">Leaderboard</button>
              </nav>
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
                🌙
              </Button>
              <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
                🔔
              </Button>
              <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Left Sidebar */}
        <div className="w-96 bg-slate-800 border-r border-slate-700 flex flex-col">
          {/* Challenge Section */}
          <div className="p-6 border-b border-slate-700">
            <h2 className="text-lg font-semibold text-white mb-3">
              Challenge 1: {lesson.title}
            </h2>
            <div className="space-y-3 text-sm text-slate-300 leading-relaxed">
              <p>{lesson.description}</p>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={getDifficultyColor(lesson.difficulty)}>
                  {lesson.difficulty}
                </Badge>
              </div>
            </div>
          </div>

          {/* Database Schema Section */}
          <div className="flex-1 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Database Schema</h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-medium text-white">Table:</span>
                  <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                    users
                  </Badge>
                </div>
                
                <div className="bg-slate-900 rounded-lg border border-slate-600 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-700/50">
                      <tr>
                        <th className="px-4 py-2 text-left text-slate-300 font-medium">Column</th>
                        <th className="px-4 py-2 text-left text-slate-300 font-medium">Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-slate-600">
                        <td className="px-4 py-2 text-slate-400">id</td>
                        <td className="px-4 py-2 text-slate-300">INT PRIMARY KEY</td>
                      </tr>
                      <tr className="border-t border-slate-600">
                        <td className="px-4 py-2 text-slate-400">name</td>
                        <td className="px-4 py-2 text-slate-300">VARCHAR(255)</td>
                      </tr>
                      <tr className="border-t border-slate-600">
                        <td className="px-4 py-2 text-slate-400">email</td>
                        <td className="px-4 py-2 text-slate-300">VARCHAR(255)</td>
                      </tr>
                      <tr className="border-t border-slate-600">
                        <td className="px-4 py-2 text-slate-400">created_at</td>
                        <td className="px-4 py-2 text-slate-300">TIMESTAMP</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col">
          {/* SQL Editor */}
          <div className="flex-1 bg-slate-900 border-b border-slate-700">
            <div className="p-4 border-b border-slate-700 bg-slate-800/50">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">SQL Editor</h3>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowHints(!showHints)}
                    className="bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600 hover:text-white"
                  >
                    <Lightbulb className="w-4 h-4 mr-2" />
                    Hint
                  </Button>
                  <Button
                    onClick={handleRunQuery}
                    disabled={isRunning}
                    className="bg-blue-500 hover:bg-blue-600 text-white border-0"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    {isRunning ? 'Running...' : 'Run Query'}
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="h-full">
              <Editor
                height="calc(100% - 65px)"
                defaultLanguage="sql"
                theme="vs-dark"
                value={sqlQuery}
                onChange={(value) => setSqlQuery(value || '')}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  roundedSelection: false,
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 2,
                  wordWrap: 'on',
                  padding: { top: 16, bottom: 16 }
                }}
              />
            </div>
          </div>

          {/* Results Section */}
          <div className="h-80 bg-slate-800 border-t border-slate-700">
            <div className="p-4 border-b border-slate-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Results</h3>
                {queryResult?.success && (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-green-400">Correct! 25ms 4 rows</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-4 h-full overflow-auto">
              {!queryResult ? (
                <div className="h-full flex items-center justify-center text-slate-400">
                  <p>Results will appear here after running your query</p>
                </div>
              ) : queryResult.success ? (
                <div className="overflow-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-700/50">
                      <tr>
                        {queryResult.columns.map((column, index) => (
                          <th key={index} className="px-4 py-2 text-left text-slate-300 font-medium border-b border-slate-600">
                            {column}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {queryResult.rows?.map((row, rowIndex) => (
                        <tr key={rowIndex} className="border-b border-slate-700">
                          {queryResult.columns.map((column, colIndex) => (
                            <td key={colIndex} className="px-4 py-2 text-slate-300">
                              {row[colIndex]}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <AlertCircle className="w-8 h-8 text-red-400 mx-auto" />
                    <p className="text-red-400 font-medium">Query Failed</p>
                    <p className="text-sm text-slate-400">{queryResult.error}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hints Modal/Overlay */}
      <AnimatePresence>
        {showHints && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowHints(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-800 p-6 rounded-lg border border-slate-600 max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                <h3 className="text-lg font-semibold text-white">Hint</h3>
              </div>
              <div className="space-y-3 text-sm text-slate-300">
                <p>• Use the SELECT statement to query data from tables</p>
                <p>• The asterisk (*) selects all columns from a table</p>
                <p>• Remember to specify the table name after FROM</p>
              </div>
              <Button 
                onClick={() => setShowHints(false)}
                className="mt-4 w-full bg-blue-500 hover:bg-blue-600"
              >
                Got it!
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LessonPage;