import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

const prisma = new PrismaClient();

// POST request: Create a new Feedback record
export async function POST(request: NextRequest) {
  const { feedback, aid, location, type, driver } = await request.json();

  // Log incoming request body for debugging
  console.log("Incoming request body:", { feedback, aid, location, type, driver });

  // Validate input
  if (!feedback || !aid || !location || !type || !driver) {
    return NextResponse.json(
      { message: "Feedback, Pickup ID, Location, Type, and Driver are required." },
      { status: 400 }
    );
  }

  // Insert feedback into your database here
  try {
    const newFeedback = await prisma.feedback.create({
      data: {
        aid: aid,                   // Ensure this field matches your Prisma schema
        location: location,         // Ensure this field matches your Prisma schema
        type: type,                 // Ensure this field matches your Prisma schema
        date: new Date(),           // You can set the date explicitly if required, or it will default to now()
        driver: driver,             // Ensure this field matches your Prisma schema
        Feedback: feedback,         // This must match your schema exactly (case-sensitive)
      },
    });
    return NextResponse.json(
      { message: "Feedback submitted successfully!", newFeedback },
      { status: 201 }
    );
  } catch (error) {
    console.error("Database insertion error:", error);
    return NextResponse.json(
      { message: "Failed to insert feedback.", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// GET request: Fetch all Feedback records
export async function GET() {
  try {
    const feedbacks = await prisma.feedback.findMany();
    return NextResponse.json({ feedbacks }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Error fetching feedbacks", error: errorMessage },
      { status: 500 }
    );
  }
}

// DELETE request: Delete a Feedback record by its ID
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
    // Find the Feedback by its ID and delete it
    const deletedFeedback = await prisma.feedback.delete({
      where: {
        id: parseInt(id), // Ensure the ID is a number
      },
    });

    return NextResponse.json(
      { message: "Feedback deleted", deletedFeedback },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Error deleting Feedback", error: errorMessage },
      { status: 500 }
    );
  }
}
