import { db } from "../lib/db"; // Importing the db from your Prisma client

type LocationDataDeleteInput = {
  id: string;
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

export default async function deleteLocation(
  data: LocationDataDeleteInput,
): Promise<LocationData | null> {
  const { id } = data;
  try {
    // Ensure that the id is provided
    if (!id) {
      throw new Error("ID is required for deleting location.");
    }

    // Check if the location exists before attempting to delete
    const location = await db.location.findUnique({
      where: { id },
    });

    if (!location) {
      console.error(`[deleteLocation] Location with ID ${id} not found.`);
      return null; // Return null if location doesn't exist
    }

    // Proceed to delete the location if found
    const deletedLocation = await db.location.delete({
      where: { id },
    });

    console.log("Deleted Location ID:", id);

    // Return the deleted location data
    return deletedLocation;
  } catch (error) {
    console.error("[deleteLocation] Error deleting location:", error);
    return null;
  }
}
