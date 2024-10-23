import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

const prisma = new PrismaClient();

// POST request: Create a new Appointment with location, type, description, date, and paymentStatus
export async function POST(request: NextRequest) {
  try {
    // Parse the request body to extract data
    const { location, type, description, date, paymentStatus, userId } = await request.json();
    
    // Validate required fields
    if (!location || !type || !description) {
      return NextResponse.json({ message: "Location, type, and description are required" }, { status: 400 });
    }
    
    // Create the new Appointment, auto-generating the ID and setting default paymentStatus if not provided
    const newAppointment = await prisma.appointment.create({
      data: {
        userId,
        location,
        type,
        description,
        date: date ? new Date(date) : undefined, // Set date if provided
        paymentStatus: paymentStatus || "pending", // Default paymentStatus is "pending"
      },
    });

    // Respond with success message and new Appointment data
    return NextResponse.json({ message: "Appointment Created", newAppointment }, { status: 201 });
  } catch (error) {
    // Handle any errors and respond with a meaningful message
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ message: "Error creating Appointment", error: errorMessage }, { status: 500 });
  }
}

// GET request: Fetch all Appointments
export async function GET() {
  const Appointments = await prisma.appointment.findMany();
  return NextResponse.json({ Appointments });
}

// DELETE request: Delete an Appointment by its ID
export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");

  // Find the Appointment by its ID and delete it
  await prisma.appointment.delete({
    where: {
      id: id ? parseInt(id) : 0, // Ensure the ID is a number if using an integer ID field
    },
  });

  return NextResponse.json({ message: "Appointment deleted" }, { status: 200 });
}
