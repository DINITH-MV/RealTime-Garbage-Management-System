import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

const prisma = new PrismaClient();

 
export async function GET_ALL() {
  try {
    const feedbacks = await prisma.feedback.findMany();
    return NextResponse.json({ feedbacks }, { status: 200 });
  } catch (error) {
    console.error("Error fetching all Feedback records:", error);
    return NextResponse.json(
      { message: "Failed to fetch Feedback records", error: (error as any).message },
      { status: 500 }
    );
  }
}
 
export async function PUT(request: NextRequest, { params }: { params: { feedbackId: string } }) {
  try {
    const { feedbackId } = params;

    if (!feedbackId || isNaN(Number(feedbackId))) {
      return NextResponse.json({ message: "Invalid Feedback ID" }, { status: 400 });
    }
 
    const { aid, location, type, date, driver, Feedback } = await request.json();

    
    if (!aid || !location || !type || !driver || !Feedback) {
      return NextResponse.json(
        { message: "aid, location, type, driver, and Feedback are required" },
        { status: 400 }
      );
    }

    
    const updatedFeedback = await prisma.feedback.update({
      where: { id: parseInt(feedbackId) },
      data: {
        aid,
        location,
        type,
        date: date ? new Date(date) : undefined,
        driver,
        Feedback,
      },
    });

    return NextResponse.json(
      { message: "Feedback updated", updatedFeedback },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating Feedback:", error);
    return NextResponse.json(
      { message: "Failed to update Feedback", error: (error as any).message },
      { status: 500 }
    );
  }
}


export async function PATCH(request: NextRequest, { params }: { params: { feedbackId: string } }) {
  try {
    const { feedbackId } = params;

    if (!feedbackId || isNaN(Number(feedbackId))) {
      return NextResponse.json({ message: "Invalid Feedback ID" }, { status: 400 });
    }

    const { aid, location, type, date, driver, Feedback } = await request.json();

    const updateData: any = {};
    if (aid !== undefined) updateData.aid = aid;
    if (location !== undefined) updateData.location = location;
    if (type !== undefined) updateData.type = type;
    if (date !== undefined) updateData.date = date ? new Date(date) : null;
    if (driver !== undefined) updateData.driver = driver;
    if (Feedback !== undefined) updateData.Feedback = Feedback;

    const updatedFeedback = await prisma.feedback.update({
      where: { id: parseInt(feedbackId) },
      data: updateData,
    });

    return NextResponse.json(
      { message: "Feedback partially updated", updatedFeedback },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error partially updating Feedback:", error);
    return NextResponse.json(
      { message: "Failed to partially update Feedback", error: (error as any).message },
      { status: 500 }
    );
  }
}

 
export async function GET(request: NextRequest, { params }: { params: { feedbackId: string } }) {
  try {
    const { feedbackId } = params;

    if (!feedbackId || isNaN(Number(feedbackId))) {
      return NextResponse.json({ message: "Invalid Feedback ID" }, { status: 400 });
    }

    const feedback = await prisma.feedback.findUnique({
      where: { id: parseInt(feedbackId) },
    });

    if (!feedback) {
      return NextResponse.json({ message: "Feedback not found" }, { status: 404 });
    }

    return NextResponse.json({ feedback }, { status: 200 });
  } catch (error) {
    console.error("Error fetching Feedback:", error);
    return NextResponse.json(
      { message: "Failed to fetch Feedback", error: (error as any).message },
      { status: 500 }
    );
  }
}

 
export async function DELETE(request: NextRequest, { params }: { params: { feedbackId: string } }) {
  try {
    const { feedbackId } = params;

    if (!feedbackId || isNaN(Number(feedbackId))) {
      return NextResponse.json({ message: "Invalid Feedback ID" }, { status: 400 });
    }

    const deletedFeedback = await prisma.feedback.delete({
      where: { id: parseInt(feedbackId) },
    });

    return NextResponse.json(
      { message: "Feedback deleted successfully", deletedFeedback },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting Feedback:", error);
    return NextResponse.json(
      { message: "Failed to delete Feedback", error: (error as any).message },
      { status: 500 }
    );
  }
}
