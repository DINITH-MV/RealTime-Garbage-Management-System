import { db } from "../lib/db"; // Import your Prisma client

type PaymentDataInput = {
  cardNumber: string;
  cvc: string;
  expDate: Date;
  ownerName: string;
  balance: number;
  history: string;
};

type PaymentData = {
  id: number;
  cardNumber: string;
  cvc: string;
  expDate: Date;
  ownerName: string;
  balance: number;
  history: string;
  createdAt: Date;
};

class PaymentRepository {
  // Method to get all payments ordered by creation date
  async getAllPayments(): Promise<PaymentData[]> {
    return await db.payment.findMany({
      orderBy: {
        createdAt: "desc", // Order by creation date
      },
    });
  }

  // Method to add a new payment to the database
  async addPayment(data: PaymentDataInput): Promise<PaymentData> {
    const newPayment = await db.payment.create({
      data: {
        cardNumber: data.cardNumber,
        cvc: data.cvc,
        expDate: data.expDate,
        ownerName: data.ownerName, // Ensure this matches your model (note: `ornerName` instead of `ownerName`)
        balance: data.balance,
        history: data.history,
      },
    });
    return newPayment;
  }
}

export default PaymentRepository;
