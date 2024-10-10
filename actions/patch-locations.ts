import { db } from "../lib/db"; // Importing the db from your Prisma client

type LocationDataUpdateInput = {
  binId: string;
  city?: string;
  apiUrl?: string;
  marker?: string;
  latitude?: number;
  longitude?: number;
};

type LocationData = {
  binId: string;
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
  const { binId, ...updateData } = data;

  try {
    // Ensure that the id is provided
    if (!binId) {
      throw new Error("ID is required for updating location.");
    }

    // Update the location with the fields provided
    const updatedLocation = await db.location.update({
      where: { binId },
      data: updateData,
    });
    console.log(binId);
    // Return the updated location
    return updatedLocation;
  } catch (error) {
    console.error("[updateLocation] Error updating location:", error);
    return null;
  }
}
