import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

const prisma = new PrismaClient();

// POST request: Create a new topic with location, type, description, and date
export async function POST(request: NextRequest) {
  try {
    // Parse the request body to extract data
    const { location, type, description, date } = await request.json();
    
    // Validate required fields
    if (!location || !type || !description) {
      return NextResponse.json({ message: "Location, type, and description are required" }, { status: 400 });
    }
    
    // Create the new topic, auto-generating the ID
    const newTopic = await prisma.topic.create({
      data: {
        location,
        type,
        description,
        date: date ? new Date(date) : undefined, // Set date if provided
      },
    });

    // Respond with success message and new topic data
    return NextResponse.json({ message: "Topic Created", newTopic }, { status: 201 });
  } catch (error) {
    // Handle any errors and respond with a meaningful message
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ message: "Error creating topic", error: errorMessage }, { status: 500 });
  }
}

// GET request: Fetch all topics
export async function GET() {
  const topics = await prisma.topic.findMany();
  return NextResponse.json({ topics });
}

// DELETE request: Delete a topic by its ID
export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");

  // Find the topic by its ID and delete it
  await prisma.topic.delete({
    where: {
      id: id ? parseInt(id) : 0, // Ensure the ID is a number if using an integer ID field
    },
  });

  return NextResponse.json({ message: "Topic deleted" }, { status: 200 });
}
