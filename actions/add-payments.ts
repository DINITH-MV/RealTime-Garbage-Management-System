import PaymentRepository from "../repositories/PaymentRepository";


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

export default async function addPayment(
  data: PaymentDataInput
): Promise<PaymentData> {
  const paymentRepo = new PaymentRepository();
  const newPayment = await paymentRepo.addPayment(data);
  
  return newPayment;
}

