
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import axios from "axios";
import {registerApi,loginApi,logoutApi, isMeApi} from "../api/auth.tsx";

type User = {
  id: string;
  name: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  updateUser: (updatedUser: User) => Promise<boolean>;
  deleteUser: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | null>(null);

//export AuthContext using useContext and make it custome hook 
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    //checked user is Logged in or not if yes then set user details in user(setUser)
    isMeApi()
      .then((response)=>{
        setUser({
          id: response.id,
          name: response.name,
          email:response.email,
        });
      }).catch((error)=>{
        console.log("something want wrong");
      }).finally(()=>{
        setIsLoading(false);
      });

  }, []);
 
  //done
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const response = await loginApi({
        email,password
      });
      
      const newUser = {
        id: response.id,
        name: response.name,
        email,
      };
      
      setUser(newUser);
      localStorage.setItem('pocketplus_user', JSON.stringify(newUser));
      toast.success('Logged in successfully');
      return true;
    } catch (error) {
      toast.error(error.message || 'Failed to login');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  //done
  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      
      const response = await registerApi({
        name,email,password
      });
      
      if (!email.includes('@') || password.length < 6 || !name) {
        toast.error('Invalid registration information');
        return false;
      }
      
      const newUser = {
        id: response.id,
        name,
        email,
      };
      
      setUser(newUser);
      toast.success('Account created successfully');
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      toast.error( error.message || 'Failed to create account');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  //done
  const logout = async() => {
    try {
      const response = await logoutApi();
      setUser(null);
      toast.success('Logged out successfully');
    } catch (error) {
      toast.success('Logged out faild');
    }
  };

  // Add the missing updateUser method
  const updateUser = async (updatedUser: User): Promise<boolean> => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      setUser(updatedUser);
      localStorage.setItem('pocketplus_user', JSON.stringify(updatedUser));
      toast.success('Profile updated successfully');
      return true;
    } catch (error) {
      console.error('Update user error:', error);
      toast.error('Failed to update profile');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Add the missing deleteUser method
  const deleteUser = async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      setUser(null);
      localStorage.removeItem('pocketplus_user');
      toast.success('Account deleted successfully');
      return true;
    } catch (error) {
      console.error('Delete user error:', error);
      toast.error('Failed to delete account');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        updateUser,
        deleteUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
