import { NextResponse } from "next/server";
import addPayment from "../../../../actions/add-payments";
import getPayments from "../../../../actions/get-payments"; // Import the function to fetch payments

// POST request to add payment
export async function POST(req: Request) {
  try {
    const paymentData = await req.json();

    if (!paymentData) {
      return new NextResponse("Missing payment data", { status: 400 });
    }

    const paymentDataSet = await addPayment(paymentData);

    return NextResponse.json({
      message: "Payment added successfully",
      paymentDataSet,
    });
  } catch (error) {
    console.error("[POST /api/add-payment] Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// GET request to retrieve all payments
export async function GET() {
  try {
    // Fetch all payment data from the database or data source
    const paymentDataSet = await getPayments();

    // Return the payment data in the response
    return NextResponse.json({
      PaymentCardDetails: paymentDataSet, // Ensure it's returned as PaymentCardDetails
    });
  } catch (error) {
    console.error("[GET /api/payment] Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
