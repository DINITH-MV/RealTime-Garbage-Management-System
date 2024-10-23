import { db } from "../lib/db"; // Importing the db from your Prisma client

type PaymentCardDetailsUpdateInput = {
  id: number;
  ownerName?: string;
  cvc?: string;
  expDate?: Date; // Keep it as a string for input but we'll convert it to Date
};

export default async function updateCardDetails(
  data: PaymentCardDetailsUpdateInput
): Promise<PaymentCardDetailsUpdateInput | null> {
  const { id, ownerName, cvc, expDate } = data;

  try {
    // Ensure the `expDate` is converted into a Date object if provided
    const updateData: any = {
      ownerName,
      cvc,
      expDate: expDate ? new Date(expDate) : undefined, // Convert expDate to Date object
    };

    // Filter out undefined values in the update object
    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key]
    );

    // Perform the update
    const updatedCard = await db.paymentCardDetails.update({
      where: { id },
      data: updateData,
    });

    return updatedCard;
  } catch (error) {
    console.error("[updateCardDetails] Error updating card details:", error);
    return null;
  }
}
