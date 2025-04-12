
import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { motion, useTransform, useMotionValue } from 'framer-motion';
import { useMousePosition } from '@/hooks/useMousePosition';

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const cardRef = useRef<HTMLDivElement>(null);
  const mousePosition = useMousePosition();
  
  // Motion values for 3D effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  React.useEffect(() => {
    if (cardRef.current) {
      const { left, top, width, height } = cardRef.current.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      
      mouseX.set((mousePosition.x - centerX) / 25);
      mouseY.set((mousePosition.y - centerY) / 25);
    }
  }, [mousePosition, mouseX, mouseY]);

  // Create transforms for 3D effect
  const rotateX = useTransform(mouseY, [-20, 20], [5, -5]);
  const rotateY = useTransform(mouseX, [-20, 20], [-5, 5]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pocket-purple to-pocket-vivid p-4">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute left-1/4 top-1/4 w-96 h-96 bg-pocket-softPurple rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"
          animate={{ 
            y: [0, -20, 0],
            scale: [1, 1.05, 1],
            opacity: [0.7, 0.5, 0.7]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          style={{
            x: useTransform(mouseX, [-20, 20], [-10, 10]),
            y: useTransform(mouseY, [-20, 20], [-10, 10])
          }}
        ></motion.div>
        <motion.div 
          className="absolute right-1/4 bottom-1/4 w-96 h-96 bg-pocket-orange rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float animation-delay-1000"
          animate={{ 
            y: [0, 20, 0],
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.2, 0.3]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 1
          }}
          style={{
            x: useTransform(mouseX, [-20, 20], [10, -10]),
            y: useTransform(mouseY, [-20, 20], [10, -10])
          }}
        ></motion.div>
      </div>

      <motion.div 
        className="max-w-md w-full perspective-1000"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        ref={cardRef}
      >
        <motion.div
          className="relative"
          style={{
            perspective: 1200,
            transformStyle: "preserve-3d",
            rotateX,
            rotateY
          }}
        >
          <Card className="border-0 shadow-3d bg-white/90 backdrop-blur-md">
            <CardHeader className="pb-2">
              <div className="flex justify-center mb-4">
                <motion.div
                  className="w-16 h-16 bg-pocket-purple rounded-full flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ 
                    scale: 1, 
                    rotate: 360,
                    boxShadow: ["0px 0px 0px rgba(155, 135, 245, 0)", "0px 0px 20px rgba(155, 135, 245, 0.7)", "0px 0px 0px rgba(155, 135, 245, 0)"]
                  }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 260, 
                    damping: 20,
                    boxShadow: { duration: 2, repeat: Infinity, repeatType: "reverse" }
                  }}
                  style={{
                    z: 30,
                    translateZ: 50
                  }}
                >
                  <span className="text-white text-2xl font-bold">P+</span>
                </motion.div>
              </div>
              <motion.div
                style={{
                  transformStyle: "preserve-3d",
                  translateZ: 30
                }}
              >
                <CardTitle className="text-2xl text-center bg-gradient-to-r from-pocket-purple to-pocket-vivid bg-clip-text text-transparent">
                  Welcome Back
                </CardTitle>
                <CardDescription className="text-center">
                  Sign in to your Pocket Plus account
                </CardDescription>
              </motion.div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <motion.div 
                  className="space-y-2"
                  whileHover={{ scale: 1.02 }}
                  style={{
                    transformStyle: "preserve-3d",
                    translateZ: 10
                  }}
                >
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-white/50"
                  />
                </motion.div>
                <motion.div 
                  className="space-y-2"
                  whileHover={{ scale: 1.02 }}
                  style={{
                    transformStyle: "preserve-3d",
                    translateZ: 10
                  }}
                >
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link to="#" className="text-xs text-pocket-purple hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-white/50"
                  />
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    transformStyle: "preserve-3d",
                    translateZ: 20
                  }}
                >
                  <Button
                    type="submit"
                    className="w-full bg-pocket-purple hover:bg-pocket-vivid transition-all"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </motion.div>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col">
              <motion.div 
                className="text-sm text-center"
                whileHover={{ scale: 1.05 }}
                style={{
                  transformStyle: "preserve-3d"
                }}
              >
                Don't have an account?{' '}
                <Link to="/register" className="text-pocket-purple hover:underline font-medium">
                  Sign up
                </Link>
              </motion.div>
            </CardFooter>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
