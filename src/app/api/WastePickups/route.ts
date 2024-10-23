import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

const prisma = new PrismaClient();

 
export async function POST(request: NextRequest) {
  try {
     
    const { apid, location, type, description, date, driver, Status } = await request.json();
    
   
    if (!apid || !location || !type || !description || !driver || !Status) {
      return NextResponse.json(
        { message: "APID, location, type, description, driver, and Status are required" },
        { status: 400 }
      );
    }
    
    
    const newWastePickup = await prisma.wastePickup.create({
      data: {
        apid,
        location,
        type,
        description,
        date: date ? new Date(date) : undefined,  
        driver,
        Status,
      },
    });

     
    return NextResponse.json(
      { message: "WastePickup Created", newWastePickup },
      { status: 201 }
    );
  } catch (error) {
     
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Error creating WastePickup", error: errorMessage },
      { status: 500 }
    );
  }
}

 
export async function GET() {
  try {
    const wastePickups = await prisma.wastePickup.findMany();
    return NextResponse.json({ wastePickups });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Error fetching WastePickups", error: errorMessage },
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
     
    const deletedPickup = await prisma.wastePickup.delete({
      where: {
        id: parseInt(id), // Ensure the ID is a number
      },
    });

    return NextResponse.json(
      { message: "WastePickup deleted", deletedPickup },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Error deleting WastePickup", error: errorMessage },
      { status: 500 }
    );
  }
}
