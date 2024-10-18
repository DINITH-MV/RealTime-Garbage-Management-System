import { db } from "../lib/db"; // Importing the db from your Prisma client

type PaymentDataDeleteInput = {
  id: number;
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

export default async function deletePayment(
  data: PaymentDataDeleteInput
): Promise<PaymentData | null> {
  const { id } = data;
  try {
    // Ensure that the id is provided
    if (!id) {
      throw new Error("ID is required for deleting payment.");
    }

    // Check if the payment exists before attempting to delete
    const payment = await db.payment.findUnique({
      where: { id },
    });

    if (!payment) {
      console.error(`[deletePayment] Payment with ID ${id} not found.`);
      return null; // Return null if payment doesn't exist
    }

    // Proceed to delete the payment if found
    const deletedPayment = await db.payment.delete({
      where: { id },
    });

    console.log("Deleted Payment ID:", id);

    // Return the deleted payment data
    return deletedPayment;
  } catch (error) {
    console.error("[deletePayment] Error deleting payment:", error);
    return null;
  }
}
