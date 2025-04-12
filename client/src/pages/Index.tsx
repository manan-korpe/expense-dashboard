import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion, useTransform, useMotionValue } from 'framer-motion';
import { CreditCard, PieChart, BarChart4, User, Smartphone, Camera } from 'lucide-react';
import { useMousePosition } from '@/hooks/useMousePosition';

const Index = () => {
  const navigate = useNavigate();
  const mousePosition = useMousePosition();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Motion values for parallel animations
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Update motion values based on mouse position for performance
  React.useEffect(() => {
    if (containerRef.current) {
      const { left, top, width, height } = containerRef.current.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      
      mouseX.set((mousePosition.x - centerX) / 25);
      mouseY.set((mousePosition.y - centerY) / 25);
    }
  }, [mousePosition, mouseX, mouseY]);

  // Create transforms for different elements
  const heroImageRotateX = useTransform(mouseY, [-50, 50], [5, -5]);
  const heroImageRotateY = useTransform(mouseX, [-50, 50], [-5, 5]);
  const heroImageZ = useTransform(mouseX, [-50, 50], [0, 20]);
  
  const cardFloatX = useTransform(mouseX, [-50, 50], [-10, 10]);
  const cardFloatY = useTransform(mouseY, [-50, 50], [-10, 10]);
  
  const iconFloat = useTransform(mouseY, [-50, 50], [0, 10]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pocket-softPurple via-white to-pocket-softPurple overflow-hidden" ref={containerRef}>
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ 
              rotate: 360,
              boxShadow: ["0px 0px 0px rgba(155, 135, 245, 0)", "0px 0px 20px rgba(155, 135, 245, 0.7)", "0px 0px 0px rgba(155, 135, 245, 0)"]
            }}
            transition={{ 
              rotate: { duration: 6, repeat: Infinity, ease: "linear" },
              boxShadow: { duration: 2, repeat: Infinity, repeatType: "reverse" }
            }}
            className="w-10 h-10 bg-pocket-purple rounded-full flex items-center justify-center"
            style={{
              transformStyle: "preserve-3d",
              perspective: "1000px"
            }}
          >
            <span className="text-white font-bold text-lg">P+</span>
          </motion.div>
          <motion.h1 
            className="text-2xl font-bold bg-gradient-to-r from-pocket-purple to-pocket-vivid bg-clip-text text-transparent"
            whileHover={{ 
              scale: 1.05,
              textShadow: "0px 0px 8px rgba(155, 135, 245, 0.5)"
            }}
          >
            Pocket Plus
          </motion.h1>
        </div>
        <nav>
          <ul className="flex space-x-2">
            <li>
              <Button 
                variant="ghost" 
                onClick={() => navigate('/login')}
                className="relative overflow-hidden group"
              >
                <span className="relative z-10">Login</span>
                <motion.div 
                  className="absolute inset-0 bg-pocket-purple opacity-0 group-hover:opacity-10 rounded-md"
                  initial={{ scale: 0 }}
                  whileHover={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                />
              </Button>
            </li>
            <li>
              <Button 
                onClick={() => navigate('/register')} 
                className="bg-pocket-purple hover:bg-pocket-vivid relative overflow-hidden group"
              >
                <span className="relative z-10">Sign Up</span>
                <motion.div 
                  className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-md"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ type: "spring", stiffness: 100, damping: 10 }}
                />
              </Button>
            </li>
          </ul>
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <motion.h2 
                  className="text-4xl md:text-5xl font-bold mb-6 leading-tight"
                  style={{ 
                    textShadow: "0px 2px 4px rgba(0,0,0,0.1)",
                    transformStyle: "preserve-3d"
                  }}
                  whileHover={{ 
                    scale: 1.02, 
                    transition: { duration: 0.2 } 
                  }}
                >
                  Take Control of Your <span className="bg-gradient-to-r from-pocket-purple to-pocket-vivid bg-clip-text text-transparent">Finances</span>
                </motion.h2>
                <motion.p 
                  className="text-lg mb-8 text-gray-700 max-w-lg"
                  style={{ 
                    transformStyle: "preserve-3d",
                    transform: "translateZ(10px)"
                  }}
                >
                  Track expenses, scan bills, and visualize your spending patterns with our powerful yet simple expense management app.
                </motion.p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{ 
                      transformStyle: "preserve-3d",
                      perspective: "1000px",
                      z: 20
                    }}
                  >
                    <Button 
                      onClick={() => navigate('/register')} 
                      size="lg"
                      className="bg-pocket-purple hover:bg-pocket-vivid shadow-lg"
                    >
                      Get Started - It's Free
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <Button 
                      variant="outline" 
                      size="lg"
                      onClick={() => navigate('/login')}
                      className="shadow-sm"
                    >
                      Sign In
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            </div>
            
            <div className="md:w-1/2 relative perspective-2000">
              <motion.div
                initial={{ opacity: 0, rotateY: -20 }}
                animate={{ opacity: 1, rotateY: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="relative"
                style={{ 
                  perspective: "1000px",
                  transformStyle: "preserve-3d",
                  rotateX: heroImageRotateX,
                  rotateY: heroImageRotateY,
                  z: heroImageZ
                }}
              >
                <div className="w-full max-w-md mx-auto">
                  <motion.div
                    className="bg-white shadow-3d rounded-2xl overflow-hidden border border-gray-100"
                    whileHover={{ translateY: -10, rotateY: 5 }}
                    style={{ 
                      transformStyle: "preserve-3d",
                      x: cardFloatX,
                      y: cardFloatY
                    }}
                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                  >
                    <div className="p-4 bg-pocket-purple text-white">
                      <h3 className="text-xl font-bold">Monthly Overview</h3>
                    </div>
                    <div className="p-6">
                      <div className="space-y-4">
                        <motion.div 
                          className="flex justify-between items-center"
                          whileHover={{ scale: 1.02, x: 5 }}
                          style={{ transformStyle: "preserve-3d" }}
                        >
                          <span className="font-medium">Total Income</span>
                          <span className="font-bold text-green-600">$4,520.00</span>
                        </motion.div>
                        <motion.div 
                          className="flex justify-between items-center"
                          whileHover={{ scale: 1.02, x: 5 }}
                          style={{ transformStyle: "preserve-3d" }}
                        >
                          <span className="font-medium">Total Expenses</span>
                          <span className="font-bold text-red-500">$2,185.30</span>
                        </motion.div>
                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                          <motion.div 
                            className="h-full bg-pocket-purple rounded-full" 
                            style={{ width: '65%' }}
                            whileHover={{ 
                              boxShadow: "0px 0px 8px rgba(155, 135, 245, 0.7)",
                              scale: 1.01
                            }}
                          ></motion.div>
                        </div>
                        <motion.div 
                          className="flex justify-between items-center"
                          whileHover={{ scale: 1.02, x: 5 }}
                          style={{ transformStyle: "preserve-3d" }}
                        >
                          <span className="font-medium">Savings</span>
                          <span className="font-bold text-pocket-purple">$2,334.70</span>
                        </motion.div>
                      </div>
                      
                      <div className="mt-8">
                        <h4 className="font-bold mb-4">Recent Transactions</h4>
                        <div className="space-y-3">
                          {[
                            { title: 'Grocery Store', amount: '-$86.45', date: 'Apr 10' },
                            { title: 'Monthly Salary', amount: '+$4,520.00', date: 'Apr 1' },
                            { title: 'Coffee Shop', amount: '-$4.50', date: 'Apr 8' },
                          ].map((item, index) => (
                            <motion.div 
                              key={index} 
                              className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                              initial={{ opacity: 0.9 }}
                              whileHover={{ 
                                scale: 1.03, 
                                translateZ: 20, 
                                boxShadow: "0px 4px 15px rgba(0,0,0,0.1)" 
                              }}
                              style={{ 
                                transformStyle: "preserve-3d",
                                transition: "all 0.2s ease-out"
                              }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <div>
                                <div className="font-medium">{item.title}</div>
                                <div className="text-xs text-gray-500">{item.date}</div>
                              </div>
                              <div className={item.amount.startsWith('+') ? 'text-green-600' : 'text-red-500'}>
                                {item.amount}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
                
                <motion.div
                  className="absolute -top-6 -right-6 bg-white shadow-lg rounded-full p-3 border border-gray-100"
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 5, 0],
                    boxShadow: ["0px 4px 10px rgba(0,0,0,0.1)", "0px 10px 25px rgba(0,0,0,0.2)", "0px 4px 10px rgba(0,0,0,0.1)"]
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity,
                    repeatType: "reverse" 
                  }}
                  style={{ 
                    transformStyle: "preserve-3d",
                    y: useTransform(mouseY, [-300, 300], [-5, 5]),
                    x: useTransform(mouseX, [-300, 300], [-5, 5])
                  }}
                >
                  <Camera className="h-8 w-8 text-pocket-purple" />
                </motion.div>
                
                <motion.div
                  className="absolute -bottom-4 -left-4 bg-white shadow-lg rounded-full p-3 border border-gray-100"
                  animate={{ 
                    y: [0, 10, 0],
                    rotate: [0, -5, 0],
                    boxShadow: ["0px 4px 10px rgba(0,0,0,0.1)", "0px 10px 25px rgba(0,0,0,0.2)", "0px 4px 10px rgba(0,0,0,0.1)"]
                  }}
                  transition={{ 
                    duration: 5, 
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: 1 
                  }}
                  style={{ 
                    transformStyle: "preserve-3d",
                    y: useTransform(mouseY, [-300, 300], [5, -5]),
                    x: useTransform(mouseX, [-300, 300], [5, -5])
                  }}
                >
                  <BarChart4 className="h-8 w-8 text-pocket-orange" />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Everything you need to manage your personal finances in one place
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: CreditCard,
                  title: 'Transaction Tracking',
                  description: 'Log and categorize your expenses and income to keep track of where your money goes.'
                },
                {
                  icon: Camera,
                  title: 'Bill Scanning',
                  description: 'Simply take a photo of your receipt or bill, and we\'ll automatically add it as a transaction.'
                },
                {
                  icon: PieChart,
                  title: 'Budget Management',
                  description: 'Set budgets for different categories and get alerts when you\'re close to your limits.'
                },
                {
                  icon: BarChart4,
                  title: 'Visual Reports',
                  description: 'See your spending patterns with beautiful, interactive charts and graphs.'
                },
                {
                  icon: Smartphone,
                  title: 'Mobile Friendly',
                  description: 'Access your financial data from any device with our fully responsive design.'
                },
                {
                  icon: User,
                  title: 'Secure & Private',
                  description: 'Your financial data is encrypted and never shared with third parties.'
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-3d transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{
                    y: -10,
                    transition: { 
                      type: "spring", 
                      stiffness: 300, 
                      damping: 15 
                    }
                  }}
                  style={{
                    transformStyle: "preserve-3d",
                    perspective: "1000px",
                    rotateX: useTransform(mouseY, [-300, 300], [2, -2]),
                    rotateY: useTransform(mouseX, [-300, 300], [-2, 2]) 
                  }}
                  transition={{ 
                    opacity: { duration: 0.5, delay: index * 0.1 },
                    y: { duration: 0.5, delay: index * 0.1 }
                  }}
                  viewport={{ once: true }}
                >
                  <motion.div 
                    className="bg-pocket-softPurple p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4"
                    style={{ 
                      transformStyle: "preserve-3d",
                      y: iconFloat
                    }}
                    whileHover={{ 
                      scale: 1.1,
                      boxShadow: "0px 5px 15px rgba(155, 135, 245, 0.5)"
                    }}
                  >
                    <feature.icon className="h-6 w-6 text-pocket-purple" />
                  </motion.div>
                  <motion.h3 
                    className="text-xl font-bold mb-2"
                    style={{ transformStyle: "preserve-3d", translateZ: 10 }}
                  >
                    {feature.title}
                  </motion.h3>
                  <motion.p 
                    className="text-gray-600"
                    style={{ transformStyle: "preserve-3d", translateZ: 5 }}
                  >
                    {feature.description}
                  </motion.p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-gradient-to-r from-pocket-purple to-pocket-vivid text-white">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <motion.h2 
                className="text-3xl font-bold mb-4"
                whileHover={{ 
                  textShadow: "0px 0px 10px rgba(255,255,255,0.5)"
                }}
              >
                Ready to Take Control of Your Finances?
              </motion.h2>
              <motion.p 
                className="text-xl mb-8 max-w-2xl mx-auto"
                style={{ transformStyle: "preserve-3d" }}
              >
                Join thousands of users who are managing their expenses and achieving their financial goals with Pocket Plus.
              </motion.p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ 
                  display: "inline-block",
                  transformStyle: "preserve-3d" 
                }}
              >
                <Button 
                  onClick={() => navigate('/register')} 
                  size="lg"
                  className="bg-white text-pocket-purple hover:bg-gray-100 relative overflow-hidden"
                >
                  <motion.span 
                    className="relative z-10"
                    whileHover={{ letterSpacing: "0.05em" }}
                  >
                    Get Started Now
                  </motion.span>
                  <motion.div 
                    className="absolute inset-0 bg-pocket-purple opacity-0"
                    initial={{ scale: 0 }}
                    whileHover={{ scale: 5, opacity: 0.1 }}
                    transition={{ duration: 0.4 }}
                    style={{ borderRadius: "50%" }}
                  />
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-pocket-purple rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">P+</span>
                </div>
                <h3 className="text-xl font-bold">Pocket Plus</h3>
              </div>
              <p className="text-gray-400 max-w-xs">
                The smart way to track expenses and manage your personal finances.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h4 className="text-lg font-semibold mb-4">Product</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white">Features</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Pricing</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">FAQ</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-4">Company</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white">About</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Blog</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Careers</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-4">Legal</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white">Privacy</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Terms</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Cookie Policy</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Pocket Plus. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
