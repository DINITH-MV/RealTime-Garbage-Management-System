import { db } from "../lib/db"; // Importing the db from your Prisma client

type LocationDataDeleteInput = {
  binId: string;
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

export default async function deleteLocation(
  data: LocationDataDeleteInput,
): Promise<LocationData | null> {
  const { binId } = data;
  try {
    // Ensure that the id is provided
    if (!binId) {
      throw new Error("ID is required for deleting location.");
    }

    // Check if the location exists before attempting to delete
    const location = await db.location.findUnique({
      where: { binId },
    });

    if (!location) {
      console.error(`[deleteLocation] Location with ID ${binId} not found.`);
      return null; // Return null if location doesn't exist
    }

    // Proceed to delete the location if found
    const deletedLocation = await db.location.delete({
      where: { binId },
    });

    console.log("Deleted Location ID:", binId);

    // Return the deleted location data
    return deletedLocation;
  } catch (error) {
    console.error("[deleteLocation] Error deleting location:", error);
    return null;
  }
}
