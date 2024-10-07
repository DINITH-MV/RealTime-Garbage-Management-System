import { NextResponse } from "next/server";
import addLocation from "../../../../actions/add-locations";

export async function POST(req: Request) {
  try {
    // Parse the incoming request body
    const locationData = await req.json(); // No destructuring here

    // Check if the necessary data is provided
    if (!locationData) {
      return new NextResponse("Missing location data", { status: 400 });
    }

    // Call the addLocation function to add the location data
    const locationDataSet = await addLocation(locationData);

    // Return a success response with the added location data
    return NextResponse.json({
      message: "Location added successfully",
      locationDataSet,
    });
  } catch (error) {
    // Log the error and return a 500 Internal Server Error response
    console.error("[POST /api/add-location] Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
