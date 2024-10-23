import { NextResponse } from "next/server";
import updateCardDetails from "../../../../../actions/patch-paymentCard";
import deleteCardDetails from "../../../../../actions/delete-paymentCard";

// PATCH Route (Updating Payment Card Details)
export async function PATCH(
  req: Request,
  { params }: { params: { payId: string } },
) {
  try {
    const { payId } = params; // Extract the payment card ID from the URL
    const values = await req.json(); // Parse the request body to get the new values

    // Call the `updateCardDetails` function with the extracted ID and the new values
    const updatedCard = await updateCardDetails({ id: Number(payId), ...values });

    if (!updatedCard) {
      return new NextResponse("Failed to update payment card details", {
        status: 404,
      });
    }

    // Return the updated card details in the response
    return NextResponse.json(updatedCard);
  } catch (error) {
    console.error("[CARD_DETAILS_PATCH_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// DELETE Route (Deleting Payment Card Details)
export async function DELETE(
  req: Request,
  { params }: { params: { payId: string } },
) {
  try {
    const { payId } = params; // Extract the payment card ID from the URL

    // Log the payId to confirm it's received correctly
    console.log("Deleting payment card with ID:", payId);

    // Call the `deleteCardDetails` function with the card ID
    const deletedCard = await deleteCardDetails({ id: Number(payId) });

    if (!deletedCard) {
      return new NextResponse("Payment card not found or failed to delete", {
        status: 404,
      });
    }

    // Return the deleted card details in the response
    return NextResponse.json(deletedCard);
  } catch (error) {
    console.error("[DELETE_CARD_DETAILS_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
