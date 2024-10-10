import { db } from "../lib/db"; // Import your Prisma client

class LocationRepository {
  async getAllLocations() {
    return await db.location.findMany({
      orderBy: {
        createdAt: "desc", // Order by creation date
      },
    });
  }
}

export default LocationRepository;
