import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

const prisma = new PrismaClient();

// POST request: Create a new topic with location, type, description, and date
export async function POST(request: NextRequest) {
  const { location, type, description, date } = await request.json();
  
  // Create the new topic with all the fields
  const newTopic = await prisma.topic.create({
    data: {
      location,
      type,
      description,
      date: date ? new Date(date) : null, // Handle date properly
    },
  });

  return NextResponse.json({ message: "Topic Created", newTopic }, { status: 201 });
}

// GET request: Fetch all topics
export async function GET() {
  // Fetch all topics from the database
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
