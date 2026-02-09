export type PaymentStatus = "pending" | "completed" | "failed";
export type PaymentMethod = "card" | "cash" | "online_transfer";

export interface Payment {
  id: string;
  orderId: string;
  customerName: string;
  amount: number;
  method: PaymentMethod;
  paymentDate: string;
  status: PaymentStatus;
  transactionRef: string;
}

export interface SavedPaymentMethod {
  id: string;
  methodType: PaymentMethod;
  cardHolderName: string;
  maskedCardNumber: string;
  expiryDate: string;
}
