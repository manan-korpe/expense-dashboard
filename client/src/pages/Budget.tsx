
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Progress } from '@/components/ui/progress';
import { Edit, Plus, Trash2 } from 'lucide-react';
import { useData, Budget, Category, Transaction } from '@/contexts/DataContext';
import { motion } from 'framer-motion';

type BudgetProgressProps = {
  category: Category;
  budgetAmount: number;
  currentSpent: number;
  period: 'monthly' | 'yearly';
};

const categoryIcons: Record<Category, React.ReactNode> = {
  housing: '🏠',
  food: '🍔',
  transportation: '🚗',
  utilities: '💡',
  healthcare: '⚕️',
  entertainment: '🎬',
  shopping: '🛍️',
  personal: '👤',
  education: '🎓',
  debt: '💳',
  savings: '💰',
  income: '💵',
  other: '📦'
};

const categoryColors: Record<Category, string> = {
  housing: '#8B5CF6',
  food: '#F59E0B',
  transportation: '#10B981',
  utilities: '#3B82F6',
  healthcare: '#EC4899',
  entertainment: '#6366F1',
  shopping: '#F97316',
  personal: '#8B5CF6',
  education: '#14B8A6',
  debt: '#F43F5E',
  savings: '#22C55E',
  income: '#22C55E',
  other: '#9CA3AF'
};

