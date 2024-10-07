import { NextResponse } from "next/server";
import updateLocation from "../../../../../actions/patch-locations";
import deleteLocation from "../../../../../actions/delete-locations";

// PATCH Route (Updating a Generated Code)
export async function PATCH(
  req: Request,
  { params }: { params: { locId: string } },
) {
  try {
    const { locId } = params;
    const values = await req.json();

    const genCode = await updateLocation({ id: locId, ...values });
    console.log(locId);
    return NextResponse.json(genCode);
  } catch (error) {
    console.log("[GENERATED_CODE_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// DELETE Route (Deleting a Generated Code)
export async function DELETE(
        { params }: { params: { locId: string } }
  ) {
    try {
      
      // Log the locId to confirm it's received correctly
      console.log("Deleting location with ID:", params.locId);
  
      // Call the deleteLocation function
      const deletedLocation = await deleteLocation({ id: params.locId });
  
      if (!deletedLocation) {
        return new NextResponse("Location not found or failed to delete", { status: 404 });
      }
  
      return NextResponse.json(deletedLocation);
    } catch (error) {
      console.error("[DELETE_LOCATION_ERROR]", error);
      return new NextResponse("Internal Server Error", { status: 500 });
    }
  }
