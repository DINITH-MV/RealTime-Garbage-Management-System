import { db } from "../lib/db"; // Import your Prisma client

type LocationDataInput = {
  city: string;
  apiUrl: string;
  marker: string;
  latitude: number;
  longitude: number;
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

class LocationRepository {
  // Method to get all locations ordered by creation date
  async getAllLocations(): Promise<LocationData[]> {
    return await db.location.findMany({
      orderBy: {
        createdAt: "desc", // Order by creation date
      },
    });
  }

  // Method to add a new location to the database
  async addLocation(data: LocationDataInput): Promise<LocationData> {
    const newLocation = await db.location.create({
      data: {
        city: data.city,
        apiUrl: data.apiUrl,
        marker: data.marker,
        latitude: data.latitude,
        longitude: data.longitude,
      },
    });
    return newLocation;
  }
}

export default LocationRepository;
