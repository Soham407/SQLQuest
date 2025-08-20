import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Database, User, Trophy, Clock, Star, ArrowRight, Code, Zap, Grid3X3, Grid2X2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getLessons, getUserProgress, type Lesson } from '@/lib/api';

const Dashboard = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [progress, setProgress] = useState({ completedLessons: [], totalScore: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [gridLayout, setGridLayout] = useState('grid-4');
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [lessonsData, progressData] = await Promise.all([
          getLessons(),
          getUserProgress()
        ]);
        setLessons(lessonsData);
        setProgress(progressData);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-success/20 text-success border-success/30';
      case 'Intermediate': return 'bg-warning/20 text-warning border-warning/30';
      case 'Advanced': return 'bg-destructive/20 text-destructive border-destructive/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getGridCols = (layout: string) => {
    switch (layout) {
      case 'grid-4': return 'lg:grid-cols-4';
      case 'grid-6': return 'lg:grid-cols-6';
      default: return 'lg:grid-cols-3';
    }
  };

  const completionPercentage = (progress.completedLessons.length / lessons.length) * 100;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto animate-float">
            <Database className="w-6 h-6 text-white" />
          </div>
          <p className="text-muted-foreground">Loading your SQL journey...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Database className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gradient">SQL Quest Interactive</h1>
              <p className="text-sm text-muted-foreground">Master SQL interactively</p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="w-4 h-4" />
              <span>SQL Learner</span>
            </div>
            <Button variant="outline" onClick={() => navigate('/login')}>
              Sign Out
            </Button>
          </motion.div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover-lift">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Progress</CardTitle>
                <Trophy className="w-4 h-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Math.round(completionPercentage)}%</div>
                <Progress value={completionPercentage} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  {progress.completedLessons.length} of {lessons.length} lessons completed
                </p>
              </CardContent>
            </Card>

            <Card className="hover-lift">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Score</CardTitle>
                <Star className="w-4 h-4 text-warning" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{progress.totalScore}</div>
                <p className="text-xs text-muted-foreground">
                  Average score across all lessons
                </p>
              </CardContent>
            </Card>

            <Card className="hover-lift">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Time Saved</CardTitle>
                <Clock className="w-4 h-4 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2.5h</div>
                <p className="text-xs text-muted-foreground">
                  Estimated learning time saved
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Lessons Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Available Lessons</h2>
              <p className="text-muted-foreground">Continue your SQL learning journey</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">View Options:</span>
              <Select value={gridLayout} onValueChange={setGridLayout}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grid-4">
                    <div className="flex items-center gap-2">
                      <Grid2X2 className="w-4 h-4" />
                      4-Grid View
                    </div>
                  </SelectItem>
                  <SelectItem value="grid-6">
                    <div className="flex items-center gap-2">
                      <Grid3X3 className="w-4 h-4" />
                      6-Grid View
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className={`grid grid-cols-1 md:grid-cols-2 ${getGridCols(gridLayout)} gap-6`}>
            {lessons.map((lesson, index) => {
              const isCompleted = progress.completedLessons.includes(lesson.id);
              
              return (
                <motion.div
                  key={lesson.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="lesson-card h-full cursor-pointer group relative overflow-hidden"
                        onClick={() => navigate(`/lessons/${lesson.id}`)}>
                    {isCompleted && (
                      <div className="absolute top-3 right-3 w-6 h-6 bg-success rounded-full flex items-center justify-center">
                        <Trophy className="w-3 h-3 text-white" />
                      </div>
                    )}
                    
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <CardTitle className="text-lg group-hover:text-primary transition-colors">
                            {lesson.title}
                          </CardTitle>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={getDifficultyColor(lesson.difficulty)}>
                              {lesson.difficulty}
                            </Badge>
                            <Badge variant="secondary">
                              {lesson.category}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <CardDescription className="text-sm leading-relaxed">
                        {lesson.description}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{lesson.estimatedTime} min</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Code className="w-3 h-3" />
                          <span>Hands-on</span>
                        </div>
                      </div>
                      
                      <Button 
                        variant="outline" 
                        className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-200"
                      >
                        {isCompleted ? 'Review Lesson' : 'Start Lesson'}
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Quick Start Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12"
        >
          <Card className="bg-gradient-secondary border-border">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Ready to level up your SQL skills?</h3>
                  <p className="text-muted-foreground">
                    Start with the fundamentals and work your way up to advanced concepts
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                    <Zap className="w-4 h-4 text-primary" />
                    <span>Interactive Learning</span>
                  </div>
                  <Button 
                    onClick={() => navigate('/lessons/1')}
                    className="bg-gradient-primary hover:opacity-90"
                  >
                    Start Learning
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;