import { db } from "../lib/db"; // Importing the db from your Prisma client
import { format } from "date-fns"; // Importing the format function from date-fns

type LocationData = {
  id: string;
  city: string;
  apiUrl: string;
  marker: string;
  latitude: number;
  longitude: number;
  createdAt: string;
};

export default async function getAllLocations(): Promise<LocationData[]> {
  // Fetch all locations from the database, ordered by creation date (descending)
  const LOCATION = await db.location.findMany({
    orderBy: {
      createdAt: "desc", // Order by creation date
    },
  });

  // Format the `createdAt` field to a specific date-time string format
  const formattedLocations: LocationData[] = LOCATION.map((location) => ({
    id: location.id,
    city: location.city,
    apiUrl: location.apiUrl,
    marker: location.marker,
    latitude: location.latitude,
    longitude: location.longitude,
    createdAt: format(location.createdAt, "yyyy-MM-dd HH:mm:ss"), // Formatting the createdAt timestamp
  }));

  // Return the formatted locations
  return formattedLocations;
}
