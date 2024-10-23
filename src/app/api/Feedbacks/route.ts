import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

const prisma = new PrismaClient();

 
export async function POST(request: NextRequest) {
  const { feedback, aid, location, type, driver } = await request.json();

   
  console.log("Incoming request body:", { feedback, aid, location, type, driver });

  
  if (!feedback || !aid || !location || !type || !driver) {
    return NextResponse.json(
      { message: "Feedback, Pickup ID, Location, Type, and Driver are required." },
      { status: 400 }
    );
  }

 
  try {
    const newFeedback = await prisma.feedback.create({
      data: {
        aid: aid,                    
        location: location,          
        type: type,                  
        date: new Date(),            
        driver: driver,              
        Feedback: feedback,          
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

 
export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");

  
  if (!id) {
    return NextResponse.json(
      { message: "ID is required" },
      { status: 400 }
    );
  }

  try {
    
    const deletedFeedback = await prisma.feedback.delete({
      where: {
        id: parseInt(id),  
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
