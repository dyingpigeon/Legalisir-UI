// components/page-data-provider.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PageData {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

interface PageDataContextType {
  pageData: PageData | null;
  setPageData: (data: PageData | null) => void;
}

const PageDataContext = createContext<PageDataContextType | undefined>(undefined);

export function PageDataProvider({ children }: { children: ReactNode }) {
  const [pageData, setPageData] = useState<PageData | null>(null);

  return (
    <PageDataContext.Provider value={{ pageData, setPageData }}>
      {children}
    </PageDataContext.Provider>
  );
}

export function usePageData() {
  const context = useContext(PageDataContext);
  if (context === undefined) {
    throw new Error('usePageData must be used within a PageDataProvider');
  }
  return context;
}