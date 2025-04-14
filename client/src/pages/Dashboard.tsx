import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { AreaChart, BarChart, DonutChart, BarList } from '@/components/ui/custom-charts';
import { PieChart, CalendarPlus, Plus, Camera } from 'lucide-react';
import { useData, Transaction, Category } from '@/contexts/DataContext';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BillCamera } from '@/components/BillCamera';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

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

const Dashboard = () => {
  const { transactions, budgets, addTransaction, isLoading, processImageAmount } = useData();
  const [isAddingTransaction, setIsAddingTransaction] = useState(false);
  const [newTransaction, setNewTransaction] = useState<Partial<Omit<Transaction, 'id'>>>({
    amount: 0,
    description: '',
    category: 'other',
    date: new Date().toISOString().split('T')[0],
    type: 'expense'
  });
  const [capturedImageUrl, setCapturedImageUrl] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const navigate = useNavigate();

  const today = new Date();
  const currentMonth = today.toLocaleString('default', { month: 'long' });
  const currentYear = today.getFullYear();

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const balance = totalIncome - totalExpenses;

  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const pieChartData = Object.entries(expensesByCategory).map(([category, amount]) => ({
    name: category,
    value: amount,
    color: categoryColors[category as Category] || '#9CA3AF'
  }));

  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTransaction.description && newTransaction.amount && newTransaction.category && newTransaction.date) {
      addTransaction({
        amount: newTransaction.type === 'expense' ? Math.abs(Number(newTransaction.amount)) : Math.abs(Number(newTransaction.amount)),
        description: newTransaction.description,
        category: newTransaction.category as Category,
        date: newTransaction.date,
        type: newTransaction.type || 'expense',
        billImageUrl: capturedImageUrl || undefined
      });
      
      setNewTransaction({
        amount: 0,
        description: '',
        category: 'other',
        date: new Date().toISOString().split('T')[0],
        type: 'expense'
      });
      setCapturedImageUrl(null);
      setIsAddingTransaction(false);
      setShowCamera(false);
    }
  };

  const lastSixMonths = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    return date.toLocaleString('default', { month: 'short' });
  }).reverse();

  const expenseData = lastSixMonths.map(month => {
    return {
      name: month,
      value: Math.floor(Math.random() * 2000) + 500
    };
  });

  const incomeData = lastSixMonths.map(month => {
    return {
      name: month,
      value: Math.floor(Math.random() * 3000) + 2000
    };
  });

  const handleImageCapture = (imageUrl: string) => {
    setCapturedImageUrl(imageUrl);
  };

  const handleAmountDetected = (amount: number) => {
    setNewTransaction({
      ...newTransaction,
      amount: amount,
      type: 'expense'
    });
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Overview of your finances for {currentMonth} {currentYear}
            </p>
          </div>
          
          <Dialog open={isAddingTransaction} onOpenChange={setIsAddingTransaction}>
            <DialogTrigger asChild>
              <Button className="bg-pocket-purple hover:bg-pocket-vivid">
                <Plus className="mr-2 h-4 w-4" /> Add Transaction
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Transaction</DialogTitle>
                <DialogDescription>
                  {showCamera ? 
                    "Take a photo of your bill or receipt" : 
                    "Enter the details of your transaction or scan a bill"}
                </DialogDescription>
              </DialogHeader>
              
              {showCamera ? (
                <div className="py-4">
                  <BillCamera 
                    onCapture={handleImageCapture}
                    onAmountDetected={handleAmountDetected}
                  />
                  <div className="mt-4 flex justify-end">
                    <Button variant="outline" onClick={() => setShowCamera(false)}>
                      Back to Form
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="type">Transaction Type</Label>
                      <Select 
                        value={newTransaction.type} 
                        onValueChange={(value) => setNewTransaction({...newTransaction, type: value as 'expense' | 'income'})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="expense">Expense</SelectItem>
                          <SelectItem value="income">Income</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount</Label>
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        value={newTransaction.amount || ''}
                        onChange={(e) => setNewTransaction({...newTransaction, amount: parseFloat(e.target.value)})}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        value={newTransaction.description || ''}
                        onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select 
                        value={newTransaction.category} 
                        onValueChange={(value) => setNewTransaction({...newTransaction, category: value as Category})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(categoryIcons).map(([category, icon]) => (
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
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={newTransaction.date || ''}
                        onChange={(e) => setNewTransaction({...newTransaction, date: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="pt-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setShowCamera(true)}
                        className="w-full"
                      >
                        <Camera className="mr-2 h-4 w-4" />
                        Scan Bill or Receipt
                      </Button>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button type="submit" className="bg-pocket-purple hover:bg-pocket-vivid">Add Transaction</Button>
                  </DialogFooter>
                </form>
              )}
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <motion.div 
            className="card-3d"
            whileHover={{ y: -5, boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.5)" }}
          >
            <Card className="bg-white">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-1">
                  <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
                  <CardDescription>Available funds</CardDescription>
                </div>
                <div className="w-10 h-10 bg-pocket-softPurple rounded-full flex items-center justify-center">
                  <span className="text-xl text-pocket-purple">💰</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(balance)}
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div 
            className="card-3d"
            whileHover={{ y: -5, boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.5)" }}
          >
            <Card className="bg-white">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-1">
                  <CardTitle className="text-sm font-medium">Total Income</CardTitle>
                  <CardDescription>Monthly earnings</CardDescription>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-xl text-green-600">💵</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalIncome)}
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div 
            className="card-3d"
            whileHover={{ y: -5, boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.5)" }}
          >
            <Card className="bg-white">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-1">
                  <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                  <CardDescription>Monthly spending</CardDescription>
                </div>
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-xl text-red-600">💸</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalExpenses)}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid gap-6 md:grid-cols-7">
          <div className="md:col-span-5 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Financial Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="expenses">
                  <TabsList className="mb-4">
                    <TabsTrigger value="expenses">Expenses</TabsTrigger>
                    <TabsTrigger value="income">Income</TabsTrigger>
                    <TabsTrigger value="combined">Combined</TabsTrigger>
                  </TabsList>
                  <TabsContent value="expenses" className="h-[300px]">
                    <AreaChart
                      data={expenseData}
                      index="name"
                      categories={["value"]}
                      colors={["#8B5CF6"]}
                      valueFormatter={(value) => `$${value.toLocaleString()}`}
                      showLegend={false}
                      showGridLines={false}
                      startEndOnly={false}
                      showAnimation={true}
                      showGradient={true}
                    />
                  </TabsContent>
                  <TabsContent value="income" className="h-[300px]">
                    <AreaChart
                      data={incomeData}
                      index="name"
                      categories={["value"]}
                      colors={["#22C55E"]}
                      valueFormatter={(value) => `$${value.toLocaleString()}`}
                      showLegend={false}
                      showGridLines={false}
                      startEndOnly={false}
                      showAnimation={true}
                      showGradient={true}
                    />
                  </TabsContent>
                  <TabsContent value="combined" className="h-[300px]">
                    <BarChart
                      data={lastSixMonths.map(month => ({
                        name: month,
                        "Income": Math.floor(Math.random() * 3000) + 2000,
                        "Expenses": Math.floor(Math.random() * 2000) + 500
                      }))}
                      index="name"
                      categories={["Income", "Expenses"]}
                      colors={["#22C55E", "#F43F5E"]}
                      valueFormatter={(value) => `$${value.toLocaleString()}`}
                      stack={false}
                      showAnimation={true}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Expense Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px]">
                    <DonutChart
                      data={pieChartData}
                      category="value"
                      index="name"
                      valueFormatter={(value) => `$${value.toLocaleString()}`}
                      showAnimation={true}
                      showTooltip={true}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Top Spending Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px]">
                    <BarList
                      data={Object.entries(expensesByCategory)
                        .map(([name, value]) => ({
                          name: name.charAt(0).toUpperCase() + name.slice(1),
                          value
                        }))
                        .sort((a, b) => b.value - a.value)
                        .slice(0, 5)}
                      valueFormatter={(value) => `$${value.toLocaleString()}`}
                      showAnimation={true}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTransactions.length > 0 ? (
                    recentTransactions.map((transaction,key) => (
                      <div
                        key={key}
                        className="flex items-center justify-between p-3 rounded-lg bg-gray-50 animate-hover"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <span>
                              {categoryIcons[transaction.category] || '📦'}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium truncate max-w-[120px]">
                              {transaction.description}
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(transaction.date).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div
                          className={
                            transaction.type === 'income'
                              ? 'text-green-600 font-medium'
                              : 'text-red-600 font-medium'
                          }
                        >
                          {transaction.type === 'income' ? '+' : '-'}
                          {new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD',
                          }).format(transaction.amount)}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      No recent transactions
                    </div>
                  )}
                </div>
                <div className="mt-4">
                  <Button variant="outline" className="w-full" onClick={() => navigate('/transactions')}>
                    View All Transactions
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Bills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { id: 'b1', title: 'Rent', amount: 800, dueDate: '2025-04-15' },
                    { id: 'b2', title: 'Internet', amount: 60, dueDate: '2025-04-20' },
                    { id: 'b3', title: 'Phone', amount: 45, dueDate: '2025-04-22' },
                  ].map((bill) => (
                    <div
                      key={bill.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-50 animate-hover"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <CalendarPlus className="h-4 w-4 text-gray-700" />
                        </div>
                        <div>
                          <div className="font-medium">{bill.title}</div>
                          <div className="text-xs text-gray-500">
                            Due {new Date(bill.dueDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-gray-900 font-medium">
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD',
                        }).format(bill.amount)}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Button variant="outline" className="w-full">
                    View All Bills
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
