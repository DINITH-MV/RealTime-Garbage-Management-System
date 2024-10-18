import { db } from "../lib/db"; // Importing the db from your Prisma client

type PaymentDataUpdateInput = {
  id: number;
  cardNumber?: string;
  cvc?: string;
  expDate?: Date;
  ownerName?: string;
  history?: string;
  balance?: number;
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

export default async function updatePayment(
  data: PaymentDataUpdateInput
): Promise<PaymentData | null> {
  const { id, ...updateData } = data;

  try {
    // Ensure that the id is provided
    if (!id) {
      throw new Error("ID is required for updating payment.");
    }

    // Update the payment with the fields provided
    const updatedPayment = await db.payment.update({
      where: { id },
      data: updateData,
    });

    console.log(id);
    
    // Return the updated payment
    // Ensure the updatedPayment object has the correct property names
    return {
      ...updatedPayment,
      ownerName: updatedPayment.ownerName,
    };
  } catch (error) {
    console.error("[updatePayment] Error updating payment:", error);
    return null;
  }
}
