"use client";

import { createContext, useContext, useState, ReactNode } from "react";

// Definindo o tipo para o contexto
interface CnsContextType {
  cns: string | null;
  setCns: (cns: string | null) => void;
}

// Criando o contexto
const CnsContext = createContext<CnsContextType | undefined>(undefined);

export const CnsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cns, setCns] = useState<string | null>(null);

  return (
    <CnsContext.Provider value={{ cns, setCns }}>
      {children}
    </CnsContext.Provider>
  );
};

// Hook personalizado para acessar o contexto
export const useCns = (): CnsContextType => {
  const context = useContext(CnsContext);
  if (!context) {
    throw new Error("useCns must be used within a CnsProvider");
  }
  return context;
};