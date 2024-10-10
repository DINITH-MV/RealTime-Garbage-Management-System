import { db } from "../lib/db"; // Importing the db from your Prisma client

type LocationDataInput = {
  city: string;
  apiUrl: string;
  marker: string;
  latitude: number;
  longitude: number;
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

export default async function addLocation(
  data: LocationDataInput,
): Promise<LocationData> {
  // Add a new location to the database
  const newLocation = await db.location.create({
    data: {
      city: data.city,
      apiUrl: data.apiUrl,
      marker: data.marker,
      latitude: data.latitude,
      longitude: data.longitude,
    },
  });

  // Return the newly created location
  return newLocation;
}
