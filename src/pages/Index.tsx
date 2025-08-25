import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Database, Play, BookOpen, Users, Star, ArrowRight, Code, Zap, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import TrueFocus from '@/components/TrueFocus';

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Code className="w-6 h-6" />,
      title: "Interactive SQL Editor",
      description: "Write and execute SQL queries in real-time with syntax highlighting and auto-completion"
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Progressive Learning",
      description: "Start with basics and advance to complex queries through structured lessons"
    },
    {
      icon: <Play className="w-6 h-6" />,
      title: "Hands-on Practice",
      description: "Learn by doing with immediate feedback on your SQL queries"
    },
    {
      icon: <Trophy className="w-6 h-6" />,
      title: "Track Progress",
      description: "Monitor your learning journey with detailed progress tracking and achievements"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-8 max-w-4xl mx-auto"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-glow"
            >
              <Database className="w-8 h-8 text-white" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <TrueFocus 
                sentence="SQL Quest Interactive"
                manualMode={false}
                blurAmount={3}
                borderColor="hsl(var(--primary))"
                animationDuration={1.5}
                pauseBetweenAnimations={2}
              />
            </motion.div>
          </div>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            Master SQL through interactive lessons, real-time feedback, and hands-on practice. 
            Start your journey from beginner to SQL expert today.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              onClick={() => navigate('/login')}
              className="bg-gradient-primary hover:opacity-90 text-lg px-8 py-3 h-auto font-semibold"
            >
              Start Learning
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard')}
              className="text-lg px-8 py-3 h-auto font-semibold border-border hover:bg-accent"
            >
              View Demo
              <Play className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex flex-wrap justify-center gap-8 pt-8 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              <span>10k+ learners</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-warning" />
              <span>4.9/5 rating</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-success" />
              <span>50+ lessons</span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose SQL Quest Interactive?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Learn SQL the modern way with our interactive platform designed for all skill levels
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <Card className="h-full hover-lift text-center">
                <CardContent className="pt-8">
                  <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <div className="text-primary">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="bg-gradient-secondary border-border max-w-4xl mx-auto">
            <CardContent className="p-12 text-center">
              <div className="space-y-6">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Zap className="w-6 h-6 text-primary" />
                  <h3 className="text-2xl md:text-3xl font-bold">Ready to Master SQL?</h3>
                </div>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Join thousands of developers who have improved their SQL skills with our interactive platform. 
                  Start your journey today!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                  <Button
                    onClick={() => navigate('/login')}
                    className="bg-gradient-primary hover:opacity-90 text-lg px-8 py-3 h-auto font-semibold"
                  >
                    Get Started Free
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate('/dashboard')}
                    className="text-lg px-8 py-3 h-auto font-semibold"
                  >
                    Try Demo
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>
    </div>
  );
};

export default Index;
