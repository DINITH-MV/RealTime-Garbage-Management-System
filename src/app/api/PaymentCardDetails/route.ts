import { NextResponse } from "next/server";
import getAllPayments from "../../../../actions/get-payments"; // Assume this is a function to fetch all payments
import addCardDetails from "../../../../actions/add-CardDetails"; // For adding card details
import getAllCardDetails from "../../../../actions/get-paymentCard";

export async function POST(req: Request) {
  try {
    // Parse the incoming request body
    const paymentData = await req.json();

    // Check if the necessary payment and card data is provided
    const { cardDetails, ...payment } = paymentData;

    if (!payment || !cardDetails) {
      return new NextResponse("Missing payment or card details", { status: 400 });
    }

    // Call the addCardDetails function to add the card details
    const cardDetailsSet = await addCardDetails(cardDetails); // Link to the payment ID

    // Return a success response with the added payment and card data
    return NextResponse.json({
      message: "Payment and card details added successfully",
      cardDetailsSet,
    });
  } catch (error) {
    // Log the error and return a 500 Internal Server Error response
    console.error("[POST /api/payment] Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET() {
  try {
    // Call the getAllPayments function to fetch all payments (card details)
    const cardDetails = await getAllCardDetails(); // Ensure this returns an array

    // Return the payments (card details) data as a JSON response
    return NextResponse.json({
      message: "Cards fetched successfully",
      PaymentCardDetails: cardDetails, // Use PaymentCardDetails as the key to match frontend expectations
    });
  } catch (error) {
    // Log the error and return a 500 Internal Server Error response
    console.error("[GET /api/payment] Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

