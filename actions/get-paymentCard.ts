import { db } from "../lib/db"; // Assuming db is your Prisma client instance
import { format } from "date-fns";

type PaymentCardDetailsData = {
  id: number;
  cardNumber: string;
  cvc: string;
  expDate: Date;
  ownerName: string;
  createdAt: string;
};

export default async function getAllCardDetails(): Promise<PaymentCardDetailsData[]> {
  // Directly fetch all card details from the database using Prisma
  const cardDetails = await db.paymentCardDetails.findMany(); // This assumes you're using Prisma and have a `paymentCardDetails` model

  // Format and structure the card details data
  const formattedCardDetails: PaymentCardDetailsData[] = cardDetails.map((cardDetail) => ({
    id: cardDetail.id,
    cardNumber: cardDetail.cardNumber,
    cvc: cardDetail.cvc,
    expDate: cardDetail.expDate,
    ownerName: cardDetail.ownerName,
    createdAt: format(cardDetail.createdAt, "yyyy-MM-dd HH:mm:ss"), // Formatting the `createdAt` field
  }));

  // Return the formatted card details
  return formattedCardDetails;
}
