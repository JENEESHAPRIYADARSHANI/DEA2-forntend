import { createContext, useContext, useState, ReactNode } from "react";
import { Payment, SavedPaymentMethod, PaymentStatus, PaymentMethod } from "@/types/payment";

const initialPayments: Payment[] = [
  {
    id: "PAY-001",
    orderId: "ORD-001",
    customerName: "Acme Corp",
    amount: 2500.0,
    method: "card",
    paymentDate: "2026-02-01",
    status: "completed",
    transactionRef: "TXN-ABC123",
  },
  {
    id: "PAY-002",
    orderId: "ORD-002",
    customerName: "Globe Industries",
    amount: 1800.0,
    method: "online_transfer",
    paymentDate: "2026-02-03",
    status: "pending",
    transactionRef: "TXN-DEF456",
  },
  {
    id: "PAY-003",
    orderId: "ORD-003",
    customerName: "Star Retail",
    amount: 950.0,
    method: "cash",
    paymentDate: "2026-02-05",
    status: "completed",
    transactionRef: "TXN-GHI789",
  },
  {
    id: "PAY-004",
    orderId: "ORD-004",
    customerName: "Urban Outfitters",
    amount: 3200.0,
    method: "card",
    paymentDate: "2026-02-07",
    status: "failed",
    transactionRef: "TXN-JKL012",
  },
  {
    id: "PAY-005",
    orderId: "ORD-005",
    customerName: "BagWorld Inc.",
    amount: 4100.0,
    method: "online_transfer",
    paymentDate: "2026-01-28",
    status: "completed",
    transactionRef: "TXN-MNO345",
  },
];

const initialSavedMethods: SavedPaymentMethod[] = [
  {
    id: "SPM-001",
    methodType: "card",
    cardHolderName: "John Smith",
    maskedCardNumber: "**** **** **** 4242",
    expiryDate: "12/27",
  },
  {
    id: "SPM-002",
    methodType: "card",
    cardHolderName: "Jane Doe",
    maskedCardNumber: "**** **** **** 1234",
    expiryDate: "06/28",
  },
];

interface PaymentContextType {
  payments: Payment[];
  savedMethods: SavedPaymentMethod[];
  addPayment: (payment: Omit<Payment, "id">) => void;
  updatePayment: (id: string, updates: Partial<Payment>) => void;
  deletePayment: (id: string) => void;
  addSavedMethod: (method: Omit<SavedPaymentMethod, "id">) => void;
  updateSavedMethod: (id: string, updates: Partial<SavedPaymentMethod>) => void;
  deleteSavedMethod: (id: string) => void;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export function PaymentProvider({ children }: { children: ReactNode }) {
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const [savedMethods, setSavedMethods] = useState<SavedPaymentMethod[]>(initialSavedMethods);

  const addPayment = (payment: Omit<Payment, "id">) => {
    const newPayment: Payment = {
      ...payment,
      id: `PAY-${String(payments.length + 1).padStart(3, "0")}`,
    };
    setPayments((prev) => [newPayment, ...prev]);
  };

  const updatePayment = (id: string, updates: Partial<Payment>) => {
    setPayments((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deletePayment = (id: string) => {
    setPayments((prev) => prev.filter((p) => p.id !== id));
  };

  const addSavedMethod = (method: Omit<SavedPaymentMethod, "id">) => {
    const newMethod: SavedPaymentMethod = {
      ...method,
      id: `SPM-${String(savedMethods.length + 1).padStart(3, "0")}`,
    };
    setSavedMethods((prev) => [...prev, newMethod]);
  };

  const updateSavedMethod = (id: string, updates: Partial<SavedPaymentMethod>) => {
    setSavedMethods((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)));
  };

  const deleteSavedMethod = (id: string) => {
    setSavedMethods((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <PaymentContext.Provider
      value={{
        payments,
        savedMethods,
        addPayment,
        updatePayment,
        deletePayment,
        addSavedMethod,
        updateSavedMethod,
        deleteSavedMethod,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
}

export function usePayments() {
  const context = useContext(PaymentContext);
  if (!context) throw new Error("usePayments must be used within PaymentProvider");
  return context;
}
