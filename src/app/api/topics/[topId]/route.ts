import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

const prisma = new PrismaClient();

// PUT request: Update a topic by its ID
export async function PUT(request: NextRequest, { params }: { params: { topId: string } }) {
  try {
    const { topId } = params;

    // Destructure the fields from the request body
    const { location, type, description, date } = await request.json();

    // Update the topic by ID
    const updatedTopic = await prisma.topic.update({
      where: { id: parseInt(topId) }, // Ensure ID is a number
      data: {
        location,
        type,
        description,
        date: date ? new Date(date) : null, // Handle date formatting if provided
      },
    });

    // Respond with the updated topic data
    return NextResponse.json({ message: "Topic updated", updatedTopic }, { status: 200 });
  } catch (error) {
    console.error("Error updating topic:", error);
    return NextResponse.json({ message: "Failed to update topic", error: (error as any).message }, { status: 500 });
  }
}

// GET request: Fetch a topic by its ID
export async function GET(request: NextRequest, { params }: { params: { topId: string } }) {
  try {
    const { topId } = params;


    // Fetch the topic by ID from the database
    const topic = await prisma.topic.findUnique({
      where: { id: parseInt(topId) }, // Ensure ID is a number
    });

    if (!topic) {
      return NextResponse.json({ message: "Topic not found" }, { status: 404 });
    }

    return NextResponse.json({ topic }, { status: 200 });
  } catch (error) {
    console.error("Error fetching topic:", error);
    return NextResponse.json({ message: "Failed to fetch topic", error: (error as any).message }, { status: 500 });
  }
}

// DELETE request: Delete a topic by its ID
export async function DELETE(request: NextRequest, { params }: { params: { topId: string } }) {
  try {
    const { topId } = params;

    console.log(topId)

    
    // Delete the topic by ID
    const deletedTopic = await prisma.topic.delete({
      where: { id: parseInt(topId) }, // Ensure ID is a number
    });

    // Respond with a success message
    return NextResponse.json({ message: "Topic deleted successfully", deletedTopic }, { status: 200 });
  } catch (error) {
    console.error("Error deleting topic:", error);
    return NextResponse.json({ message: "Failed to delete topic", error: (error as any).message }, { status: 500 });
  }
}
