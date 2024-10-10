import LocationRepository from "../repositories/LocationRepository";

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

export default async function addLocation(
  data: LocationDataInput,
): Promise<LocationData> {
  const locationRepo = new LocationRepository();
  const newLocation = await locationRepo.addLocation(data);
  
  return newLocation;
}
