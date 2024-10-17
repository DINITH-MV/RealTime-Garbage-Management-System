import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

const prisma = new PrismaClient();

// PUT request: Update an Appointment by its ID (full update)
export async function PUT(request: NextRequest, { params }: { params: { appointmentId: string } }) {
  try {
    const { appointmentId } = params;

    // Check if the appointmentId is provided and valid
    if (!appointmentId || isNaN(Number(appointmentId))) {
      return NextResponse.json({ message: "Invalid appointment ID" }, { status: 400 });
    }

    // Destructure the fields from the request body
    const { location, type, description, date, paymentStatus } = await request.json();

    // Update the Appointment by ID (all fields must be provided in PUT)
    const updatedAppointment = await prisma.appointment.update({
      where: { id: parseInt(appointmentId) }, // Ensure ID is a number
      data: {
        location,
        type,
        description,
        date: date ? new Date(date) : null, // Handle date formatting if provided
        paymentStatus: paymentStatus || "pending", // Set default paymentStatus if not provided
      },
    });

    // Respond with the updated Appointment data
    return NextResponse.json({ message: "Appointment updated", updatedAppointment }, { status: 200 });
  } catch (error) {
    console.error("Error updating Appointment:", error);
    return NextResponse.json({ message: "Failed to update Appointment", error: (error as any).message }, { status: 500 });
  }
}

// PATCH request: Partially update an Appointment by its ID
export async function PATCH(request: NextRequest, { params }: { params: { appointmentId: string } }) {
  try {
    const { appointmentId } = params;

    // Check if the appointmentId is provided and valid
    if (!appointmentId || isNaN(Number(appointmentId))) {
      return NextResponse.json({ message: "Invalid appointment ID" }, { status: 400 });
    }

    // Destructure the fields from the request body, allowing partial updates
    const { location, type, description, date, paymentStatus } = await request.json();

    // Build the update object, only include fields that are provided
    const updateData: any = {};
    if (location !== undefined) updateData.location = location;
    if (type !== undefined) updateData.type = type;
    if (description !== undefined) updateData.description = description;
    if (date !== undefined) updateData.date = date ? new Date(date) : null;
    if (paymentStatus !== undefined) updateData.paymentStatus = paymentStatus;

    // Update the Appointment by ID (only the provided fields are updated)
    const updatedAppointment = await prisma.appointment.update({
      where: { id: parseInt(appointmentId) }, // Ensure ID is a number
      data: updateData,
    });

    // Respond with the updated Appointment data
    return NextResponse.json({ message: "Appointment partially updated", updatedAppointment }, { status: 200 });
  } catch (error) {
    console.error("Error partially updating Appointment:", error);
    return NextResponse.json({ message: "Failed to partially update Appointment", error: (error as any).message }, { status: 500 });
  }
}

// GET request: Fetch an Appointment by its ID
export async function GET(request: NextRequest, { params }: { params: { appointmentId: string } }) {
  try {
    const { appointmentId } = params;

    // Validate appointment ID
    if (!appointmentId || isNaN(Number(appointmentId))) {
      return NextResponse.json({ message: "Invalid appointment ID" }, { status: 400 });
    }

    // Fetch the Appointment by ID from the database
    const appointment = await prisma.appointment.findUnique({
      where: { id: parseInt(appointmentId) }, // Ensure ID is a number
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

// DELETE request: Delete an Appointment by its ID
export async function DELETE(request: NextRequest, { params }: { params: { appointmentId: string } }) {
  try {
    const { appointmentId } = params;

    // Validate appointment ID
    if (!appointmentId || isNaN(Number(appointmentId))) {
      return NextResponse.json({ message: "Invalid appointment ID" }, { status: 400 });
    }

    // Delete the Appointment by ID
    const deletedAppointment = await prisma.appointment.delete({
      where: { id: parseInt(appointmentId) }, // Ensure ID is a number
    });

    // Respond with a success message
    return NextResponse.json({ message: "Appointment deleted successfully", deletedAppointment }, { status: 200 });
  } catch (error) {
    console.error("Error deleting Appointment:", error);
    return NextResponse.json({ message: "Failed to delete Appointment", error: (error as any).message }, { status: 500 });
  }
}
