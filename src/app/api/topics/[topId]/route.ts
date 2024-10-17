import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

const prisma = new PrismaClient();

// PUT request: Update a Appointment by its ID
export async function PUT(request: NextRequest, { params }: { params: { topId: string } }) {
  try {
    const { topId } = params;

    // Destructure the fields from the request body
    const { location, type, description, date } = await request.json();

    // Update the Appointment by ID
    const updatedAppointment = await prisma.appointment.update({
      where: { id: parseInt(topId) }, // Ensure ID is a number
      data: {
        location,
        type,
        description,
        date: date ? new Date(date) : null, // Handle date formatting if provided
      },
    });

    // Respond with the updated Appointment data
    return NextResponse.json({ message: "Appointment updated", updatedAppointment }, { status: 200 });
  } catch (error) {
    console.error("Error updating Appointment:", error);
    return NextResponse.json({ message: "Failed to update Appointment", error: (error as any).message }, { status: 500 });
  }
}

// GET request: Fetch a Appointment by its ID
export async function GET(request: NextRequest, { params }: { params: { topId: string } }) {
  try {
    const { topId } = params;


    // Fetch the Appointment by ID from the database
    const appointment = await prisma.appointment.findUnique({
      where: { id: parseInt(topId) }, // Ensure ID is a number
    });

    if (!appointment) {
      return NextResponse.json({ message: "Appointment not found" }, { status: 404 });
    }

    return NextResponse.json({ appointment }, { status: 200 });
  } catch (error) {
    console.error("Error fetching Appointment:", error);
    return NextResponse.json({ message: "Failed to fetch Appointment", error: (error as any).message }, { status: 500 });
  }
}

// DELETE request: Delete a Appointment by its ID
export async function DELETE(request: NextRequest, { params }: { params: { topId: string } }) {
  try {
    const { topId } = params;

    console.log(topId)

    
    // Delete the Appointment by ID
    const deletedAppointment = await prisma.appointment.delete({
      where: { id: parseInt(topId) }, // Ensure ID is a number
    });

    // Respond with a success message
    return NextResponse.json({ message: "Appointment deleted successfully", deletedAppointment }, { status: 200 });
  } catch (error) {
    console.error("Error deleting Appointment:", error);
    return NextResponse.json({ message: "Failed to delete Appointment", error: (error as any).message }, { status: 500 });
  }
}
