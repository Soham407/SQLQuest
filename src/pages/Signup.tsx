import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Database, Zap, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { signup, login } from '@/lib/api';
import { Progress } from '@/components/ui/progress';
const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [strength, setStrength] = useState(0);
  const [strengthLabel, setStrengthLabel] = useState<'Weak' | 'Medium' | 'Strong' | ''>('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const evaluateStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;
    const percent = Math.min(100, score / 4 * 100);
    setStrength(percent);
    if (!pwd) setStrengthLabel('');else if (percent < 40) setStrengthLabel('Weak');else if (percent < 80) setStrengthLabel('Medium');else setStrengthLabel('Strong');
  };
  const onPasswordChange = (value: string) => {
    setPassword(value);
    evaluateStrength(value);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      toast({
        title: 'Password mismatch',
        description: 'Passwords do not match. Please check and try again.',
        variant: 'destructive'
      });
      return;
    }
    setIsLoading(true);
    try {
      // 1. Create the account
      await signup(email, password, name);
      // 2. Log the new user in
      await login(email, password);
      toast({
        title: 'Welcome to SQL Fiddle!',
        description: 'Your account has been created and you are now logged in.'
      });
      navigate('/dashboard');
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : 'An error occurred. Please try again.';
      toast({
        title: 'Signup failed',
        description: errMsg,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding */}
        <motion.div initial={{
        opacity: 0,
        x: -50
      }} animate={{
        opacity: 1,
        x: 0
      }} transition={{
        duration: 0.6
      }} className="hidden lg:block space-y-8">
          <div className="space-y-6">
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.2,
            duration: 0.6
          }} className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                <Database className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gradient">SQL Quest Interactive</h1>
                <p className="text-muted-foreground">Master SQL through interactive learning</p>
              </div>
            </motion.div>

            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.4,
            duration: 0.6
          }} className="space-y-4">
              <div className="flex items-center gap-3 text-foreground">
                <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Code className="w-4 h-4 text-primary" />
                </div>
                <span>Interactive SQL editor with real-time feedback</span>
              </div>
              <div className="flex items-center gap-3 text-foreground">
                <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-primary" />
                </div>
                <span>Progressive lessons from beginner to advanced</span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Right side - Signup form */}
        <motion.div initial={{
        opacity: 0,
        x: 50
      }} animate={{
        opacity: 1,
        x: 0
      }} transition={{
        duration: 0.6
      }} className="w-full max-w-md mx-auto">
          <Card className="shadow-xl border-border bg-card/80 backdrop-blur-sm">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">Create your account</CardTitle>
              <CardDescription className="text-center">
                Sign up to start your SQL learning journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" type="text" placeholder="Enter your name" value={name} onChange={e => setName(e.target.value)} required className="transition-all duration-200 focus:ring-2 focus:ring-primary/20" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} required className="transition-all duration-200 focus:ring-2 focus:ring-primary/20" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" placeholder="Enter your password" value={password} onChange={e => onPasswordChange(e.target.value)} required className="transition-all duration-200 focus:ring-2 focus:ring-primary/20" />
                  
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input id="confirmPassword" type="password" placeholder="Confirm your password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="transition-all duration-200 focus:ring-2 focus:ring-primary/20" />
                </div>
                <Button type="submit" className="w-full bg-gradient-primary hover:opacity-90 transition-all duration-200 font-semibold" disabled={isLoading}>
                  {isLoading ? 'Signing up...' : 'Sign up'}
                </Button>
              </form>
              <div className="mt-6 text-center text-sm text-muted-foreground">
                <p>
                  Already have an account?{' '}
                  <a href="/login" className="text-primary font-semibold hover:underline">Log in</a>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>;
};
export default Signup;