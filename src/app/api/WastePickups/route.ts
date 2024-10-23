import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

const prisma = new PrismaClient();

// POST request: Create a new WastePickup with location, type, description, date, driver, status, and apid
export async function POST(request: NextRequest) {
  try {
    // Parse the request body to extract data
    const { apid, location, type, description, date, driver, Status } = await request.json();
    
    // Validate required fields
    if (!apid || !location || !type || !description || !driver || !Status) {
      return NextResponse.json(
        { message: "APID, location, type, description, driver, and Status are required" },
        { status: 400 }
      );
    }
    
    // Create the new WastePickup, setting the date if provided
    const newWastePickup = await prisma.wastePickup.create({
      data: {
        apid,
        location,
        type,
        description,
        date: date ? new Date(date) : undefined, // Set date if provided, otherwise default to now()
        driver,
        Status,
      },
    });

    // Respond with success message and new WastePickup data
    return NextResponse.json(
      { message: "WastePickup Created", newWastePickup },
      { status: 201 }
    );
  } catch (error) {
    // Handle any errors and respond with a meaningful message
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Error creating WastePickup", error: errorMessage },
      { status: 500 }
    );
  }
}

// GET request: Fetch all WastePickups
export async function GET() {
  try {
    const wastePickups = await prisma.wastePickup.findMany();
    return NextResponse.json({ wastePickups });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Error fetching WastePickups", error: errorMessage },
      { status: 500 }
    );
  }
}

// DELETE request: Delete a WastePickup by its ID
export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");

  // Validate that ID is provided
  if (!id) {
    return NextResponse.json(
      { message: "ID is required" },
      { status: 400 }
    );
  }

  try {
    // Find the WastePickup by its ID and delete it
    const deletedPickup = await prisma.wastePickup.delete({
      where: {
        id: parseInt(id), // Ensure the ID is a number
      },
    });

    return NextResponse.json(
      { message: "WastePickup deleted", deletedPickup },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Error deleting WastePickup", error: errorMessage },
      { status: 500 }
    );
  }
}
