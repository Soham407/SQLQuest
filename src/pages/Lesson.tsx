import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Editor from '@monaco-editor/react';
import { 
  Play, 
  ArrowLeft, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Lightbulb,
  Database,
  RotateCcw,
  Keyboard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
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
        // Set initial query with a comment
        setSqlQuery('-- Write your SQL query here\n');
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
      const result = await executeQuery(sqlQuery, id);
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
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Dashboard
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Database className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h1 className="font-semibold text-foreground">SQL Quest Interactive</h1>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge variant="outline" className={getDifficultyColor(lesson.difficulty)}>
                {lesson.difficulty}
              </Badge>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>{lesson.estimatedTime} min</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-120px)]">
          
          {/* Left Panel - Lesson Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-xl">{lesson.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{lesson.description}</p>
              </CardHeader>
              <CardContent className="custom-scrollbar overflow-y-auto max-h-[calc(100vh-250px)]">
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <div dangerouslySetInnerHTML={{ 
                    __html: lesson.content.replace(/\n/g, '<br/>').replace(/```sql\n(.*?)\n```/gs, '<pre><code class="sql">$1</code></pre>')
                  }} />
                </div>
                
                {/* Hints Section */}
                <div className="mt-6 pt-4 border-t border-border">
                  <Button
                    variant="outline"
                    onClick={() => setShowHints(!showHints)}
                    className="w-full flex items-center gap-2"
                  >
                    <Lightbulb className="w-4 h-4" />
                    {showHints ? 'Hide Hints' : 'Show Hints'}
                  </Button>
                  
                  {showHints && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-3 space-y-2"
                    >
                      {lesson.hints.map((hint, index) => (
                        <div key={index} className="text-sm p-3 bg-muted/50 rounded-lg border border-border">
                          <div className="flex items-start gap-2">
                            <Lightbulb className="w-3 h-3 text-warning mt-0.5 flex-shrink-0" />
                            <span>{hint}</span>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Center Panel - SQL Editor */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <Card className="h-full flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">SQL Editor</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleReset}
                      className="flex items-center gap-2"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Reset
                    </Button>
                    <motion.div
                      whileTap={{ scale: 0.95 }}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.1 }}
                    >
                      <Button
                        onClick={handleRunQuery}
                        disabled={isRunning}
                        className="flex items-center gap-2 bg-gradient-primary hover:opacity-90 relative group"
                      >
                        <Play className="w-3 h-3" />
                        {isRunning ? 'Running...' : 'Run Query'}
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-popover text-popover-foreground text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap flex items-center gap-1">
                          <Keyboard className="w-3 h-3" />
                          {navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'} + Enter
                        </div>
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 p-0">
                <motion.div 
                  className={`h-full border border-border rounded-lg overflow-hidden transition-all duration-300 ${
                    showError ? 'border-destructive shadow-lg animate-shake' : ''
                  }`}
                  animate={showError ? { x: [-10, 10, -10, 10, 0] } : {}}
                  transition={{ duration: 0.5 }}
                >
                  <Editor
                    height="100%"
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
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Panel - Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <motion.div
              className={`h-full transition-all duration-500 ${
                showSuccess ? 'ring-2 ring-success shadow-lg shadow-success/20' : ''
              } ${
                showError ? 'ring-2 ring-destructive shadow-lg shadow-destructive/20' : ''
              }`}
              animate={showSuccess ? { scale: [1, 1.01, 1] } : {}}
              transition={{ duration: 0.4 }}
            >
              <Card className="h-full flex flex-col">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    Query Results
                    <AnimatePresence>
                      {queryResult?.success && (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0, rotate: 180 }}
                          transition={{ type: "spring", stiffness: 260, damping: 20 }}
                        >
                          <CheckCircle className="w-4 h-4 text-success" />
                        </motion.div>
                      )}
                      {queryResult?.success === false && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          transition={{ type: "spring", stiffness: 260, damping: 20 }}
                        >
                          <AlertCircle className="w-4 h-4 text-destructive" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardTitle>
                {queryResult && (
                  <div className="text-sm text-muted-foreground">
                    {queryResult.success ? (
                      <span>
                        {queryResult.rowCount} rows • {queryResult.executionTime.toFixed(3)}s
                      </span>
                    ) : (
                      <span className="text-destructive">Execution failed</span>
                    )}
                  </div>
                )}
              </CardHeader>
                <CardContent className="flex-1 overflow-hidden">
                  {!queryResult ? (
                    <div className="h-full flex items-center justify-center text-muted-foreground">
                      <motion.div 
                        className="text-center space-y-3"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <motion.div
                          animate={{ rotate: [0, 5, -5, 0] }}
                          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                        >
                          <Database className="w-12 h-12 mx-auto opacity-50" />
                        </motion.div>
                        <div>
                          <p className="font-medium">Ready to execute your query</p>
                          <p className="text-sm text-muted-foreground/70 mt-1">
                            Results will appear here after running
                          </p>
                          <div className="flex items-center justify-center gap-1 mt-2 text-xs text-muted-foreground/50">
                            <Keyboard className="w-3 h-3" />
                            <span>Press {navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'} + Enter to run</span>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  ) : queryResult.success ? (
                    <motion.div 
                      className="h-full overflow-auto custom-scrollbar"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <table className="result-table">
                        <thead>
                          <tr>
                            {queryResult.columns.map((column, index) => (
                              <motion.th 
                                key={index}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                              >
                                {column}
                              </motion.th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {queryResult.rows.map((row, rowIndex) => (
                            <motion.tr 
                              key={rowIndex}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: (rowIndex + queryResult.columns.length) * 0.02 }}
                            >
                              {row.map((cell, cellIndex) => (
                                <td key={cellIndex}>{cell}</td>
                              ))}
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </motion.div>
                  ) : (
                    <motion.div 
                      className="h-full flex items-center justify-center"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="text-center space-y-3 p-4">
                        <motion.div
                          animate={{ rotate: [0, -10, 10, 0] }}
                          transition={{ duration: 0.5 }}
                        >
                          <AlertCircle className="w-10 h-10 mx-auto text-destructive" />
                        </motion.div>
                        <p className="text-sm font-medium text-destructive">Query Error</p>
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="text-xs text-muted-foreground bg-destructive/10 p-3 rounded border border-destructive/20 max-w-sm"
                        >
                          {queryResult.error}
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LessonPage;