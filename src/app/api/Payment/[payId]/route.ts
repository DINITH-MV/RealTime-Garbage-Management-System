import { NextResponse } from "next/server";
import updatePayment from "../../../../../actions/patch-payments";
import deletePayment from "../../../../../actions/delete-payments";

// PATCH Route (Updating a Generated Code)
export async function PATCH(
  req: Request,
  { params }: { params: { payId: string } },
) {
  try {
    const { payId } = params;
    const values = await req.json();

    const genCode = await updatePayment({ id: payId, ...values });
    console.log(payId);
    return NextResponse.json(genCode);
  } catch (error) {
    console.log("[GENERATED_CODE_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// DELETE Route (Deleting a Generated Code)
export async function DELETE(
  req: Request,
  { params }: { params: { payId: number } },
) {
  try {
    const { payId } = params;

    // Log the payId to confirm it's received correctly
    console.log("Deleting payment with ID:", payId);

    // Call the deletePayment function
    const deletedPayment = await deletePayment({ id: payId });

    if (!deletedPayment) {
      return new NextResponse("Payment not found or failed to delete", {
        status: 406,
      });
    }

    return NextResponse.json(deletedPayment);
  } catch (error) {
    console.error("[DELETE_LOCATION_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
