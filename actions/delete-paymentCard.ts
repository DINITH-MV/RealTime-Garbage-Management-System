import { db } from "../lib/db"; // Importing the db from your Prisma client

type CardDetailsDeleteInput = {
  id: number;
};

type CardDetailsData = {
  id: number;
  cardNumber: string;
  cvc: string;
  expDate: Date;
  ownerName: string;
  createdAt: Date;
};

export default async function deleteCardDetails(
  data: CardDetailsDeleteInput
): Promise<CardDetailsData | null> {
  const { id } = data;

  try {
    // Ensure that the id is provided
    if (!id) {
      throw new Error("ID is required for deleting payment card details.");
    }

    // Check if the card exists before attempting to delete
    const cardDetails = await db.paymentCardDetails.findUnique({
      where: { id },
    });

    if (!cardDetails) {
      console.error(`[deleteCardDetails] Card with ID ${id} not found.`);
      return null; // Return null if the card doesn't exist
    }

    // Proceed to delete the card if found
    const deletedCard = await db.paymentCardDetails.delete({
      where: { id },
    });

    console.log("Deleted Card ID:", id);

    // Return the deleted card data
    return deletedCard;
  } catch (error) {
    console.error("[deleteCardDetails] Error deleting card:", error);
    return null;
  }
}
