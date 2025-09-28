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
  User,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { getLessonById, executeQuery, getNextLessonId, type Lesson, type QueryResult } from '@/lib/api';

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
  const [nextLessonId, setNextLessonId] = useState<string | null>(null);

  useEffect(() => {
    const loadLesson = async () => {
      if (!id) return;
      
      try {
        const lessonData = await getLessonById(id);
        setLesson(lessonData);
        // Set initial query to match available tables
        setSqlQuery('-- Write your query here\nSELECT * \nFROM employees;');
        
        // Get next lesson ID
        if (lessonData.orderIndex !== undefined) {
          const nextId = await getNextLessonId(lessonData.orderIndex);
          setNextLessonId(nextId);
        }
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
    <div className="min-h-screen bg-background">
      {/* Back Button */}
      <div className="p-6 border-b">
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>

      <div className="flex h-[calc(100vh-120px)]">
        {/* Left Sidebar - Challenge & Schema */}
        <div className="w-96 border-r bg-card flex flex-col">
          {/* Challenge Section */}
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold mb-3">
              Challenge: {lesson.title}
            </h2>
            <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              <p>{lesson.description}</p>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={getDifficultyColor(lesson.difficulty)}>
                  {lesson.difficulty}
                </Badge>
              </div>
            </div>
          </div>

          {/* Database Schema Section */}
          <div className="flex-1 p-6 overflow-auto">
            <h3 className="text-lg font-semibold mb-4">Database Schema</h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-medium">Table:</span>
                  <Badge variant="secondary">employees</Badge>
                </div>
                
                <Card>
                  <CardContent className="p-0">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="px-4 py-2 text-left font-medium">Column</th>
                          <th className="px-4 py-2 text-left font-medium">Type</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="px-4 py-2 text-muted-foreground">id</td>
                          <td className="px-4 py-2">INT</td>
                        </tr>
                        <tr className="border-b">
                          <td className="px-4 py-2 text-muted-foreground">first_name</td>
                          <td className="px-4 py-2">VARCHAR</td>
                        </tr>
                        <tr className="border-b">
                          <td className="px-4 py-2 text-muted-foreground">last_name</td>
                          <td className="px-4 py-2">VARCHAR</td>
                        </tr>
                        <tr className="border-b">
                          <td className="px-4 py-2 text-muted-foreground">salary</td>
                          <td className="px-4 py-2">REAL</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 text-muted-foreground">department_id</td>
                          <td className="px-4 py-2">INT</td>
                        </tr>
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-medium">Table:</span>
                  <Badge variant="secondary">departments</Badge>
                </div>
                
                <Card>
                  <CardContent className="p-0">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="px-4 py-2 text-left font-medium">Column</th>
                          <th className="px-4 py-2 text-left font-medium">Type</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="px-4 py-2 text-muted-foreground">id</td>
                          <td className="px-4 py-2">INT</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 text-muted-foreground">name</td>
                          <td className="px-4 py-2">VARCHAR</td>
                        </tr>
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* SQL Editor */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="p-4 border-b bg-card">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">SQL Editor</h3>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowHints(!showHints)}
                  >
                    <Lightbulb className="w-4 h-4 mr-2" />
                    Hint
                  </Button>
                  <Button
                    onClick={handleRunQuery}
                    disabled={isRunning}
                    className={`${showSuccess ? 'animate-pulse bg-success' : ''} ${showError ? 'animate-pulse bg-destructive' : ''}`}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    {isRunning ? 'Running...' : 'Run Query'}
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="flex-1 min-h-0">
              <Editor
                height="100%"
                defaultLanguage="sql"
                theme="light"
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
          <div className="h-80 border-t bg-card flex flex-col">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Results</h3>
                {queryResult?.success && (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-sm text-success">
                      Query executed in {queryResult.executionTime.toFixed(3)}s - {queryResult.rowCount} rows
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex-1 p-4 overflow-auto">
              {!queryResult ? (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  <p>Results will appear here after running your query</p>
                </div>
              ) : queryResult.success ? (
                <div className="space-y-4">
                  <div className="overflow-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          {queryResult.columns.map((column, index) => (
                            <th key={index} className="px-4 py-2 text-left font-medium">
                              {column}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {queryResult.rows?.map((row, rowIndex) => (
                          <tr key={rowIndex} className="border-b">
                            {queryResult.columns.map((column, colIndex) => (
                              <td key={colIndex} className="px-4 py-2">
                                {row[colIndex]}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {nextLessonId && (
                    <div className="flex justify-end pt-4">
                      <Button
                        onClick={() => navigate(`/lessons/${nextLessonId}`)}
                        className="bg-success hover:bg-success/90 relative z-10 pointer-events-auto"
                        size="default"
                      >
                        Next Lesson
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <AlertCircle className="w-8 h-8 text-destructive mx-auto" />
                    <p className="text-destructive font-medium">Query Failed</p>
                    <p className="text-sm text-muted-foreground">{queryResult.error}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hints Modal */}
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
              className="bg-card p-6 rounded-lg border max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Hint</h3>
              </div>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>• Use the SELECT statement to query data from tables</p>
                <p>• The asterisk (*) selects all columns from a table</p>
                <p>• Remember to specify the table name after FROM</p>
              </div>
              <Button 
                onClick={() => setShowHints(false)}
                className="mt-4 w-full"
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