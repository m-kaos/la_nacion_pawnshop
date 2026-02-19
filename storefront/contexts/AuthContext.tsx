'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { graphqlClient } from '@/lib/graphql-client';
import { GET_ACTIVE_CUSTOMER, LOGIN_MUTATION, LOGOUT_MUTATION } from '@/lib/auth-queries';

interface Customer {
  id: string;
  title?: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  phoneNumber?: string;
}

interface AuthContextType {
  customer: Customer | null;
  loading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refetchCustomer: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCustomer = async () => {
    try {
      console.log('Fetching active customer...');
      const result = await graphqlClient.query(GET_ACTIVE_CUSTOMER, {});
      console.log('Active customer result:', result);
      if (result.data?.activeCustomer) {
        console.log('Setting customer:', result.data.activeCustomer);
        setCustomer(result.data.activeCustomer);
      } else {
        console.log('No active customer found');
        setCustomer(null);
      }
    } catch (error) {
      console.error('Error fetching customer:', error);
      setCustomer(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomer();
  }, []);

  const login = async (email: string, password: string, rememberMe: boolean = false) => {
    try {
      console.log('Attempting login with:', email, 'Remember me:', rememberMe);
      const result = await graphqlClient.mutation(LOGIN_MUTATION, {
        email,
        password,
        rememberMe,
      });

      console.log('Login result:', result);

      if (result.data?.login?.id) {
        // Login successful
        console.log('Login successful, fetching customer...');
        await fetchCustomer();
        console.log('Customer fetched after login');
        return { success: true };
      } else if (result.data?.login?.errorCode) {
        // Login failed with error
        console.log('Login failed with error:', result.data.login);
        return {
          success: false,
          error: result.data.login.message || 'Login failed',
        };
      }

      console.log('Login failed - no id or error');
      return { success: false, error: 'Login failed' };
    } catch (error: any) {
      console.error('Login error:', error);
      return { success: false, error: error.message || 'An error occurred' };
    }
  };

  const logout = async () => {
    try {
      await graphqlClient.mutation(LOGOUT_MUTATION, {});
      setCustomer(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const refetchCustomer = async () => {
    await fetchCustomer();
  };

  return (
    <AuthContext.Provider
      value={{
        customer,
        loading,
        login,
        logout,
        refetchCustomer,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
