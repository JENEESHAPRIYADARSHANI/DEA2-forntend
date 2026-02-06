import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Quotation, QuotationItem, QuotationStatus } from "@/types/quotation";

interface QuotationContextType {
  quotations: Quotation[];
  createQuotation: (data: Omit<Quotation, "id" | "status" | "createdAt" | "updatedAt" | "subtotal" | "totalAmount"> & { items: QuotationItem[] }) => Quotation;
  updateQuotation: (id: string, updates: Partial<Quotation>) => void;
  updateQuotationStatus: (id: string, status: QuotationStatus, reason?: string) => void;
  deleteQuotation: (id: string) => void;
  convertToOrder: (id: string) => string;
  getQuotationsByUser: (userId: string) => Quotation[];
}

const QuotationContext = createContext<QuotationContextType | undefined>(undefined);

function calculateTotals(items: QuotationItem[]) {
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const totalAmount = items.reduce((sum, item) => {
    const discountedPrice = item.unitPrice * (1 - item.discount / 100);
    return sum + item.quantity * discountedPrice;
  }, 0);
  return { subtotal, totalAmount };
}

export function QuotationProvider({ children }: { children: ReactNode }) {
  const [quotations, setQuotations] = useState<Quotation[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("starbags_quotations");
    if (stored) {
      setQuotations(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("starbags_quotations", JSON.stringify(quotations));
  }, [quotations]);

  const createQuotation = (data: Omit<Quotation, "id" | "status" | "createdAt" | "updatedAt" | "subtotal" | "totalAmount"> & { items: QuotationItem[] }) => {
    const { subtotal, totalAmount } = calculateTotals(data.items);
    const itemsWithTotals = data.items.map((item) => ({
      ...item,
      total: item.quantity * item.unitPrice * (1 - item.discount / 100),
    }));

    const newQuotation: Quotation = {
      ...data,
      items: itemsWithTotals,
      id: `QT-${String(Date.now()).slice(-6)}`,
      status: "draft",
      subtotal,
      totalAmount,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setQuotations((prev) => [...prev, newQuotation]);
    return newQuotation;
  };

  const updateQuotation = (id: string, updates: Partial<Quotation>) => {
    setQuotations((prev) =>
      prev.map((q) => {
        if (q.id !== id || q.status === "approved" || q.status === "converted") return q;
        const updatedItems = updates.items || q.items;
        const { subtotal, totalAmount } = calculateTotals(updatedItems);
        return {
          ...q,
          ...updates,
          items: updatedItems.map((item) => ({
            ...item,
            total: item.quantity * item.unitPrice * (1 - item.discount / 100),
          })),
          subtotal,
          totalAmount,
          updatedAt: new Date().toISOString(),
        };
      })
    );
  };

  const updateQuotationStatus = (id: string, status: QuotationStatus, reason?: string) => {
    setQuotations((prev) =>
      prev.map((q) =>
        q.id === id
          ? {
              ...q,
              status,
              updatedAt: new Date().toISOString(),
              ...(reason && status === "rejected" ? { rejectionReason: reason } : {}),
            }
          : q
      )
    );
  };

  const deleteQuotation = (id: string) => {
    setQuotations((prev) => {
      const q = prev.find((q) => q.id === id);
      if (q && q.status !== "rejected") return prev;
      return prev.filter((q) => q.id !== id);
    });
  };

  const convertToOrder = (id: string) => {
    const orderId = `ORD-${String(Date.now()).slice(-6)}`;
    const quotation = quotations.find((q) => q.id === id);

    if (quotation && quotation.status === "approved") {
      // Create order in localStorage
      const existingOrders = JSON.parse(localStorage.getItem("starbags_orders") || "[]");
      const newOrder = {
        id: orderId,
        items: quotation.items.map((item) => ({
          id: item.productId,
          name: item.productName,
          price: item.unitPrice * (1 - item.discount / 100),
          quantity: item.quantity,
          image: "",
        })),
        total: quotation.totalAmount,
        status: "Processing",
        date: new Date().toISOString(),
        source: "quotation",
        quotationId: id,
      };
      existingOrders.push(newOrder);
      localStorage.setItem("starbags_orders", JSON.stringify(existingOrders));

      // Update quotation status
      updateQuotationStatus(id, "converted");
      setQuotations((prev) =>
        prev.map((q) =>
          q.id === id ? { ...q, convertedOrderId: orderId, status: "converted", updatedAt: new Date().toISOString() } : q
        )
      );
    }

    return orderId;
  };

  const getQuotationsByUser = (userId: string) => {
    return quotations.filter((q) => q.userId === userId);
  };

  return (
    <QuotationContext.Provider
      value={{
        quotations,
        createQuotation,
        updateQuotation,
        updateQuotationStatus,
        deleteQuotation,
        convertToOrder,
        getQuotationsByUser,
      }}
    >
      {children}
    </QuotationContext.Provider>
  );
}

export function useQuotations() {
  const context = useContext(QuotationContext);
  if (context === undefined) {
    throw new Error("useQuotations must be used within a QuotationProvider");
  }
  return context;
}