// Component to show the budget progress
const BudgetProgress = ({ category, budgetAmount, currentSpent, period }: BudgetProgressProps) => {
  const percentage = Math.min(Math.round((currentSpent / budgetAmount) * 100), 100);
  const remaining = budgetAmount - currentSpent;
  
  // Determine the progress bar color based on percentage
  let progressColor = 'bg-green-500';
  if (percentage >= 90) {
    progressColor = 'bg-red-500';
  } else if (percentage >= 75) {
    progressColor = 'bg-yellow-500';
  }
  
  return (
    <motion.div 
      className="card-3d rounded-lg p-4 bg-white shadow-sm border border-gray-100"
      whileHover={{ y: -5, boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.2)" }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: `${categoryColors[category]}20` }}>
            <span className="text-xl">{categoryIcons[category]}</span>
          </div>
          <div>
            <h3 className="font-medium">{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
            <p className="text-xs text-muted-foreground">{period === 'monthly' ? 'Monthly' : 'Yearly'} Budget</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-bold">
            ${currentSpent.toFixed(2)} <span className="text-muted-foreground">/ ${budgetAmount.toFixed(2)}</span>
          </p>
          <p className="text-xs text-muted-foreground">
            ${remaining > 0 ? remaining.toFixed(2) : '0.00'} remaining
          </p>
        </div>
      </div>
      
      <div className="space-y-1">
        <Progress value={percentage} className={progressColor} />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{percentage}% used</span>
          <span>{remaining > 0 ? `${100 - percentage}% left` : 'Exceeded'}</span>
        </div>
      </div>
    </motion.div>
  );
};

const BudgetPage = () => {
  const { budgets, transactions, addBudget, updateBudget, deleteBudget } = useData();
  const [isAddingBudget, setIsAddingBudget] = useState(false);
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [currentBudget, setCurrentBudget] = useState<Budget | null>(null);
  const [newBudget, setNewBudget] = useState<Partial<Omit<Budget, 'id'>>>({
    category: 'housing',
    amount: 0,
    period: 'monthly'
  });

  // Get current date
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  // Get first and last day of current month
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  
  // Filter transactions for current month
  const currentMonthTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    return transactionDate >= firstDayOfMonth && transactionDate <= lastDayOfMonth && t.type === 'expense';
  });
  
  // Calculate spending by category for current month
  const spendingByCategory = currentMonthTransactions.reduce((acc, transaction) => {
    const { category, amount } = transaction;
    acc[category] = (acc[category] || 0) + amount;
    return acc;
  }, {} as Record<Category, number>);
  
  // Calculate total budget and total spent
  const totalBudget = budgets.reduce((acc, budget) => acc + budget.amount, 0);
  const totalSpent = Object.values(spendingByCategory).reduce((acc, amount) => acc + amount, 0);
  const totalPercentage = Math.min(Math.round((totalSpent / totalBudget) * 100), 100);
  
  // Handle form submission for adding budget
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newBudget.category && newBudget.amount && newBudget.period) {
      addBudget({
        category: newBudget.category as Category,
        amount: Number(newBudget.amount),
        period: newBudget.period as 'monthly' | 'yearly'
      });
      
      // Reset form
      setNewBudget({
        category: 'housing',
        amount: 0,
        period: 'monthly'
      });
      setIsAddingBudget(false);
    }
  };
  
  // Handle form submission for editing budget
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentBudget && currentBudget.id) {
      updateBudget(currentBudget.id, {
        category: currentBudget.category,
        amount: Number(currentBudget.amount),
        period: currentBudget.period
      });
      
      setCurrentBudget(null);
      setIsEditingBudget(false);
    }
  };
  
  // Handle editing budget
  const handleEdit = (budget: Budget) => {
    setCurrentBudget(budget);
    setIsEditingBudget(true);
  };
  
  // Handle deleting budget
  const handleDelete = (id: string) => {
    deleteBudget(id);
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Budget</h1>
            <p className="text-muted-foreground">
              Manage your monthly spending limits
            </p>
          </div>
          
          <Dialog open={isAddingBudget} onOpenChange={setIsAddingBudget}>
            <DialogTrigger asChild>
              <Button className="bg-pocket-purple hover:bg-pocket-vivid">
                <Plus className="mr-2 h-4 w-4" /> Add Budget
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Budget</DialogTitle>
                <DialogDescription>
                  Set a spending limit for a specific category
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleAddSubmit}>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select 
                      value={newBudget.category} 
                      onValueChange={(value) => setNewBudget({...newBudget, category: value as Category})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(categoryIcons).filter(([category]) => category !== 'income').map(([category, icon]) => (
                          <SelectItem key={category} value={category}>
                            <span className="inline-flex items-center">
                              <span className="mr-2">{icon}</span> {category.charAt(0).toUpperCase() + category.slice(1)}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="amount">Budget Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      value={newBudget.amount || ''}
                      onChange={(e) => setNewBudget({...newBudget, amount: parseFloat(e.target.value)})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="period">Period</Label>
                    <Select 
                      value={newBudget.period} 
                      onValueChange={(value) => setNewBudget({...newBudget, period: value as 'monthly' | 'yearly'})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button type="submit" className="bg-pocket-purple hover:bg-pocket-vivid">Create Budget</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          
          <Dialog open={isEditingBudget} onOpenChange={setIsEditingBudget}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit Budget</DialogTitle>
                <DialogDescription>
                  Update the details of your budget
                </DialogDescription>
              </DialogHeader>
              
              {currentBudget && (
                <form onSubmit={handleEditSubmit}>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-category">Category</Label>
                      <Select 
                        value={currentBudget.category} 
                        onValueChange={(value) => setCurrentBudget({...currentBudget, category: value as Category})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(categoryIcons).filter(([category]) => category !== 'income').map(([category, icon]) => (
                            <SelectItem key={category} value={category}>
                              <span className="inline-flex items-center">
                                <span className="mr-2">{icon}</span> {category.charAt(0).toUpperCase() + category.slice(1)}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="edit-amount">Budget Amount</Label>
                      <Input
                        id="edit-amount"
                        type="number"
                        step="0.01"
                        value={currentBudget.amount || ''}
                        onChange={(e) => setCurrentBudget({...currentBudget, amount: parseFloat(e.target.value)})}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="edit-period">Period</Label>
                      <Select 
                        value={currentBudget.period} 
                        onValueChange={(value) => setCurrentBudget({...currentBudget, period: value as 'monthly' | 'yearly'})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select period" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="yearly">Yearly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button type="submit" className="bg-pocket-purple hover:bg-pocket-vivid">Update Budget</Button>
                  </DialogFooter>
                </form>
              )}
            </DialogContent>
          </Dialog>
        </div>

        {/* Overall Budget Summary */}
        <Card className="bg-gradient-to-r from-pocket-purple to-pocket-vivid text-white">
          <CardHeader>
            <CardTitle>Monthly Budget Overview</CardTitle>
            <CardDescription className="text-white/80">
              Your overall budget for {new Date().toLocaleString('default', { month: 'long' })} {new Date().getFullYear()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xl font-bold">${totalSpent.toFixed(2)} / ${totalBudget.toFixed(2)}</p>
                  <p className="text-sm text-white/80">
                    ${Math.max(totalBudget - totalSpent, 0).toFixed(2)} remaining
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold">{totalPercentage}%</p>
                  <p className="text-sm text-white/80">of total budget used</p>
                </div>
              </div>
              
              <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white rounded-full"
                  style={{ width: `${totalPercentage}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Budget Categories */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Budget Categories</h2>
          
          {budgets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {budgets.map((budget,key) => (
                <div key={key}>
                  <BudgetProgress
                    category={budget.category}
                    budgetAmount={budget.amount}
                    currentSpent={spendingByCategory[budget.category] || 0}
                    period={budget.period}
                  />
                  
                  <div className="flex justify-end mt-2 space-x-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleEdit(budget)}
                      className="h-8 w-8"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Budget</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this budget? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDelete(budget.id)}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Card className="border-dashed border-2 border-gray-300 bg-transparent text-center py-12">
              <CardContent>
                <h3 className="text-lg font-medium mb-2">No budgets set yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start managing your finances by creating your first budget
                </p>
                <Button onClick={() => setIsAddingBudget(true)} className="bg-pocket-purple hover:bg-pocket-vivid">
                  <Plus className="mr-2 h-4 w-4" /> Create Your First Budget
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Budget Tips */}
        <Card className="bg-pocket-softPurple/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-xl">💡</span> Budgeting Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="font-bold">The 50/30/20 Rule</h3>
                <p className="text-sm text-muted-foreground">
                  Allocate 50% of your income to needs, 30% to wants, and 20% to savings and debt repayment.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-bold">Track Every Expense</h3>
                <p className="text-sm text-muted-foreground">
                  Use our bill scanning feature to automatically log all your expenses for better tracking.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-bold">Review Regularly</h3>
                <p className="text-sm text-muted-foreground">
                  Check your budget progress weekly to stay on track and make adjustments as needed.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-bold">Plan for the Unexpected</h3>
                <p className="text-sm text-muted-foreground">
                  Set aside an emergency fund to cover unexpected expenses without derailing your budget.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default BudgetPage;
