import { NextResponse } from "next/server";
import addPayment from "../../../../actions/add-payments";

export async function POST(req: Request) {
  try {
    // Parse the incoming request body
    const paymentData = await req.json(); // No destructuring here

    // Check if the necessary data is provided
    if (!paymentData) {
      return new NextResponse("Missing payment data", { status: 400 });
    }

    // Call the addPayment function to add the payment data
    const paymentDataSet = await addPayment(paymentData);

    // Return a success response with the added payment data
    return NextResponse.json({
      message: "Payment added successfully",
      paymentDataSet,
    });
  } catch (error) {
    // Log the error and return a 500 Internal Server Error response
    console.error("[POST /api/add-payment] Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
