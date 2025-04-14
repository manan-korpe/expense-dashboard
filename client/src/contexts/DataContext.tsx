
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';
import Tesseract from 'tesseract.js'; //scan bill
import { addTransactionApi, getTransactionApi, putTransactionApi } from '@/api/transaction';

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

//export DataContext using useContext and make it custome hook 
export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

const SAMPLE_TRANSACTIONS: Transaction[] = [];

const SAMPLE_BUDGETS: Budget[] = [];

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
    if(user){
      getTransactionApi()
        .then((response)=>{
          setTransactions(response || []);
          setBudgets([]);
        }).catch((error)=>{
          toast.error(error.message || "something want wrong in transaction and budget");
          setTransactions([]);
          setBudgets([]);
        }).finally(()=>{
          setIsLoading(false);
        });
    }
  }, [user]);

  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
   try {
    const response = await addTransactionApi(transaction);
    
    const newTransaction = {
      id: response?._id,
      amount: Number(response.amount),
      description: response?.description || "",
      category: response?.category,
      date: String(response?.createdAt).split("T")[0],
      type: response?.type,
      billImageUrl: "",
    };
   console.log(newTransaction)
    setTransactions(prev => [newTransaction, ...prev]);
    toast.success('Transaction added');
   } catch (error) {
    toast.error(error.message || "something want wrong");
   }
  };

  const updateTransaction = async  (id: string, transactionUpdate: Partial<Omit<Transaction, 'id'>>) => {
    try {
      const response = await putTransactionApi(id,{
        amount:transactionUpdate.amount,
        description:transactionUpdate.description,
        category:transactionUpdate.category,
        type:transactionUpdate.type
      });
      console.log(response);
      setTransactions(prev => 
        prev.map(t => 
          t.id === id ? { ...t, ...transactionUpdate } : t
        )
      );

      toast.success('Transaction updated');
    } catch (error) {
      toast.error(error.message || "Transaction update faild ");
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      await deleteTransaction(id); //for delete transaction
      setTransactions(prev => prev.filter(t => t.id !== id));
      toast.success('Transaction deleted');
    } catch (error) {
      toast.error(error.message || 'Transaction delete falid');
    }
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
