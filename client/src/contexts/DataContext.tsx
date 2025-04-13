
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';
import Tesseract from 'tesseract.js'; //scan bill
import { addTransactionApi } from '@/api/transaction';

export type Category = 
  | 'housing' 
  | 'food' 
  | 'transportation' 
  | 'utilities' 
  | 'healthcare' 
  | 'entertainment' 
  | 'shopping' 
  | 'personal' 
  | 'education' 
  | 'debt' 
  | 'savings' 
  | 'income' 
  | 'other';

export type Transaction = {
  id: string;
  amount: number;
  description: string;
  category: Category;
  date: string;
  type: 'expense' | 'income';
  billImageUrl?: string;
};

export type Budget = {
  id: string;
  category: Category;
  amount: number;
  period: 'monthly' | 'yearly';
};

type DataContextType = {
  transactions: Transaction[];
  budgets: Budget[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, transaction: Partial<Omit<Transaction, 'id'>>) => void;
  deleteTransaction: (id: string) => void;
  addBudget: (budget: Omit<Budget, 'id'>) => void;
  updateBudget: (id: string, budget: Partial<Omit<Budget, 'id'>>) => void;
  deleteBudget: (id: string) => void;
  isLoading: boolean;
  processImageAmount: (imageUrl: string) => Promise<number | null>;
};

const DataContext = createContext<DataContextType | null>(null);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

const SAMPLE_TRANSACTIONS: Transaction[] = [
  {
    id: 't1',
    amount: 1500,
    description: 'Salary',
    category: 'income',
    date: '2025-04-01',
    type: 'income'
  },
  {
    id: 't2',
    amount: 800,
    description: 'Rent',
    category: 'housing',
    date: '2025-04-02',
    type: 'expense'
  },
  {
    id: 't3',
    amount: 120,
    description: 'Groceries',
    category: 'food',
    date: '2025-04-03',
    type: 'expense'
  },
  {
    id: 't4',
    amount: 45,
    description: 'Gas',
    category: 'transportation',
    date: '2025-04-05',
    type: 'expense'
  },
  {
    id: 't5',
    amount: 25,
    description: 'Movie tickets',
    category: 'entertainment',
    date: '2025-04-08',
    type: 'expense'
  }
];

const SAMPLE_BUDGETS: Budget[] = [
  { id: 'b1', category: 'housing', amount: 1000, period: 'monthly' },
  { id: 'b2', category: 'food', amount: 400, period: 'monthly' },
  { id: 'b3', category: 'transportation', amount: 200, period: 'monthly' },
  { id: 'b4', category: 'entertainment', amount: 100, period: 'monthly' }
];

//------------------------------------------scan bill------------------------
const extractTotalBill = (text) => {
  const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
  let totalBill = null;

  // Define possible keywords for total
  const totalKeywords = [
    /(total|offer total|next bill|grand total)\s*[:\-=\s]?\s*([0-9,.]+(?:\s?[₹$€£]?)?)$/i
  ];

  // Check lines for total keywords
  lines.forEach((line) => {
    const cleanedLine = line.replace(/\s{2,}/g, ' ').trim();

    totalKeywords.forEach(keywordRegex => {
      const match = cleanedLine.match(keywordRegex);
      if (match) {
        totalBill = match[2].trim();
      }
    });
  });

  return totalBill;
};
//--------------------------------end---------------------------------
export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      // Load data from localStorage or use sample data
      try {
        const savedTransactions = localStorage.getItem(`pocketplus_transactions_${user.id}`);
        const savedBudgets = localStorage.getItem(`pocketplus_budgets_${user.id}`);
        
        setTransactions(savedTransactions ? JSON.parse(savedTransactions) : SAMPLE_TRANSACTIONS);
        setBudgets(savedBudgets ? JSON.parse(savedBudgets) : SAMPLE_BUDGETS);
      } catch (error) {
        console.error('Error loading data from localStorage:', error);
        // Fall back to sample data
        setTransactions(SAMPLE_TRANSACTIONS);
        setBudgets(SAMPLE_BUDGETS);
      }
    } else {
      setTransactions([]);
      setBudgets([]);
    }
    setIsLoading(false);
  }, [user]);

  // Save data whenever it changes
  useEffect(() => {
    if (user) {
      try {
        localStorage.setItem(`pocketplus_transactions_${user.id}`, JSON.stringify(transactions));
        localStorage.setItem(`pocketplus_budgets_${user.id}`, JSON.stringify(budgets));
      } catch (error) {
        console.error('Error saving data to localStorage:', error);
      }
    }
  }, [transactions, budgets, user]);

  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    addTransactionApi(transaction);
    console.log("added");
    const newTransaction = {
      ...transaction,
      id: `t_${Date.now()}`,
    };
    setTransactions(prev => [newTransaction, ...prev]);
    toast.success('Transaction added');
  };

  const updateTransaction = (id: string, transactionUpdate: Partial<Omit<Transaction, 'id'>>) => {
    setTransactions(prev => 
      prev.map(t => 
        t.id === id ? { ...t, ...transactionUpdate } : t
      )
    );
    toast.success('Transaction updated');
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    toast.success('Transaction deleted');
  };

  const addBudget = (budget: Omit<Budget, 'id'>) => {
    const newBudget = {
      ...budget,
      id: `b_${Date.now()}`,
    };
    setBudgets(prev => [...prev, newBudget]);
    toast.success('Budget added');
  };

  const updateBudget = (id: string, budgetUpdate: Partial<Omit<Budget, 'id'>>) => {
    setBudgets(prev => 
      prev.map(b => 
        b.id === id ? { ...b, ...budgetUpdate } : b
      )
    );
    toast.success('Budget updated');
  };

  const deleteBudget = (id: string) => {
    setBudgets(prev => prev.filter(b => b.id !== id));
    toast.success('Budget deleted');
  };

  // Mock image processing with OCR
  // In a real app, this would call an API or use a library
  const processImageAmount = async (imageUrl: string): Promise<number | null> => {

    
    try {
      //-------------------------------------------
      const reader = new FileReader();
      reader.onload = async () => {
        const imageData = reader.result;

         const result = await Tesseract.recognize(imageData as any, 'eng', {
                  logger: (m) => console.log(m),
                });
        
          const text = result.data.text;
          const randomAmount = extractTotalBill(text);
          
          toast.success('Bill amount detected successfully');
          return randomAmount;
      }
       //-------------------------------------------
      // Simulate processing delay
      // await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate a random amount to simulate OCR reading from bill
      // const randomAmount = Math.floor(Math.random() * 200) + 20;
      
    } catch (error) {
      console.error('Error processing image:', error);
      toast.error('Failed to process bill image');
      return null;
    }
  };

  return (
    <DataContext.Provider
      value={{
        transactions,
        budgets,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addBudget,
        updateBudget,
        deleteBudget,
        isLoading,
        processImageAmount
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
