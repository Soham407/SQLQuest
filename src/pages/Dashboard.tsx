import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Database, User, Trophy, Clock, Star, ArrowRight, Code, Zap, Grid3X3, Grid2X2, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { getLessons, getUserProgress, type Lesson, logout } from '@/lib/api';
import AnimatedList from '@/components/AnimatedList';
import { useAuth } from '@/lib/useAuth';


const Dashboard = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [groupedLessons, setGroupedLessons] = useState<Record<string, Lesson[]>>({});
  const [progress, setProgress] = useState({ completedLessons: [], totalScore: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gridLayout, setGridLayout] = useState('list');
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  useEffect(() => {
    const loadData = async () => {
      try {
        setError(null);
        const [lessonsData, progressData] = await Promise.all([
          getLessons(),
          getUserProgress()
        ]);
        setLessons(lessonsData);
        setProgress(progressData);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
        setError('Failed to load lessons. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Group lessons by category
  useEffect(() => {
    if (lessons.length > 0) {
      const grouped = lessons.reduce((acc, lesson) => {
        const category = lesson.category || 'Uncategorized';
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(lesson);
        return acc;
      }, {} as Record<string, Lesson[]>);
      
      setGroupedLessons(grouped);
    }
  }, [lessons]);

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
      case 'list': return 'grid-cols-1';
      default: return 'lg:grid-cols-3';
    }
  };

  const completionPercentage = (progress.completedLessons.length / lessons.length) * 100;

  const SkeletonCard = () => (
    <Card className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border-border/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-5 w-32 bg-muted animate-pulse rounded" />
            <div className="h-4 w-24 bg-muted/60 animate-pulse rounded" />
          </div>
          <div className="h-6 w-16 bg-muted animate-pulse rounded-full" />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="h-3 w-full bg-muted/80 animate-pulse rounded" />
          <div className="h-3 w-4/5 bg-muted/60 animate-pulse rounded" />
          <div className="h-3 w-3/4 bg-muted/40 animate-pulse rounded" />
        </div>
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/30">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 bg-muted animate-pulse rounded" />
            <div className="h-3 w-12 bg-muted animate-pulse rounded" />
          </div>
          <div className="h-8 w-20 bg-muted animate-pulse rounded" />
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="container mx-auto max-w-7xl">
          {/* Header Skeleton */}
          <header className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center animate-pulse">
                  <Database className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="h-7 w-48 bg-muted animate-pulse rounded mb-2" />
                  <div className="h-4 w-64 bg-muted/60 animate-pulse rounded" />
                </div>
              </div>
              <div className="w-10 h-10 bg-muted animate-pulse rounded-full" />
            </div>
          </header>

          {/* Stats Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="border-border/50">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-muted animate-pulse rounded-lg" />
                    <div>
                      <div className="h-4 w-20 bg-muted animate-pulse rounded mb-1" />
                      <div className="h-6 w-16 bg-muted animate-pulse rounded" />
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>

          {/* Lessons Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="h-8 w-48 bg-muted animate-pulse rounded mb-2" />
                <div className="h-4 w-64 bg-muted/60 animate-pulse rounded" />
              </div>
              <div className="h-10 w-32 bg-muted animate-pulse rounded" />
            </div>

            <div className={`grid grid-cols-1 md:grid-cols-2 ${getGridCols(gridLayout)} gap-6`}>
              {[...Array(6)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          </div>
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
            <Button variant="outline" onClick={() => navigate('/profile')}>
              Profile
            </Button>
            <Button variant="outline" onClick={async () => {
              await logout();
              await refreshUser();
              navigate('/login');
            }}>
              Sign Out
            </Button>
          </motion.div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
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
              <h2 className="text-2xl font-bold">Learning Paths</h2>
              <p className="text-muted-foreground">Organized by category for structured learning</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">View Options:</span>
              <Select value={gridLayout} onValueChange={setGridLayout}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="list">
                    <div className="flex items-center gap-2">
                      <List className="w-4 h-4" />
                      List View
                    </div>
                  </SelectItem>
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

          {error ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-red-600 dark:text-red-400 text-2xl">⚠️</span>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-red-600 dark:text-red-400">Error Loading Lessons</h3>
                <p className="text-muted-foreground mb-4">{error}</p>
                <Button onClick={() => window.location.reload()}>Try Again</Button>
              </div>
            </div>
          ) : lessons.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-muted-foreground text-2xl">📚</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">No Lessons Available</h3>
                <p className="text-muted-foreground">Lessons will appear here once they're added to the system.</p>
              </div>
            </div>
          ) : Object.keys(groupedLessons).length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-muted-foreground text-2xl">📚</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">No Learning Paths Available</h3>
                <p className="text-muted-foreground">Learning paths will appear here once lessons are organized by category.</p>
              </div>
            </div>
          ) : (
            <Accordion type="multiple" className="space-y-4">
              {Object.keys(groupedLessons).map((category, categoryIndex) => {
                const categoryLessons = groupedLessons[category];
                const completedInCategory = categoryLessons.filter(lesson => 
                  progress.completedLessons.includes(lesson.id)
                ).length;
                
                return (
                  <AccordionItem 
                    key={category} 
                    value={category}
                    className="border border-border/50 rounded-lg bg-card/50 backdrop-blur-sm"
                  >
                    <AccordionTrigger className="px-6 py-4 hover:no-underline">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-semibold">{category}</h3>
                          <Badge variant="secondary" className="text-xs">
                            {completedInCategory}/{categoryLessons.length} completed
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{categoryLessons.length} lessons</span>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6">
                      {gridLayout === 'list' ? (
                        <AnimatedList
                          items={categoryLessons.map(lesson => ({
                            ...lesson,
                            isCompleted: progress.completedLessons.includes(lesson.id),
                            isLocked: false
                          }))}
                          onItemSelect={(lesson, index) => {
                            console.log('Selected lesson:', lesson, 'at index:', index);
                            navigate(`/lessons/${lesson.id}`);
                          }}
                          showGradients={true}
                          enableArrowNavigation={true}
                          displayScrollbar={true}
                          maxHeight="24rem"
                        />
                      ) : (
                        <div className={`grid grid-cols-1 md:grid-cols-2 ${getGridCols(gridLayout)} gap-4 mt-4`}>
                          {categoryLessons.map((lesson, index) => {
                            const isCompleted = progress.completedLessons.includes(lesson.id);
                            
                            return (
                              <motion.div
                                key={lesson.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ 
                                  scale: 1.02,
                                  transition: { duration: 0.2 }
                                }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <Card className="lesson-card h-full cursor-pointer group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 border-border/50 backdrop-blur-sm"
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
                      )}
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          )}
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