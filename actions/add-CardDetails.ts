import PaymentCardDetailsRepository from "../repositories/PaymentCardDetailsRepository";

const paymentCardRepo = new PaymentCardDetailsRepository();

export default async function addCardDetails(cardDetailsData: {
  cardNumber: string;
  cvc: string;
  expDate: Date;
  ownerName: string;
}) {
  // Call the repository function to add card details
  const newCardDetails = await paymentCardRepo.addCardDetails(cardDetailsData);

  return newCardDetails;
}
