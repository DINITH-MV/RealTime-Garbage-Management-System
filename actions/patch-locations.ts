import { db } from "../lib/db"; // Importing the db from your Prisma client

type LocationDataUpdateInput = {
  id: string;
  city?: string;
  apiUrl?: string;
  userId?: string;
  marker?: string;
  latitude?: number;
  longitude?: number;
};

type LocationData = {
  id: string;
  city: string;
  apiUrl: string;
  marker: string;
  latitude: number;
  longitude: number;
  createdAt: Date;
};

export default async function updateLocation(
  data: LocationDataUpdateInput,
): Promise<LocationData | null> {
  const { id, ...updateData } = data;

  try {
    // Ensure that the id is provided
    if (!id) {
      throw new Error("ID is required for updating location.");
    }

    // Update the location with the fields provided
    const updatedLocation = await db.location.update({
      where: { id },
      data: updateData,
    });
    console.log(id);
    // Return the updated location
    return updatedLocation;
  } catch (error) {
    console.error("[updateLocation] Error updating location:", error);
    return null;
  }
}
