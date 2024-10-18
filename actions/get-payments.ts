import { db } from "../lib/db";
import { format } from "date-fns";
import PaymentRepository from "../repositories/PaymentRepository"; // Import the PaymentRepository

type PaymentData = {
  id: number;
  cardNumber: string;
  cvc: string;
  expDate: string;
  ownerName: string;
  balance: number;
  history: string;
  createdAt: string;
};

// Create an instance of the PaymentRepository
const paymentRepo = new PaymentRepository();

export default async function getAllPayments(): Promise<PaymentData[]> {
  // Fetch all payments from the repository
  const PAYMENTS = await paymentRepo.getAllPayments();

  // Format the `createdAt` and `expDate` fields to a specific date-time string format
  const formattedPayments: PaymentData[] = PAYMENTS.map((payment) => ({
    id: payment.id,
    cardNumber: payment.cardNumber,
    cvc: payment.cvc,
    expDate: format(payment.expDate, "yyyy-MM-dd"), // Formatting the expDate timestamp
    ownerName: payment.ownerName,
    balance: payment.balance,
    history: payment.history,
    createdAt: format(payment.createdAt, "yyyy-MM-dd HH:mm:ss"), // Formatting the createdAt timestamp
  }));

  // Return the formatted payments
  return formattedPayments;
}
