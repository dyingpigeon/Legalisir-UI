// contexts/AuthContext.tsx
'use client'

import React, { createContext, useState, useEffect, ReactNode } from 'react'
import axios from 'axios'


// Interface yang akan diekspor
export interface User {
  id: number
  name: string
  email: string
  email_verified_at?: string | null
  created_at?: string
  updated_at?: string
}

export interface LoginCredentials {
  email: string
  password: string
  remember?: boolean
}

export interface RegisterCredentials {
  name: string
  email: string
  password: string
  password_confirmation: string
}

export interface ResetPasswordCredentials {
  email: string
  password: string
  password_confirmation: string
  token: string
}

export interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  register: (credentials: RegisterCredentials) => Promise<void>
  logout: () => Promise<void>
  forgotPassword: (email: string) => Promise<void>
  resetPassword: (credentials: ResetPasswordCredentials) => Promise<void>
  resendEmailVerification: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)


interface AuthProviderProps {
  children: ReactNode
}

interface AuthContextValue {
  user: User | null
  isLoading: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  register: (credentials: RegisterCredentials) => Promise<void>
  logout: () => Promise<void>
  forgotPassword: (email: string) => Promise<void>
  resetPassword: (credentials: ResetPasswordCredentials) => Promise<void>
  resendEmailVerification: () => Promise<void>
}

// export const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on initial load
    const checkAuth = async () => {
      try {
        const response = await axios.get('/api/user')
        setUser(response.data)
      } catch (error) {
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (credentials: LoginCredentials) => {
    try {
      await axios.get('/sanctum/csrf-cookie')
      await axios.post('/login', credentials)
      
      const response = await axios.get('/api/user')
      setUser(response.data)
    } catch (error) {
      throw error
    }
  }

  const register = async (credentials: RegisterCredentials) => {
    try {
      await axios.get('/sanctum/csrf-cookie')
      await axios.post('/register', credentials)
      
      const response = await axios.get('/api/user')
      setUser(response.data)
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      await axios.post('/logout')
      setUser(null)
    } catch (error) {
      throw error
    }
  }

  const forgotPassword = async (email: string) => {
    try {
      await axios.post('/forgot-password', { email })
    } catch (error) {
      throw error
    }
  }

  const resetPassword = async (credentials: ResetPasswordCredentials) => {
    try {
      await axios.post('/reset-password', credentials)
    } catch (error) {
      throw error
    }
  }

  const resendEmailVerification = async () => {
    try {
      await axios.post('/email/verification-notification')
    } catch (error) {
      throw error
    }
  }

  const value: AuthContextValue = {
    user,
    isLoading,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    resendEmailVerification,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}