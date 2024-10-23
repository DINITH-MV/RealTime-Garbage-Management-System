import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

const prisma = new PrismaClient();

// GET_ALL request: Fetch all WastePickup records from the database
export async function GET_ALL() {
  try {
    const wastePickups = await prisma.wastePickup.findMany();
    return NextResponse.json({ wastePickups }, { status: 200 });
  } catch (error) {
    console.error("Error fetching all WastePickups:", error);
    return NextResponse.json({ message: "Failed to fetch WastePickups", error: (error as any).message }, { status: 500 });
  }
}

// PUT request: Update a WastePickup by its ID (full update)
export async function PUT(request: NextRequest, { params }: { params: { wastePickupId: string } }) {
  try {
    const { wastePickupId } = params;

    if (!wastePickupId || isNaN(Number(wastePickupId))) {
      return NextResponse.json({ message: "Invalid waste pickup ID" }, { status: 400 });
    }

    // Destructure the fields from the request body
    const { driver, Status } = await request.json();

    // Ensure all required fields are provided for a full update
    if ( !driver || !Status) {
      return NextResponse.json({ message: " driver, and Status are required" }, { status: 400 });
    }

    // Update the WastePickup by ID
    const updatedWastePickup = await prisma.wastePickup.update({
      where: { id: parseInt(wastePickupId) },
      data: {
        
        driver,
        Status,
      },
    });

    return NextResponse.json({ message: "WastePickup updated", updatedWastePickup }, { status: 200 });
  } catch (error) {
    console.error("Error updating WastePickup:", error);
    return NextResponse.json({ message: "Failed to update WastePickup", error: (error as any).message }, { status: 500 });
  }
}

// PATCH request: Partially update a WastePickup by its ID
export async function PATCH(request: NextRequest, { params }: { params: { wastePickupId: string } }) {
  try {
    const { wastePickupId } = params;

    if (!wastePickupId || isNaN(Number(wastePickupId))) {
      return NextResponse.json({ message: "Invalid waste pickup ID" }, { status: 400 });
    }

    const { apid, location, type, description, date, driver, Status } = await request.json();

    const updateData: any = {};
    if (apid !== undefined) updateData.apid = apid;
    if (location !== undefined) updateData.location = location;
    if (type !== undefined) updateData.type = type;
    if (description !== undefined) updateData.description = description;
    if (date !== undefined) updateData.date = date ? new Date(date) : null;
    if (driver !== undefined) updateData.driver = driver;
    if (Status !== undefined) updateData.Status = Status;

    const updatedWastePickup = await prisma.wastePickup.update({
      where: { id: parseInt(wastePickupId) },
      data: updateData,
    });

    return NextResponse.json({ message: "WastePickup partially updated", updatedWastePickup }, { status: 200 });
  } catch (error) {
    console.error("Error partially updating WastePickup:", error);
    return NextResponse.json({ message: "Failed to partially update WastePickup", error: (error as any).message }, { status: 500 });
  }
}

// GET request: Fetch a WastePickup by its ID
export async function GET(request: NextRequest, { params }: { params: { wastePickupId: string } }) {
  try {
    const { wastePickupId } = params;

    if (!wastePickupId || isNaN(Number(wastePickupId))) {
      return NextResponse.json({ message: "Invalid waste pickup ID" }, { status: 400 });
    }

    const wastePickup = await prisma.wastePickup.findUnique({
      where: { id: parseInt(wastePickupId) },
    });

    if (!wastePickup) {
      return NextResponse.json({ message: "WastePickup not found" }, { status: 404 });
    }

    return NextResponse.json({ wastePickup }, { status: 200 });
  } catch (error) {
    console.error("Error fetching WastePickup:", error);
    return NextResponse.json({ message: "Failed to fetch WastePickup", error: (error as any).message }, { status: 500 });
  }
}

// DELETE request: Delete a WastePickup by its ID
export async function DELETE(request: NextRequest, { params }: { params: { wastePickupId: string } }) {
  try {
    const { wastePickupId } = params;

    if (!wastePickupId || isNaN(Number(wastePickupId))) {
      return NextResponse.json({ message: "Invalid waste pickup ID" }, { status: 400 });
    }

    const deletedWastePickup = await prisma.wastePickup.delete({
      where: { id: parseInt(wastePickupId) },
    });

    return NextResponse.json({ message: "WastePickup deleted successfully", deletedWastePickup }, { status: 200 });
  } catch (error) {
    console.error("Error deleting WastePickup:", error);
    return NextResponse.json({ message: "Failed to delete WastePickup", error: (error as any).message }, { status: 500 });
  }
}
