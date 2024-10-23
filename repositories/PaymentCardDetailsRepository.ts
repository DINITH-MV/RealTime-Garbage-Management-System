import { db } from "../lib/db"; // Assumed Prisma database client

class PaymentCardDetailsRepository {
  // Method to fetch all card details from the database
  async getAllCardDetails() {
    try {
      // Query the database to get all PaymentCardDetails
      const cardDetails = await db.paymentCardDetails.findMany({
        select: {
          id: true,
          cardNumber: true,
          cvc: true,
          expDate: true,
          ownerName: true,
          createdAt: true,
        },
      });

      return cardDetails;
    } catch (error) {
      console.error("Error fetching card details:", error);
      throw new Error("Could not retrieve card details");
    }
  }

  // Method to add new card details
  async addCardDetails(cardDetailsData: {
    cardNumber: string;
    cvc: string;
    expDate: Date;
    ownerName: string;
    paymentId?: number;
  }) {
    try {
      const newCardDetails = await db.paymentCardDetails.create({
        data: {
          cardNumber: cardDetailsData.cardNumber,
          cvc: cardDetailsData.cvc,
          expDate: cardDetailsData.expDate,
          ownerName: cardDetailsData.ownerName,
        },
      });

      return newCardDetails;
    } catch (error) {
      console.error("Error adding card details:", error);
      throw new Error("Could not add card details");
    }
  }
}

export default PaymentCardDetailsRepository;
