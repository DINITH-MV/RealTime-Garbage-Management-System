import { db } from "../lib/db";
import { format } from "date-fns";
import LocationRepository from "../repositories/LocationRepository"; // Import the repository

type LocationData = {
  binId: string;
  city: string;
  apiUrl: string;
  marker: string;
  latitude: number;
  longitude: number;
  createdAt: string;
};

// Create an instance of the LocationRepository
const locationRepo = new LocationRepository();

export default async function getAllLocations(): Promise<LocationData[]> {
  // Fetch all locations from the repository
  const LOCATION = await locationRepo.getAllLocations();

  // Format the `createdAt` field to a specific date-time string format
  const formattedLocations: LocationData[] = LOCATION.map((location) => ({
    binId: location.binId,
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
