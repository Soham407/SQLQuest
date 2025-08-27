import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Database, User, Grid2X2, ArrowLeft, Mail, Calendar, Trophy, Award, Star, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { ChartContainer, ChartConfig, ChartTooltipContent } from '@/components/ui/chart';
import { useAuth } from '@/lib/useAuth';

const Profile = () => {
  const navigate = useNavigate();
  const { refreshUser, user } = useAuth();

  // Mock data for the progress chart
  const chartData = [
    { week: 'Week 1', lessons: 3 },
    { week: 'Week 2', lessons: 5 },
    { week: 'Week 3', lessons: 2 },
    { week: 'Week 4', lessons: 7 },
    { week: 'Week 5', lessons: 4 },
    { week: 'Week 6', lessons: 6 },
    { week: 'Week 7', lessons: 3 },
  ];

  // Chart configuration
  const chartConfig: ChartConfig = {
    lessons: {
      label: 'Lessons Completed',
      color: 'hsl(var(--primary))',
    },
  };

  // Mock user data
  const userData = {
    name: 'SQL Learner',
    email: 'learner@example.com',
    joinDate: 'January 2024',
    totalLessons: 30,
    completedLessons: 18,
    averageScore: 85,
    currentStreak: 7,
  };

  // Mock badges data
  const badges = [
    { id: 1, name: 'First Steps', description: 'Complete your first lesson', icon: Star, earned: true, color: 'bg-yellow-500' },
    { id: 2, name: 'Week Warrior', description: 'Complete 5 lessons in a week', icon: Trophy, earned: true, color: 'bg-blue-500' },
    { id: 3, name: 'Perfect Score', description: 'Get 100% on any lesson', icon: Award, earned: false, color: 'bg-purple-500' },
    { id: 4, name: 'Streak Master', description: 'Maintain a 10-day streak', icon: Target, earned: false, color: 'bg-green-500' },
    { id: 5, name: 'SQL Expert', description: 'Complete all advanced lessons', icon: Database, earned: false, color: 'bg-red-500' },
    { id: 6, name: 'Quick Learner', description: 'Complete 3 lessons in one day', icon: Star, earned: false, color: 'bg-indigo-500' },
  ];

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
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="mr-2"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
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
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </Button>
          </motion.div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          {/* <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Your Profile</h2>
            <p className="text-muted-foreground">Track your learning progress and achievements</p>
          </div> */}
        </motion.div>

        {/* User Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-6">
                <Avatar className="w-20 h-20">
                  <AvatarImage src="/placeholder-avatar.jpg" />
                  <AvatarFallback className="text-lg font-semibold">
                    {userData.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="w-4 h-4" />
                        <span>Name</span>
                      </div>
                      <p className="font-medium">{userData.name}</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="w-4 h-4" />
                        <span>Email</span>
                      </div>
                      <p className="font-medium">{userData.email}</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>Member Since</span>
                      </div>
                      <p className="font-medium">{userData.joinDate}</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Trophy className="w-4 h-4" />
                        <span>Current Streak</span>
                      </div>
                      <p className="font-medium">{userData.currentStreak} days</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover-lift">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Progress</CardTitle>
                <Trophy className="w-4 h-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round((userData.completedLessons / userData.totalLessons) * 100)}%
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {userData.completedLessons} of {userData.totalLessons} lessons completed
                </p>
              </CardContent>
            </Card>

            <Card className="hover-lift">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                <Star className="w-4 h-4 text-warning" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userData.averageScore}%</div>
                <p className="text-xs text-muted-foreground">
                  Across all completed lessons
                </p>
              </CardContent>
            </Card>

            <Card className="hover-lift">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Learning Streak</CardTitle>
                <Target className="w-4 h-4 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userData.currentStreak}</div>
                <p className="text-xs text-muted-foreground">
                  Days of continuous learning
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Badges Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Achievements & Badges
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Earn badges by completing challenges and reaching milestones
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {badges.map((badge) => {
                  const IconComponent = badge.icon;
                  return (
                    <div
                      key={badge.id}
                      className={`relative group cursor-pointer transition-all duration-300 ${
                        badge.earned ? 'opacity-100' : 'opacity-40'
                      }`}
                    >
                      <div className="flex flex-col items-center text-center space-y-2 p-4 rounded-lg border border-border/50 hover:border-primary/50 transition-colors">
                        <div className={`w-12 h-12 rounded-full ${badge.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">{badge.name}</p>
                          <p className="text-xs text-muted-foreground">{badge.description}</p>
                        </div>
                        {badge.earned && (
                          <Badge variant="secondary" className="text-xs">
                            Earned
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Weekly Activity Report */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card className="hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">Weekly Activity Report</CardTitle>
              <Grid2X2 className="w-5 h-5 text-primary" />
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig}>
                <BarChart data={chartData}>
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke="hsl(var(--border) / 0.3)" 
                  />
                  <XAxis 
                    dataKey="week" 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12}
                  />
                  <Bar 
                    dataKey="lessons" 
                    fill="hsl(var(--primary))" 
                    radius={[4, 4, 0, 0]}
                  />
                  <ChartTooltipContent />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
